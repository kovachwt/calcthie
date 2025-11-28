import type { NutrientInfo } from '../../types/food';
import { formatNutrientAmount } from '../../utils/nutrition';

interface NutrientTableProps {
  nutrients: NutrientInfo[];
  title?: string;
}

export const NutrientTable = ({ nutrients, title }: NutrientTableProps) => {
  if (nutrients.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No nutrient data available</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-700">Nutrient</th>
              <th className="text-right px-4 py-2 font-medium text-gray-700">Amount</th>
              <th className="text-right px-4 py-2 font-medium text-gray-700">Unit</th>
              <th className="text-right px-4 py-2 font-medium text-gray-700">% DV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {nutrients.map((nutrient) => (
              <tr key={nutrient.nutrientId} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-900">{nutrient.name}</td>
                <td className="px-4 py-2 text-right text-gray-700 font-medium">
                  {formatNutrientAmount(nutrient.amount, nutrient.unit)}
                </td>
                <td className="px-4 py-2 text-right text-gray-500">{nutrient.unit}</td>
                <td className="px-4 py-2 text-right text-gray-500">
                  {nutrient.percentDailyValue
                    ? `${nutrient.percentDailyValue.toFixed(0)}%`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
