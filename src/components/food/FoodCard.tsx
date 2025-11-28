import { Star } from 'lucide-react';
import type { FoodSearchResult } from '../../types/food';
import { Card, CardContent } from '../ui/Card';
import { useFavoritesStore } from '../../stores/favoritesStore';

interface FoodCardProps {
  food: FoodSearchResult;
  onClick: () => void;
}

export const FoodCard = ({ food, onClick }: FoodCardProps) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(food.fdcId);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    toggleFavorite(food.fdcId);
  };
  const getDataTypeBadge = (dataType: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      branded_food: { color: 'bg-purple-100 text-purple-800', label: 'Branded' },
      sr_legacy_food: { color: 'bg-green-100 text-green-800', label: 'Generic' },
      foundation_food: { color: 'bg-blue-100 text-blue-800', label: 'Foundation' },
      survey_fndds_food: { color: 'bg-yellow-100 text-yellow-800', label: 'Survey' },
    };

    const badge = badges[dataType] || { color: 'bg-gray-100 text-gray-800', label: 'Other' };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 line-clamp-2">{food.description}</h3>
            {food.brandOwner && (
              <p className="text-sm text-gray-600 mt-1">{food.brandOwner}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {getDataTypeBadge(food.dataType)}
              {food.defaultServingSizeGrams && (
                <span className="text-xs text-gray-500">
                  {Math.round(food.defaultServingSizeGrams)}g default
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleStarClick}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-5 h-5 ${
                favorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
              }`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
