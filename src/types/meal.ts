import type { FoodDetail, NutrientInfo, PortionInfo } from './food';

export interface MealItem {
  id: string; // Unique ID for this meal item
  food: FoodDetail;
  portion: PortionInfo;
  quantity: number; // e.g., 1.5 for "1.5 cups"
  nutrients: NutrientInfo[]; // Calculated for this portion
  totalGrams: number; // Total grams for this portion
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  createdAt: Date;
}

export interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micronutrients: Map<number, NutrientInfo>; // nutrientId -> nutrient with total amount
}
