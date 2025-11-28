import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { MacroSummary } from '../nutrition/MacroSummary';
import { MacroBreakdown } from '../nutrition/MacroBreakdown';
import { NutrientTable } from '../food/NutrientTable';
import { calculateMealTotals, calculateNutrientsForPortion, calculateTotalGrams } from '../../utils/nutrition';
import type { MealItem } from '../../types/meal';
import type { NutrientInfo } from '../../types/food';

interface MealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealName: string | null;
  mealItems: MealItem[];
  consumedAt?: string;
}

export const MealDetailsModal = ({
  isOpen,
  onClose,
  mealName,
  mealItems,
  consumedAt,
}: MealDetailsModalProps) => {
  const [showMicronutrients, setShowMicronutrients] = useState(false);

  // Ensure all meal items have nutrients calculated
  const processedMealItems = useMemo(() => {
    return mealItems.map((item) => {
      // Always recalculate nutrients to ensure they exist
      const totalGrams = item.totalGrams || calculateTotalGrams(item.portion, item.quantity);
      const nutrients = item.nutrients || calculateNutrientsForPortion(item.food.nutrients, totalGrams);

      return {
        ...item,
        totalGrams,
        nutrients,
      };
    });
  }, [mealItems]);

  const totals = useMemo(() => calculateMealTotals(processedMealItems), [processedMealItems]);

  const micronutrients: NutrientInfo[] = useMemo(
    () =>
      Array.from(totals.micronutrients.values())
        .filter((n) => ![1008, 1003, 1005, 1004, 1079].includes(n.nutrientId))
        .sort((a, b) => (a.rank || 999) - (b.rank || 999)),
    [totals.micronutrients]
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mealName || 'Meal Details'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Meal Info */}
        {consumedAt && (
          <div className="text-sm text-gray-600">
            Consumed: {formatTime(consumedAt)}
          </div>
        )}

        {/* Meal Items */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Items ({processedMealItems.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {processedMealItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start p-2 bg-gray-50 rounded text-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.food.description}</div>
                  <div className="text-gray-600 text-xs">
                    {item.quantity} × {item.portion.description}
                    {item.totalGrams && ` (${item.totalGrams.toFixed(0)}g)`}
                  </div>
                </div>
                <div className="text-right text-gray-700">
                  {item.nutrients?.calories?.toFixed(0) || 0} cal
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Summary */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Nutrition Summary</h4>
          <MacroSummary totals={totals} />
        </div>

        {/* Macro Breakdown */}
        <div>
          <MacroBreakdown totals={totals} />
        </div>

        {/* Micronutrients */}
        {micronutrients.length > 0 && (
          <div>
            <button
              onClick={() => setShowMicronutrients(!showMicronutrients)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium w-full"
            >
              {showMicronutrients ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Micronutrients ({micronutrients.length})
            </button>
            {showMicronutrients && (
              <div className="mt-3">
                <NutrientTable nutrients={micronutrients} />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
