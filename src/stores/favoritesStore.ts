import { create } from 'zustand';
import { storage } from '../utils/storage';
import { userApi } from '../api/userApi';
import { useAuthStore } from './authStore';

interface FavoritesState {
  favorites: number[]; // Array of fdcIds
  addFavorite: (fdcId: number) => void;
  removeFavorite: (fdcId: number) => void;
  isFavorite: (fdcId: number) => boolean;
  toggleFavorite: (fdcId: number) => void;
  loadFromStorage: () => void;
  syncWithBackend: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  addFavorite: (fdcId) => {
    set((state) => {
      if (state.favorites.includes(fdcId)) return state;
      const newFavorites = [...state.favorites, fdcId];
      storage.favorites.save(newFavorites);

      // Sync with backend if user is logged in
      const user = useAuthStore.getState().user;
      if (user) {
        userApi.addFavorite(user.id, fdcId).catch((error) => {
          console.error('[Favorites] Failed to sync add with backend:', error);
        });
      }

      return { favorites: newFavorites };
    });
  },

  removeFavorite: (fdcId) => {
    set((state) => {
      const newFavorites = state.favorites.filter((id) => id !== fdcId);
      storage.favorites.save(newFavorites);

      // Sync with backend if user is logged in
      const user = useAuthStore.getState().user;
      if (user) {
        userApi.removeFavorite(user.id, fdcId).catch((error) => {
          console.error('[Favorites] Failed to sync remove with backend:', error);
        });
      }

      return { favorites: newFavorites };
    });
  },

  isFavorite: (fdcId) => {
    return get().favorites.includes(fdcId);
  },

  toggleFavorite: (fdcId) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(fdcId)) {
      removeFavorite(fdcId);
    } else {
      addFavorite(fdcId);
    }
  },

  loadFromStorage: () => {
    const favorites = storage.favorites.load<number[]>([]);
    set({ favorites });
  },

  syncWithBackend: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      // Get favorites from backend
      const backendFavorites = await userApi.getFavorites(user.id);

      // Merge with local favorites
      const localFavorites = get().favorites;
      const mergedFavorites = Array.from(new Set([...localFavorites, ...backendFavorites]));

      // Update both local and backend
      storage.favorites.save(mergedFavorites);
      set({ favorites: mergedFavorites });

      if (mergedFavorites.length !== backendFavorites.length) {
        await userApi.updateFavorites(user.id, mergedFavorites);
      }

      console.log('[Favorites] Synced with backend');
    } catch (error) {
      console.error('[Favorites] Failed to sync with backend:', error);
    }
  },
}));
