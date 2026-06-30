import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { apiRequest, setToken, getToken, ApiError } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  /** Legacy sync login for demo accounts (kept for back-compat — uses backend). */
  login: (email: string, password: string) => boolean;
  loginAsync: (email: string, password: string) => Promise<User>;
  registerAsync: (data: { email: string; password: string; fullName: string; phone: string }) => Promise<User>;
  logout: () => void;
  activateRole: (role: UserRole, meta?: Record<string, string | number | boolean>) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  removeRole: (role: UserRole) => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;
}

const STORAGE_KEY = 'vestra_user';

function withMirror(user: User): User {
  const roles = user.roles && user.roles.length ? user.roles : (['buyer'] as UserRole[]);
  const activeRole = user.activeRole || roles[0];
  return { ...user, roles, activeRole, role: activeRole };
}

function persist(user: User | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: (email, password) => {
    // Kick off async login but return boolean immediately for legacy callers.
    void get().loginAsync(email, password).catch(() => undefined);
    return true;
  },

  loginAsync: async (email, password) => {
    set({ loading: true });
    try {
      const res = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
      setToken(res.token);
      const user = withMirror(res.user);
      set({ user, isAuthenticated: true, loading: false });
      persist(user);
      return user;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  registerAsync: async (data) => {
    set({ loading: true });
    try {
      const res = await apiRequest<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: data,
        auth: false,
      });
      setToken(res.token);
      const user = withMirror(res.user);
      set({ user, isAuthenticated: true, loading: false });
      persist(user);
      return user;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: () => {
    setToken(null);
    persist(null);
    set({ user: null, isAuthenticated: false });
  },

  activateRole: async (role, meta) => {
    const res = await apiRequest<{ user: User }>('/api/roles/activate', {
      method: 'POST',
      body: { role, meta },
    });
    const user = withMirror(res.user);
    set({ user });
    persist(user);
  },

  switchRole: async (role) => {
    const res = await apiRequest<{ user: User }>('/api/roles/switch', {
      method: 'POST',
      body: { role },
    });
    const user = withMirror(res.user);
    set({ user });
    persist(user);
  },

  removeRole: async (role) => {
    if (role === 'buyer') return;
    const res = await apiRequest<{ user: User }>(`/api/roles/${role}`, { method: 'DELETE' });
    const user = withMirror(res.user);
    set({ user });
    persist(user);
  },

  updateUser: async (patch) => {
    const res = await apiRequest<{ user: User }>('/api/users/me', {
      method: 'PATCH',
      body: patch,
    });
    const user = withMirror(res.user);
    set({ user });
    persist(user);
  },
}));

export const initAuth = async () => {
  const token = getToken();
  const stored = localStorage.getItem(STORAGE_KEY);

  // Stale cached user without a matching token = signed out. Clear quietly.
  if (!token) {
    if (stored) localStorage.removeItem(STORAGE_KEY);
    useAuthStore.setState({ user: null, isAuthenticated: false });
    return;
  }

  // Optimistic hydrate so the UI has a user immediately.
  if (stored) {
    try {
      const cached = JSON.parse(stored) as User;
      useAuthStore.setState({ user: withMirror(cached), isAuthenticated: true });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Verify the token with the backend.
  try {
    const res = await apiRequest<{ user: User }>('/api/auth/me');
    const user = withMirror(res.user);
    useAuthStore.setState({ user, isAuthenticated: true });
    persist(user);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      setToken(null);
      persist(null);
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }
    // For network errors (status 0), keep optimistic hydration so the UI is usable offline.
  }
};

export const useActiveRole = (): UserRole => useAuthStore((s) => s.user?.activeRole || 'buyer');
