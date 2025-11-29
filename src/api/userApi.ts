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
  // Get current user (authenticated via JWT)
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user/me');
    return response.data;
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/user', data);
    return response.data;
  },

  // Update user info (authenticated via JWT)
  updateUser: async (data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>('/user', data);
    return response.data;
  },

  // Delete user (authenticated via JWT)
  deleteUser: async (): Promise<void> => {
    await apiClient.delete('/user');
  },

  // Get user favorites (authenticated via JWT)
  getFavorites: async (): Promise<number[]> => {
    const response = await apiClient.get<number[]>('/user/favorites');
    return response.data;
  },

  // Update favorites (replace all) (authenticated via JWT)
  updateFavorites: async (favorites: number[]): Promise<number[]> => {
    const response = await apiClient.put<number[]>('/user/favorites', { favorites });
    return response.data;
  },

  // Add a single favorite (authenticated via JWT)
  addFavorite: async (fdcId: number): Promise<number[]> => {
    const response = await apiClient.post<number[]>(`/user/favorites/${fdcId}`);
    return response.data;
  },

  // Remove a single favorite (authenticated via JWT)
  removeFavorite: async (fdcId: number): Promise<number[]> => {
    const response = await apiClient.delete<number[]>(`/user/favorites/${fdcId}`);
    return response.data;
  },

  // Get current meal (authenticated via JWT)
  getCurrentMeal: async (): Promise<any> => {
    const response = await apiClient.get<any>('/user/current-meal');
    return response.data;
  },

  // Update current meal (authenticated via JWT)
  updateCurrentMeal: async (currentMeal: any): Promise<any> => {
    const response = await apiClient.put<any>('/user/current-meal', { currentMeal });
    return response.data;
  },
};
