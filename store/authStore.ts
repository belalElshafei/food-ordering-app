import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user: AuthUser) => set({ user, isLoggedIn: true }),

      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'food-auth-storage',
    }
  )
);
