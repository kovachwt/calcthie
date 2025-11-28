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
  // Get all meals for a user
  getUserMeals: async (userId: string): Promise<ConsumedMeal[]> => {
    const response = await apiClient.get<ConsumedMeal[]>(`/consumedmeal/user/${userId}`);
    return response.data;
  },

  // Get meals for a specific date
  getUserMealsByDate: async (userId: string, date: Date): Promise<ConsumedMeal[]> => {
    const dateStr = date.toISOString().split('T')[0];
    const response = await apiClient.get<ConsumedMeal[]>(`/consumedmeal/user/${userId}/date/${dateStr}`);
    return response.data;
  },

  // Get single meal
  getMeal: async (id: number): Promise<ConsumedMeal> => {
    const response = await apiClient.get<ConsumedMeal>(`/consumedmeal/${id}`);
    return response.data;
  },

  // Create consumed meal
  createConsumedMeal: async (userId: string, data: CreateConsumedMealRequest): Promise<ConsumedMeal> => {
    const response = await apiClient.post<ConsumedMeal>(`/consumedmeal/user/${userId}`, data);
    return response.data;
  },

  // Delete consumed meal
  deleteConsumedMeal: async (id: number): Promise<void> => {
    await apiClient.delete(`/consumedmeal/${id}`);
  },
};
