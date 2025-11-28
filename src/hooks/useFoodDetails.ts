import { useQuery } from '@tanstack/react-query';
import { foodApi } from '../api/foodApi';

export function useFoodDetails(fdcId: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['foods', 'details', fdcId],
    queryFn: () => foodApi.getFoodDetails(fdcId!),
    enabled: enabled && fdcId !== null,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

export function useFoodNutrients(fdcId: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['foods', 'nutrients', fdcId],
    queryFn: () => foodApi.getFoodNutrients(fdcId!),
    enabled: enabled && fdcId !== null,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFoodPortions(fdcId: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['foods', 'portions', fdcId],
    queryFn: () => foodApi.getFoodPortions(fdcId!),
    enabled: enabled && fdcId !== null,
    staleTime: 10 * 60 * 1000,
  });
}
