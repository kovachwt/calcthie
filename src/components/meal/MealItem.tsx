import { Edit2, Trash2, Star } from 'lucide-react';
import type { MealItem as MealItemType } from '../../types/meal';
import { getPortionDisplayName } from '../../utils/nutrition';
import { useFavoritesStore } from '../../stores/favoritesStore';

interface MealItemProps {
  item: MealItemType;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export const MealItem = ({ item, onEdit, onRemove }: MealItemProps) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(item.food.fdcId);

  const handleStarClick = () => {
    toggleFavorite(item.food.fdcId);
  };
  // Get key macro nutrients for preview
  const getKeyNutrients = () => {
    const keyIds = [1008, 1003, 1005, 1004]; // Energy, Protein, Carbs, Fat
    return item.nutrients.filter((n) => keyIds.includes(n.nutrientId));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Food Name */}
          <h3 className="font-medium text-gray-900 line-clamp-1">{item.food.description}</h3>

          {/* Portion Info */}
          <p className="text-sm text-gray-600 mt-1">
            {item.quantity} × {getPortionDisplayName(item.portion)}
            <span className="text-gray-400 ml-1">({item.totalGrams.toFixed(0)}g total)</span>
          </p>

          {/* Macro Preview */}
          <div className="flex flex-wrap gap-3 mt-2">
            {getKeyNutrients().map((nutrient) => (
              <div key={nutrient.nutrientId} className="text-xs">
                <span className="text-gray-500">{nutrient.name.split(',')[0]}: </span>
                <span className="font-medium text-gray-700">
                  {nutrient.amount?.toFixed(1)} {nutrient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 ml-2">
          <button
            onClick={handleStarClick}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                favorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
              }`}
            />
          </button>
          <button
            onClick={() => onEdit(item.id)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Edit quantity and portion"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded hover:bg-red-50 transition-colors"
            title="Remove from meal"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
