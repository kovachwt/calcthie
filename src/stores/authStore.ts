import { create } from 'zustand';
import { userApi } from '../api/userApi';
import { storage } from '../utils/storage';

interface User {
  id: string; // Google user ID
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => Promise<void>;
  signOut: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: async (user) => {
    if (user) {
      try {
        // Try to get existing user
        await userApi.getUser(user.id);
      } catch (error: any) {
        // User doesn't exist, create them
        if (error.response?.status === 404) {
          try {
            await userApi.createUser({
              userId: user.id,
              email: user.email,
              name: user.name,
            });
            console.log('[Auth] Created new user in database');
          } catch (createError) {
            console.error('[Auth] Failed to create user:', createError);
          }
        }
      }

      // Save user to localStorage
      storage.user.save(user);
    } else {
      // Clear user from localStorage
      storage.user.clear();
    }

    set({
      user,
      isAuthenticated: user !== null
    });
  },

  signOut: () => {
    storage.user.clear();
    set({
      user: null,
      isAuthenticated: false
    });
  },

  initializeAuth: async () => {
    // Try to restore user from localStorage
    const savedUser = storage.user.load<User | null>(null);

    if (savedUser) {
      console.log('[Auth] Restored user from localStorage:', savedUser.email);
      set({
        user: savedUser,
        isAuthenticated: true
      });
    }
  },
}));
