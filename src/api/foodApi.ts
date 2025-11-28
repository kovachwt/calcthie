import { apiClient } from './client';
import type { FoodSearchResult, FoodDetail, NutrientInfo, PortionInfo } from '../types/food';

export interface SearchFoodsParams {
  query: string;
  dataType?: string;
  dataTypes?: string[];
  limit?: number;
  offset?: number;
}

export const foodApi = {
  /**
   * Search for foods by name
   */
  searchFoods: async (params: SearchFoodsParams): Promise<FoodSearchResult[]> => {
    const { data } = await apiClient.get<FoodSearchResult[]>('/search/foods', {
      params: {
        query: params.query,
        dataType: params.dataType,
        dataTypes: params.dataTypes?.length ? params.dataTypes.join(',') : undefined,
        limit: params.limit || 20,
        offset: params.offset || 0,
      },
    });
    return data;
  },

  /**
   * Search for food by barcode (UPC/GTIN)
   */
  searchByBarcode: async (upc: string): Promise<FoodSearchResult> => {
    const { data } = await apiClient.get<FoodSearchResult>(`/search/barcode/${upc}`);
    return data;
  },

  /**
   * Get complete food details including nutrients and portions
   */
  getFoodDetails: async (fdcId: number): Promise<FoodDetail> => {
    const { data } = await apiClient.get<FoodDetail>(`/foods/${fdcId}`);
    return data;
  },

  /**
   * Get nutrients for a specific food
   */
  getFoodNutrients: async (
    fdcId: number,
    nutrientIds?: number[]
  ): Promise<NutrientInfo[]> => {
    const { data } = await apiClient.get<NutrientInfo[]>(`/foods/${fdcId}/nutrients`, {
      params: nutrientIds ? { nutrientIds: nutrientIds.join(',') } : undefined,
    });
    return data;
  },

  /**
   * Get portion/serving size information for a food
   */
  getFoodPortions: async (fdcId: number): Promise<PortionInfo[]> => {
    const { data } = await apiClient.get<PortionInfo[]>(`/foods/${fdcId}/portions`);
    return data;
  },
};
