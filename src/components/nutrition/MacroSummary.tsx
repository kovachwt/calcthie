import type { NutrientTotals } from '../../types/meal';

interface MacroSummaryProps {
  totals: NutrientTotals;
  isFoodLog?: boolean;
}

export const MacroSummary = ({ totals, isFoodLog = false }: MacroSummaryProps) => {
  const netCarbs = totals.carbs - totals.fiber;

  const macros = [
    { label: 'Calories', value: totals.calories, unit: 'kcal', color: 'from-purple-100 to-purple-200' },
    { label: 'Protein', value: totals.protein, unit: 'g', color: 'from-secondary-100 to-secondary-200' },
    { label: 'Fat', value: totals.fat, unit: 'g', color: 'from-accent-100 to-accent-200' },
    { label: 'Carbs', value: totals.carbs, unit: 'g', color: 'from-primary-100 to-primary-200' },
    { label: 'Fiber', value: totals.fiber, unit: 'g', color: 'from-green-100 to-green-200' },
    { label: 'Net Carbs', value: netCarbs, unit: 'g', color: 'from-blue-100 to-blue-200' },
  ];

  const gridCols = 'grid-cols-2 md:grid-cols-6';

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {macros.map((macro) => (
        <div
          key={macro.label}
          className={`bg-gradient-to-br ${macro.color} rounded-lg p-4 text-center`}
        >
          <p className="text-sm text-gray-600 font-medium">{macro.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {macro.value.toFixed(macro.label === 'Calories' ? 0 : 1)}
          </p>
          <p className="text-sm text-gray-600 mt-1">{macro.unit}</p>
        </div>
      ))}
    </div>
  );
};
