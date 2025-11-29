import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getMacroPercentages } from '../../utils/nutrition';
import type { NutrientTotals } from '../../types/meal';

interface MacroBreakdownProps {
  totals: NutrientTotals;
  isFoodLog?: boolean;
}

const COLORS = {
  protein: '#8b5cf6', // Purple
  carbs: '#10b981', // Green
  fat: '#f97316', // Orange
};

export const MacroBreakdown = ({ totals, isFoodLog = false }: MacroBreakdownProps) => {
  const percentages = getMacroPercentages(totals);
  // Use net carbs for current meal, total carbs for food log (since we don't have fiber data)
  const carbGrams = isFoodLog ? totals.carbs : totals.carbs - totals.fiber;
  const carbLabel = isFoodLog ? 'Carbs' : 'Net Carbs';

  const data = [
    { name: 'Protein', value: percentages.protein, grams: totals.protein, calories: percentages.proteinCal },
    { name: carbLabel, value: percentages.carbs, grams: carbGrams, calories: percentages.carbsCal },
    { name: 'Fat', value: percentages.fat, grams: totals.fat, calories: percentages.fatCal },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No macro data to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Macro Breakdown (by Calories)</h3>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => {
              const colorKey = entry.name.toLowerCase().includes('carb') ? 'carbs' : entry.name.toLowerCase();
              return (
                <Cell
                  key={entry.name}
                  fill={COLORS[colorKey as keyof typeof COLORS]}
                />
              );
            })}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value}% (${props.payload.calories} kcal, ${props.payload.grams.toFixed(1)}g)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Macro Stats */}
      <div className="grid grid-cols-3 gap-3">
        {data.map((item) => {
          const colorKey = item.name.toLowerCase().includes('carb') ? 'carbs' : item.name.toLowerCase();
          return (
            <div
              key={item.name}
              className="text-center p-3 rounded-lg"
              style={{
                backgroundColor: `${COLORS[colorKey as keyof typeof COLORS]}15`,
              }}
            >
              <p className="text-sm text-gray-600">{item.name}</p>
              <p className="text-xl font-bold text-gray-900">{item.calories} kcal</p>
              <p className="text-xs text-gray-500">{item.grams.toFixed(1)}g • {item.value}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
