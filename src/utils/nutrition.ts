import type { NutrientInfo, PortionInfo } from '../types/food';
import type { MealItem, NutrientTotals } from '../types/meal';

/**
 * Calculate nutrients for a specific portion size
 * API returns nutrients per 100g, we need to scale them
 */
export function calculateNutrientsForPortion(
  nutrients: NutrientInfo[],
  portionGrams: number
): NutrientInfo[] {
  return nutrients.map((nutrient) => ({
    ...nutrient,
    amount: nutrient.amount ? (nutrient.amount * portionGrams) / 100 : null,
  }));
}

/**
 * Get total grams for a portion (portion.gramWeight * quantity)
 */
export function calculateTotalGrams(portion: PortionInfo, quantity: number): number {
  return (portion.gramWeight || 100) * quantity;
}

/**
 * Calculate total nutrition for all items in a meal
 */
export function calculateMealTotals(items: MealItem[]): NutrientTotals {
  const microMap = new Map<number, NutrientInfo>();
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  items.forEach((item) => {
    item.nutrients.forEach((nutrient) => {
      const amount = nutrient.amount || 0;

      // Handle macronutrients
      switch (nutrient.nutrientId) {
        case 1008: // Energy (KCAL)
          calories += amount;
          break;
        case 1003: // Protein
          protein += amount;
          break;
        case 1005: // Carbohydrate, by difference
          carbs += amount;
          break;
        case 1004: // Total lipid (fat)
          fat += amount;
          break;
        case 1079: // Fiber, total dietary
          fiber += amount;
          break;
      }

      // Aggregate all nutrients for micronutrient view
      if (microMap.has(nutrient.nutrientId)) {
        const existing = microMap.get(nutrient.nutrientId)!;
        microMap.set(nutrient.nutrientId, {
          ...existing,
          amount: (existing.amount || 0) + amount,
        });
      } else {
        microMap.set(nutrient.nutrientId, { ...nutrient, amount });
      }
    });
  });

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    micronutrients: microMap,
  };
}

/**
 * Calculate macro percentages (% of calories from each macro)
 * Uses net carbs (carbs - fiber) for carb calories since fiber has minimal calories
 */
export function getMacroPercentages(totals: NutrientTotals): {
  protein: number;
  carbs: number;
  fat: number;
  proteinCal: number;
  carbsCal: number;
  fatCal: number;
} {
  // Protein: 4 cal/g, Net Carbs: 4 cal/g, Fat: 9 cal/g
  const netCarbs = totals.carbs - totals.fiber;
  const proteinCal = totals.protein * 4;
  const carbsCal = netCarbs * 4;
  const fatCal = totals.fat * 9;

  const total = proteinCal + carbsCal + fatCal || 1;

  return {
    protein: Math.round((proteinCal / total) * 100),
    carbs: Math.round((carbsCal / total) * 100),
    fat: Math.round((fatCal / total) * 100),
    proteinCal: Math.round(proteinCal),
    carbsCal: Math.round(carbsCal),
    fatCal: Math.round(fatCal),
  };
}

/**
 * Format nutrient amount with appropriate precision
 */
export function formatNutrientAmount(amount: number | null, unit: string): string {
  if (amount === null) return 'N/A';

  // For very small amounts (like vitamins in UG), show more precision
  if (unit === 'UG' && amount < 1) {
    return amount.toFixed(2);
  }

  // For grams and milligrams, show 1 decimal place
  if (unit === 'G' || unit === 'MG') {
    return amount.toFixed(1);
  }

  // For calories, show whole numbers
  if (unit === 'KCAL') {
    return Math.round(amount).toString();
  }

  return amount.toFixed(1);
}

/**
 * Get display name for a portion
 */
export function getPortionDisplayName(portion: PortionInfo): string {
  if (portion.description && portion.modifier) {
    return `${portion.description} (${portion.modifier})`;
  }
  if (portion.description) {
    return portion.description;
  }
  if (portion.amount && portion.modifier) {
    return `${portion.amount} ${portion.modifier}`;
  }
  if (portion.amount && portion.unit) {
    return `${portion.amount} ${portion.unit}`;
  }
  if (portion.gramWeight) {
    return `${portion.gramWeight}g`;
  }
  return '100g (default)';
}
