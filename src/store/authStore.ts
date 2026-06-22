import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const demoUsers: (User & { password: string })[] = [
  { id: 'user-001', email: 'buyer@vestra.com', fullName: 'John Doe', phone: '+254711111111', role: 'buyer', isVerified: true, isKycVerified: true, location: 'Nairobi', password: 'password' },
  { id: 'user-002', email: 'seller@vestra.com', fullName: 'Jane Muthoni', phone: '+254722222222', role: 'seller', isVerified: true, isKycVerified: true, location: 'Karen', password: 'password' },
  { id: 'user-003', email: 'landlord@vestra.com', fullName: 'Sammy Ndungu', phone: '+254733333333', role: 'landlord', isVerified: true, isKycVerified: true, location: 'Kilimani', password: 'password' },
  { id: 'user-004', email: 'tenant@vestra.com', fullName: 'Mary Wanjiru', phone: '+254744444444', role: 'tenant', isVerified: true, isKycVerified: false, location: 'Westlands', password: 'password' },
  { id: 'user-005', email: 'agent@vestra.com', fullName: 'Wanjiku Mwangi', phone: '+254755555555', role: 'agent', isVerified: true, isKycVerified: true, location: 'Nairobi', password: 'password' },
  { id: 'user-006', email: 'admin@vestra.com', fullName: 'Admin User', phone: '+254766666666', role: 'admin', isVerified: true, isKycVerified: true, location: 'Nairobi', password: 'password' },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string, password: string) => {
    const found = demoUsers.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      set({ user, isAuthenticated: true });
      localStorage.setItem('vestra_user', JSON.stringify(user));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('vestra_user');
  },
}));

export const initAuth = () => {
  const stored = localStorage.getItem('vestra_user');
  if (stored) {
    try {
      const user = JSON.parse(stored) as User;
      useAuthStore.setState({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('vestra_user');
    }
  }
};
