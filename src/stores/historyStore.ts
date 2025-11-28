import { create } from 'zustand';
import type { FoodDetail } from '../types/food';
import { storage } from '../utils/storage';

const MAX_HISTORY_ITEMS = 10;

interface HistoryState {
  recentFoods: FoodDetail[];
  addToHistory: (food: FoodDetail) => void;
  clearHistory: () => void;
  loadFromStorage: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  recentFoods: [],

  addToHistory: (food) => {
    set((state) => {
      // Remove if already exists
      const filtered = state.recentFoods.filter((f) => f.fdcId !== food.fdcId);
      // Add to beginning, keep only last MAX_HISTORY_ITEMS
      const newHistory = [food, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      storage.history.save(newHistory);
      return { recentFoods: newHistory };
    });
  },

  clearHistory: () => {
    storage.history.clear();
    set({ recentFoods: [] });
  },

  loadFromStorage: () => {
    const recentFoods = storage.history.load<FoodDetail[]>([]);
    set({ recentFoods });
  },
}));
