import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Star } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/Spinner';
import { NutrientTable } from './NutrientTable';
import { useFoodDetails } from '../../hooks/useFoodDetails';
import { useFavoritesStore } from '../../stores/favoritesStore';
import type { FoodDetail } from '../../types/food';

interface FoodDetailsProps {
  fdcId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToMeal: (food: FoodDetail) => void;
}

// Key macro nutrient IDs
const MACRO_NUTRIENT_IDS = {
  ENERGY: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
  FIBER: 1079,
};

export const FoodDetails = ({ fdcId, isOpen, onClose, onAddToMeal }: FoodDetailsProps) => {
  const [showMicronutrients, setShowMicronutrients] = useState(false);
  const { data: food, isLoading, error } = useFoodDetails(fdcId, isOpen);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  if (!isOpen) return null;

  const favorited = fdcId ? isFavorite(fdcId) : false;

  const handleStarClick = () => {
    if (fdcId) {
      toggleFavorite(fdcId);
    }
  };

  const getMacroNutrients = () => {
    if (!food) return [];
    return food.nutrients.filter((n) =>
      Object.values(MACRO_NUTRIENT_IDS).includes(n.nutrientId)
    );
  };

  const getNetCarbs = () => {
    if (!food) return null;
    const carbs = food.nutrients.find((n) => n.nutrientId === MACRO_NUTRIENT_IDS.CARBS);
    const fiber = food.nutrients.find((n) => n.nutrientId === MACRO_NUTRIENT_IDS.FIBER);

    if (carbs?.amount !== undefined && carbs.amount !== null) {
      const fiberAmount = fiber?.amount || 0;
      return Math.max(0, carbs.amount - fiberAmount);
    }
    return null;
  };

  const getMicroNutrients = () => {
    if (!food) return [];
    return food.nutrients
      .filter((n) => !Object.values(MACRO_NUTRIENT_IDS).includes(n.nutrientId))
      .sort((a, b) => (a.rank || 999) - (b.rank || 999));
  };

  const handleAddToMeal = () => {
    if (food) {
      onAddToMeal(food);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Food Details" size="lg">
      {isLoading && <LoadingSpinner message="Loading food details..." />}

      {error && (
        <div className="text-center py-8 text-red-600">
          <p>Error loading food details. Please try again.</p>
        </div>
      )}

      {food && (
        <div className="space-y-6">
          {/* Food Header */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900 flex-1">{food.description}</h2>
              <button
                onClick={handleStarClick}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`w-6 h-6 ${
                    favorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {food.category && (
                <span className="text-sm text-gray-600">Category: {food.category}</span>
              )}
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600 capitalize">
                {food.dataType.replace(/_/g, ' ')}
              </span>
            </div>
            {food.brandInfo && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Brand: {food.brandInfo.brandOwner || food.brandInfo.brandName}</p>
                {food.brandInfo.servingSize && (
                  <p>
                    Serving Size: {food.brandInfo.servingSize}
                    {food.brandInfo.servingSizeUnit}
                    {food.brandInfo.householdServing && ` (${food.brandInfo.householdServing})`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Macro Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Nutrition Facts (per 100g)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getMacroNutrients().map((nutrient) => (
                <div
                  key={nutrient.nutrientId}
                  className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4"
                >
                  <p className="text-sm text-gray-600">{nutrient.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {nutrient.amount?.toFixed(1) || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{nutrient.unit}</p>
                </div>
              ))}
              {getNetCarbs() !== null && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Net Carbs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {getNetCarbs()!.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">g</p>
                </div>
              )}
            </div>
          </div>

          {/* Micronutrients (Expandable) */}
          <div>
            <button
              onClick={() => setShowMicronutrients(!showMicronutrients)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                All Nutrients ({getMicroNutrients().length + getMacroNutrients().length})
              </h3>
              {showMicronutrients ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showMicronutrients && (
              <div className="mt-3 max-h-96 overflow-y-auto">
                <NutrientTable nutrients={food.nutrients} />
              </div>
            )}
          </div>

          {/* Ingredients (if branded) */}
          {food.brandInfo?.ingredients && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Ingredients</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {food.brandInfo.ingredients}
              </p>
            </div>
          )}

          {/* Add to Meal Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button onClick={handleAddToMeal} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add to Meal
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
