import { useAuthStore } from '../store/authStore';
import { useAsyncAction } from './useAsync';
import { loginUser, registerUser, updateProfile, changePassword } from '../services/auth';

export function useAuth() {
  return useAuthStore();
}

export function useLogin() {
  const login = useAsyncAction(
    async (email: string, password: string) => {
      return loginUser(email, password);
    },
  );
  return login;
}

export function useRegister() {
  return useAsyncAction(
    async (data: { fullName: string; email: string; phone: string; password: string; role: string }) => {
      return registerUser(data);
    },
  );
}

export function useUpdateProfile() {
  return useAsyncAction(updateProfile);
}

export function useChangePassword() {
  return useAsyncAction(
    async (current: string, newPass: string) => {
      return changePassword(current, newPass);
    },
  );
}
