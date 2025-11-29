import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { MacroSummary } from '../nutrition/MacroSummary';
import { MacroBreakdown } from '../nutrition/MacroBreakdown';
import { NutrientTable } from '../food/NutrientTable';
import { useMealStore } from '../../stores/mealStore';
import { useConsumedMealsStore } from '../../stores/consumedMealsStore';
import type { TabType } from '../food/FoodSearch';
import type { NutrientInfo } from '../../types/food';

interface MealSummaryProps {
  activeTab: TabType;
}

export const MealSummary = ({ activeTab }: MealSummaryProps) => {
  const [showMicronutrients, setShowMicronutrients] = useState(false);
  const { items, getTotals } = useMealStore();
  const { getSelectedDateTotals } = useConsumedMealsStore();

  // Use food log data when on consumed tab, otherwise use current meal
  const mealTotals = getTotals();
  const foodLogTotals = getSelectedDateTotals();

  const totals = activeTab === 'consumed'
    ? { ...mealTotals, ...foodLogTotals, micronutrients: new Map() }
    : mealTotals;

  // Convert micronutrient Map to array for NutrientTable
  const micronutrients: NutrientInfo[] = Array.from(totals.micronutrients.values())
    .filter((n) => ![1008, 1003, 1005, 1004, 1079].includes(n.nutrientId)) // Exclude macros
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));

  // Determine display context
  const isFoodLog = activeTab === 'consumed';
  const hasData = isFoodLog
    ? foodLogTotals.calories > 0
    : items.length > 0;
  const dataLabel = isFoodLog ? 'Today\'s Food Log' : 'Current Meal';

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">No nutrition data yet</p>
            <p className="text-sm mt-1">
              {isFoodLog
                ? 'No meals logged for today'
                : 'Add foods to see your meal summary'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Macro Summary Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Nutrition Summary</h2>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isFoodLog
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {dataLabel}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <MacroSummary totals={totals} isFoodLog={isFoodLog} />
        </CardContent>
      </Card>

      {/* Macro Breakdown Pie Chart */}
      <Card>
        <CardContent className="pt-6">
          <MacroBreakdown totals={totals} isFoodLog={isFoodLog} />
        </CardContent>
      </Card>

      {/* Micronutrients (Expandable) - Only show for current meal */}
      {!isFoodLog && micronutrients.length > 0 && (
        <Card>
          <CardHeader>
            <button
              onClick={() => setShowMicronutrients(!showMicronutrients)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                All Nutrients ({micronutrients.length + 5})
              </h2>
              {showMicronutrients ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </CardHeader>

          {showMicronutrients && (
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <NutrientTable
                  nutrients={Array.from(totals.micronutrients.values())}
                  title="Total Nutrition for Meal"
                />
              </div>
            </CardContent>
          )}
        </Card>
      )}
      {isFoodLog && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <p className="text-sm">
                Detailed micronutrient breakdown is only available for the Current Meal.
              </p>
              <p className="text-xs mt-1 text-gray-400">
                Food Log shows macronutrient totals from consumed meals.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
