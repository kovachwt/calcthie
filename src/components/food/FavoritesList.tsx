import { Star } from 'lucide-react';
import { FoodCard } from './FoodCard';
import { LoadingSpinner } from '../ui/Spinner';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useFoodDetails } from '../../hooks/useFoodDetails';

interface FavoritesListProps {
  onSelectFood: (fdcId: number) => void;
}

export const FavoritesList = ({ onSelectFood }: FavoritesListProps) => {
  const { favorites } = useFavoritesStore();

  // Empty state - No favorites
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium">No favorite foods yet</p>
        <p className="text-sm mt-1">Star foods from search results to save them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-2">
        {favorites.length} favorite food{favorites.length !== 1 ? 's' : ''}
      </p>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {favorites.map((fdcId) => (
          <FavoriteFood key={fdcId} fdcId={fdcId} onSelectFood={onSelectFood} />
        ))}
      </div>
    </div>
  );
};

interface FavoriteFoodProps {
  fdcId: number;
  onSelectFood: (fdcId: number) => void;
}

const FavoriteFood = ({ fdcId, onSelectFood }: FavoriteFoodProps) => {
  const { data: food, isLoading, error } = useFoodDetails(fdcId);

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (error || !food) {
    return null;
  }

  return (
    <FoodCard
      food={{
        fdcId: food.fdcId,
        description: food.description,
        dataType: food.dataType,
        brandOwner: food.brandInfo?.brandOwner ?? null,
        defaultServingSizeGrams: food.portions[0]?.gramWeight ?? null,
      }}
      onClick={() => onSelectFood(food.fdcId)}
    />
  );
};
