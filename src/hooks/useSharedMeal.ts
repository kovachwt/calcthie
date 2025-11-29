import { useEffect, useState } from 'react';
import { decodeMealFromUrl } from '../utils/mealSharing';
import { foodApi } from '../api/foodApi';
import { useMealStore } from '../stores/mealStore';
import type { FoodDetail } from '../types/food';

/**
 * Hook to handle loading a shared meal from URL parameters
 */
export function useSharedMeal() {
  const { clearMeal } = useMealStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedMeal = async () => {
      // Check if we have a shared meal in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const itemsParam = urlParams.get('items');

      if (!itemsParam) {
        return; // No shared meal to load
      }

      setIsLoading(true);
      setError(null);

      try {
        // Decode the meal items from the URL
        const decodedItems = decodeMealFromUrl(itemsParam);

        if (decodedItems.length === 0) {
          setError('Invalid meal URL format');
          setIsLoading(false);
          return;
        }

        // Fetch all food details
        const foodDetailsPromises = decodedItems.map((item) =>
          foodApi.getFoodDetails(item.fdcId)
        );

        const foodDetails = await Promise.all(foodDetailsPromises);

        // Reconstruct meal items
        const mealItems = decodedItems
          .map((item, index) => {
            const food = foodDetails[index];

            let portion;

            // Check if this is the custom 1 gram portion (portionIndex = -1)
            if (item.portionIndex === -1) {
              // Create the custom 1 gram portion
              portion = {
                amount: 1,
                unit: 'g',
                gramWeight: 1,
                description: '1 gram',
                modifier: null,
              };
            } else if (
              item.portionIndex >= 0 &&
              item.portionIndex < food.portions.length
            ) {
              // Use the portion from the food's portions array
              portion = food.portions[item.portionIndex];
            } else {
              console.warn(
                `Invalid portion index ${item.portionIndex} for food ${food.fdcId}`
              );
              return null;
            }

            return {
              food,
              portion,
              quantity: item.quantity,
            };
          })
          .filter((item): item is { food: FoodDetail; portion: any; quantity: number } =>
            item !== null
          );

        if (mealItems.length === 0) {
          setError('No valid meal items found');
          setIsLoading(false);
          return;
        }

        // Clear current meal and load the shared meal
        clearMeal();

        // Add items one by one to trigger proper calculations
        for (const item of mealItems) {
          useMealStore.getState().addItem(item.food, item.portion, item.quantity);
        }

        // Clear the URL parameters after loading
        window.history.replaceState({}, '', window.location.pathname);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load shared meal:', err);
        setError('Failed to load shared meal. Please check the URL and try again.');
        setIsLoading(false);
      }
    };

    loadSharedMeal();
  }, []); // Only run once on mount

  return { isLoading, error };
}
