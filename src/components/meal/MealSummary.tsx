import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { MacroSummary } from '../nutrition/MacroSummary';
import { MacroBreakdown } from '../nutrition/MacroBreakdown';
import { NutrientTable } from '../food/NutrientTable';
import { useMealStore } from '../../stores/mealStore';
import type { NutrientInfo } from '../../types/food';

export const MealSummary = () => {
  const [showMicronutrients, setShowMicronutrients] = useState(false);
  const { items, getTotals } = useMealStore();

  const totals = getTotals();

  // Convert micronutrient Map to array for NutrientTable
  const micronutrients: NutrientInfo[] = Array.from(totals.micronutrients.values())
    .filter((n) => ![1008, 1003, 1005, 1004, 1079].includes(n.nutrientId)) // Exclude macros
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">No nutrition data yet</p>
            <p className="text-sm mt-1">Add foods to see your meal summary</p>
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
          <h2 className="text-lg font-semibold text-gray-900">Nutrition Summary</h2>
        </CardHeader>
        <CardContent>
          <MacroSummary totals={totals} />
        </CardContent>
      </Card>

      {/* Macro Breakdown Pie Chart */}
      <Card>
        <CardContent className="pt-6">
          <MacroBreakdown totals={totals} />
        </CardContent>
      </Card>

      {/* Micronutrients (Expandable) */}
      {micronutrients.length > 0 && (
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
    </div>
  );
};
