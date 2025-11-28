// API Response Types - Match backend DTOs

export interface FoodSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  defaultServingSizeGrams: number | null;
}

export interface FoodDetail {
  fdcId: number;
  description: string;
  dataType: string;
  category: string | null;
  nutrients: NutrientInfo[];
  portions: PortionInfo[];
  brandInfo: BrandedFoodInfo | null;
}

export interface NutrientInfo {
  nutrientId: number;
  name: string;
  amount: number | null;
  unit: string;
  percentDailyValue: number | null;
  rank: number | null;
}

export interface PortionInfo {
  amount: number | null;
  unit: string;
  gramWeight: number | null;
  description: string | null;
  modifier: string | null;
}

export interface BrandedFoodInfo {
  brandOwner: string | null;
  brandName: string | null;
  gtinUpc: string | null;
  ingredients: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
  householdServing: string | null;
  category: string | null;
}
