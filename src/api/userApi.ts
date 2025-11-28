import { apiClient } from './client';

export interface User {
  userId: string;
  email: string | null;
  name: string | null;
  favorites: number[];
  currentMeal: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  userId: string;
  email?: string;
  name?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

export const userApi = {
  // Get user by ID
  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/user', data);
    return response.data;
  },

  // Update user info
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/user/${userId}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/user/${userId}`);
  },

  // Get user favorites
  getFavorites: async (userId: string): Promise<number[]> => {
    const response = await apiClient.get<number[]>(`/user/${userId}/favorites`);
    return response.data;
  },

  // Update favorites (replace all)
  updateFavorites: async (userId: string, favorites: number[]): Promise<number[]> => {
    const response = await apiClient.put<number[]>(`/user/${userId}/favorites`, { favorites });
    return response.data;
  },

  // Add a single favorite
  addFavorite: async (userId: string, fdcId: number): Promise<number[]> => {
    const response = await apiClient.post<number[]>(`/user/${userId}/favorites/${fdcId}`);
    return response.data;
  },

  // Remove a single favorite
  removeFavorite: async (userId: string, fdcId: number): Promise<number[]> => {
    const response = await apiClient.delete<number[]>(`/user/${userId}/favorites/${fdcId}`);
    return response.data;
  },

  // Get current meal
  getCurrentMeal: async (userId: string): Promise<any> => {
    const response = await apiClient.get<any>(`/user/${userId}/current-meal`);
    return response.data;
  },

  // Update current meal
  updateCurrentMeal: async (userId: string, currentMeal: any): Promise<any> => {
    const response = await apiClient.put<any>(`/user/${userId}/current-meal`, { currentMeal });
    return response.data;
  },
};
