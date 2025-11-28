import { create } from 'zustand';
import type { MealItem, NutrientTotals } from '../types/meal';
import type { FoodDetail, PortionInfo } from '../types/food';
import {
  calculateNutrientsForPortion,
  calculateTotalGrams,
  calculateMealTotals,
} from '../utils/nutrition';
import { storage } from '../utils/storage';
import { userApi } from '../api/userApi';
import { useAuthStore } from './authStore';

interface MealState {
  items: MealItem[];
  addItem: (food: FoodDetail, portion: PortionInfo, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number, portion?: PortionInfo) => void;
  clearMeal: () => void;
  loadMeal: (items: MealItem[]) => void;
  getTotals: () => NutrientTotals;
  loadFromStorage: () => void;
  syncWithBackend: () => Promise<void>;
}

export const useMealStore = create<MealState>((set, get) => ({
  items: [],

  addItem: (food, portion, quantity) => {
    const totalGrams = calculateTotalGrams(portion, quantity);
    const nutrients = calculateNutrientsForPortion(food.nutrients, totalGrams);

    const newItem: MealItem = {
      id: `${food.fdcId}-${Date.now()}`,
      food,
      portion,
      quantity,
      nutrients,
      totalGrams,
    };

    set((state) => {
      const newItems = [...state.items, newItem];
      storage.meal.save(newItems);

      // Sync with backend if user is logged in
      const user = useAuthStore.getState().user;
      if (user) {
        userApi.updateCurrentMeal(user.id, newItems).catch((error) => {
          console.error('[Meal] Failed to sync add with backend:', error);
        });
      }

      return { items: newItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      storage.meal.save(newItems);

      // Sync with backend if user is logged in
      const user = useAuthStore.getState().user;
      if (user) {
        userApi.updateCurrentMeal(user.id, newItems).catch((error) => {
          console.error('[Meal] Failed to sync remove with backend:', error);
        });
      }

      return { items: newItems };
    });
  },

  updateItem: (id, quantity, portion) => {
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.id === id) {
          const updatedPortion = portion || item.portion;
          const totalGrams = calculateTotalGrams(updatedPortion, quantity);
          const nutrients = calculateNutrientsForPortion(item.food.nutrients, totalGrams);
          return { ...item, quantity, portion: updatedPortion, nutrients, totalGrams };
        }
        return item;
      });
      storage.meal.save(newItems);

      // Sync with backend if user is logged in
      const user = useAuthStore.getState().user;
      if (user) {
        userApi.updateCurrentMeal(user.id, newItems).catch((error) => {
          console.error('[Meal] Failed to sync update with backend:', error);
        });
      }

      return { items: newItems };
    });
  },

  clearMeal: () => {
    storage.meal.clear();
    set({ items: [] });

    // Sync with backend if user is logged in
    const user = useAuthStore.getState().user;
    if (user) {
      userApi.updateCurrentMeal(user.id, []).catch((error) => {
        console.error('[Meal] Failed to sync clear with backend:', error);
      });
    }
  },

  loadMeal: (items) => {
    storage.meal.save(items);
    set({ items });

    // Sync with backend if user is logged in
    const user = useAuthStore.getState().user;
    if (user) {
      userApi.updateCurrentMeal(user.id, items).catch((error) => {
        console.error('[Meal] Failed to sync loaded meal with backend:', error);
      });
    }
  },

  getTotals: () => {
    return calculateMealTotals(get().items);
  },

  loadFromStorage: () => {
    const items = storage.meal.load<MealItem[]>([]);
    set({ items });
  },

  syncWithBackend: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      // Get current meal from backend
      const backendMeal = await userApi.getCurrentMeal(user.id);

      // For now, prioritize local state (since backend meal might be from another device)
      // In the future, could implement more sophisticated merging logic
      const localItems = get().items;

      if (localItems.length > 0) {
        // Push local meal to backend
        await userApi.updateCurrentMeal(user.id, localItems);
        console.log('[Meal] Pushed local meal to backend');
      } else if (backendMeal && Array.isArray(backendMeal) && backendMeal.length > 0) {
        // Pull backend meal to local
        storage.meal.save(backendMeal);
        set({ items: backendMeal });
        console.log('[Meal] Pulled backend meal to local');
      }
    } catch (error) {
      console.error('[Meal] Failed to sync with backend:', error);
    }
  },
}));
