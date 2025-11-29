import { create } from 'zustand';
import { storage } from '../utils/storage';
import { apiClient } from '../api/client';

interface User {
  id: string; // Google user ID
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authenticateWithGoogle: (googleToken: string) => Promise<void>;
  signOut: () => void;
  initializeAuth: () => Promise<void>;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  authenticateWithGoogle: async (googleToken: string) => {
    try {
      // Send Google token to backend to exchange for our JWT
      const response = await apiClient.post<{
        token: string;
        user: { id: string; email: string; name: string };
      }>('/auth/google', { googleToken });

      const { token, user } = response.data;

      // Save both user and token to localStorage
      storage.auth.save({ user, token });

      set({
        user,
        token,
        isAuthenticated: true
      });

      console.log('[Auth] Successfully authenticated user:', user.email);
    } catch (error) {
      console.error('[Auth] Failed to authenticate with backend:', error);
      throw error;
    }
  },

  signOut: () => {
    storage.auth.clear();
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  initializeAuth: async () => {
    // Try to restore auth from localStorage
    const savedAuth = storage.auth.load<{ user: User; token: string } | null>(null);

    if (savedAuth && savedAuth.user && savedAuth.token) {
      console.log('[Auth] Restored auth from localStorage:', savedAuth.user.email);
      set({
        user: savedAuth.user,
        token: savedAuth.token,
        isAuthenticated: true
      });
    }
  },

  getToken: () => {
    return get().token;
  },
}));
