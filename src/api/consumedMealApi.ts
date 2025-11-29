import { apiClient } from './client';

export interface ConsumedMeal {
  id: number;
  userId: string;
  mealName: string | null;
  mealData: any;
  totalCalories: number | null;
  totalProtein: number | null;
  totalCarbs: number | null;
  totalFat: number | null;
  consumedAt: string;
  createdAt: string;
}

export interface CreateConsumedMealRequest {
  mealName?: string;
  mealData: any;
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  consumedAt?: string;
}

export const consumedMealApi = {
  // Get all meals for a user (uses JWT authentication)
  getUserMeals: async (): Promise<ConsumedMeal[]> => {
    const response = await apiClient.get<ConsumedMeal[]>('/consumedmeal');
    return response.data;
  },

  // Get meals for a specific date (uses JWT authentication)
  getUserMealsByDate: async (date: Date): Promise<ConsumedMeal[]> => {
    const dateStr = date.toISOString().split('T')[0];
    const response = await apiClient.get<ConsumedMeal[]>(`/consumedmeal/date/${dateStr}`);
    return response.data;
  },

  // Get single meal
  getMeal: async (id: number): Promise<ConsumedMeal> => {
    const response = await apiClient.get<ConsumedMeal>(`/consumedmeal/${id}`);
    return response.data;
  },

  // Create consumed meal (uses JWT authentication)
  createConsumedMeal: async (data: CreateConsumedMealRequest): Promise<ConsumedMeal> => {
    const response = await apiClient.post<ConsumedMeal>('/consumedmeal', data);
    return response.data;
  },

  // Delete consumed meal
  deleteConsumedMeal: async (id: number): Promise<void> => {
    await apiClient.delete(`/consumedmeal/${id}`);
  },
};
