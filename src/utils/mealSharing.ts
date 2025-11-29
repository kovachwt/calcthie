import type { MealItem } from '../types/meal';

/**
 * Encodes meal items into a compact URL-safe format
 * Format: fdcId:portionIndex:quantity,fdcId:portionIndex:quantity,...
 * Special case: portionIndex of -1 means custom 1 gram portion
 */
export function encodeMealToUrl(items: MealItem[]): string {
  const encoded = items
    .map((item) => {
      // Check if this is the custom 1 gram portion
      const isCustomGramPortion =
        item.portion.unit === 'g' &&
        item.portion.gramWeight === 1 &&
        item.portion.amount === 1;

      let portionIndex: number;

      if (isCustomGramPortion) {
        // Use -1 to indicate the custom 1 gram portion
        portionIndex = -1;
      } else {
        // Find the index of the selected portion in the food's portions array
        portionIndex = item.food.portions.findIndex(
          (p) =>
            p.unit === item.portion.unit &&
            p.gramWeight === item.portion.gramWeight &&
            p.amount === item.portion.amount
        );
      }

      return `${item.food.fdcId}:${portionIndex}:${item.quantity}`;
    })
    .join(',');

  return encoded;
}

/**
 * Decodes URL parameters into a format that can be used to reconstruct meal items
 * Returns an array of { fdcId, portionIndex, quantity }
 */
export function decodeMealFromUrl(
  encodedItems: string
): Array<{ fdcId: number; portionIndex: number; quantity: number }> {
  if (!encodedItems) return [];

  try {
    return encodedItems.split(',').map((item) => {
      const [fdcId, portionIndex, quantity] = item.split(':').map(Number);

      if (isNaN(fdcId) || isNaN(portionIndex) || isNaN(quantity)) {
        throw new Error(`Invalid item format: ${item}`);
      }

      return { fdcId, portionIndex, quantity };
    });
  } catch (error) {
    console.error('Failed to decode meal from URL:', error);
    return [];
  }
}

/**
 * Generates a shareable URL for the current meal
 */
export function generateShareableUrl(items: MealItem[]): string {
  if (items.length === 0) return '';

  const encoded = encodeMealToUrl(items);
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared-meal?items=${encodeURIComponent(encoded)}`;
}

/**
 * Copies the shareable URL to clipboard
 */
export async function copyMealUrlToClipboard(items: MealItem[]): Promise<boolean> {
  try {
    const url = generateShareableUrl(items);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error);
    return false;
  }
}
