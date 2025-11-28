import { useQuery } from '@tanstack/react-query';
import { foodApi } from '../api/foodApi';

export function useFoodSearch(query: string, dataTypes: string[] = [], enabled: boolean = true) {
  return useQuery({
    queryKey: ['foods', 'search', query, dataTypes],
    queryFn: () => foodApi.searchFoods({ query, limit: 20, dataTypes }),
    enabled: enabled && query.length >= 2, // Only search if query is at least 2 chars
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useFoodByBarcode(upc: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['foods', 'barcode', upc],
    queryFn: () => foodApi.searchByBarcode(upc),
    enabled: enabled && upc.length > 0,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}
