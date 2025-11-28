import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getMacroPercentages } from '../../utils/nutrition';
import type { NutrientTotals } from '../../types/meal';

interface MacroBreakdownProps {
  totals: NutrientTotals;
}

const COLORS = {
  protein: '#8b5cf6', // Purple
  carbs: '#10b981', // Green
  fat: '#f97316', // Orange
};

export const MacroBreakdown = ({ totals }: MacroBreakdownProps) => {
  const percentages = getMacroPercentages(totals);
  const netCarbs = totals.carbs - totals.fiber;

  const data = [
    { name: 'Protein', value: percentages.protein, grams: totals.protein, calories: percentages.proteinCal },
    { name: 'Carbs', value: percentages.carbs, grams: netCarbs, calories: percentages.carbsCal },
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
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
              />
            ))}
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
        {data.map((item) => (
          <div
            key={item.name}
            className="text-center p-3 rounded-lg"
            style={{
              backgroundColor: `${COLORS[item.name.toLowerCase() as keyof typeof COLORS]}15`,
            }}
          >
            <p className="text-sm text-gray-600">{item.name}</p>
            <p className="text-xl font-bold text-gray-900">{item.calories} kcal</p>
            <p className="text-xs text-gray-500">{item.grams.toFixed(1)}g • {item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};
