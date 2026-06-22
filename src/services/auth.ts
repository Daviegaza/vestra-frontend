import { useAuthStore } from '../store/authStore';
import { mockCall } from './api';
import type { User } from '../types';

export async function loginUser(email: string, password: string): Promise<User> {
  const result = useAuthStore.getState().login(email, password);
  if (!result) throw new Error('Invalid email or password');
  return mockCall(useAuthStore.getState().user!);
}

export async function registerUser(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}): Promise<User> {
  const user: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    role: data.role as User['role'],
    isVerified: true,
    isKycVerified: false,
    location: '',
  };
  // Log them in
  useAuthStore.setState({ user, isAuthenticated: true });
  localStorage.setItem('vestra_user', JSON.stringify(user));
  return mockCall(user);
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const store = useAuthStore.getState();
  if (!store.user) throw new Error('Not authenticated');
  const updated = { ...store.user, ...data };
  useAuthStore.setState({ user: updated });
  localStorage.setItem('vestra_user', JSON.stringify(updated));
  return mockCall(updated);
}

export async function changePassword(_current: string, newPass: string): Promise<void> {
  if (newPass.length < 8) throw new Error('New password must be at least 8 characters');
  return mockCall(undefined);
}

export async function logoutUser(): Promise<void> {
  useAuthStore.getState().logout();
  return mockCall(undefined);
}
