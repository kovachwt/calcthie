import { create } from 'zustand';
import { consumedMealApi, type ConsumedMeal } from '../api/consumedMealApi';
import { useAuthStore } from './authStore';
import type { MealItem, NutrientTotals } from '../types/meal';

interface ConsumedMealsState {
  meals: ConsumedMeal[];
  selectedDate: Date;
  isLoading: boolean;
  initialize: () => Promise<void>;
  setSelectedDate: (date: Date) => void;
  loadMealsForDate: (date: Date) => Promise<void>;
  saveMeal: (mealName: string, items: MealItem[], totals: NutrientTotals) => Promise<void>;
  deleteMeal: (id: number) => Promise<void>;
  getSelectedDateTotals: () => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const useConsumedMealsStore = create<ConsumedMealsState>((set, get) => ({
  meals: [],
  selectedDate: new Date(),
  isLoading: false,

  initialize: async () => {
    const user = useAuthStore.getState().user;
    if (user) {
      await get().loadMealsForDate(new Date());
    }
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().loadMealsForDate(date);
  },

  loadMealsForDate: async (date) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ meals: [] });
      return;
    }

    set({ isLoading: true });
    try {
      const meals = await consumedMealApi.getUserMealsByDate(date);
      set({ meals });
    } catch (error) {
      console.error('[ConsumedMeals] Failed to load meals:', error);
      set({ meals: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  saveMeal: async (mealName, items, totals) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.error('[ConsumedMeals] Cannot save meal: user not logged in');
      return;
    }

    try {
      const selectedDate = get().selectedDate;

      // Create date at current time but on the selected date
      const consumedDate = new Date(selectedDate);
      consumedDate.setHours(new Date().getHours());
      consumedDate.setMinutes(new Date().getMinutes());
      consumedDate.setSeconds(new Date().getSeconds());

      const meal = await consumedMealApi.createConsumedMeal({
        mealName,
        mealData: items,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        consumedAt: consumedDate.toISOString(),
      });

      // Add to current meals if viewing the selected date
      set((state) => ({ meals: [...state.meals, meal] }));

      console.log('[ConsumedMeals] Meal saved successfully to', selectedDate.toDateString());
    } catch (error) {
      console.error('[ConsumedMeals] Failed to save meal:', error);
      throw error;
    }
  },

  deleteMeal: async (id) => {
    try {
      await consumedMealApi.deleteConsumedMeal(id);
      set((state) => ({ meals: state.meals.filter((m) => m.id !== id) }));
      console.log('[ConsumedMeals] Meal deleted successfully');
    } catch (error) {
      console.error('[ConsumedMeals] Failed to delete meal:', error);
      throw error;
    }
  },

  getSelectedDateTotals: () => {
    const meals = get().meals;
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.totalCalories || 0),
        protein: acc.protein + (meal.totalProtein || 0),
        carbs: acc.carbs + (meal.totalCarbs || 0),
        fat: acc.fat + (meal.totalFat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  },
}));
