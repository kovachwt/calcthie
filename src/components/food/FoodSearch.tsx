import { useState } from 'react';
import { Search, Star, History } from 'lucide-react';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/Spinner';
import { FoodCard } from './FoodCard';
import { FavoritesList } from './FavoritesList';
import { ConsumedMealsList } from '../meal/ConsumedMealsList';
import { FoodTypeFilter, FOOD_TYPES } from './FoodTypeFilter';
import { useFoodSearch } from '../../hooks/useFoodSearch';
import { useDebounce } from '../../hooks/useDebounce';

interface FoodSearchProps {
  onSelectFood: (fdcId: number) => void;
  onTabChange?: (tab: TabType) => void;
}

export type TabType = 'search' | 'favorites' | 'consumed';

export const FoodSearch = ({ onSelectFood, onTabChange }: FoodSearchProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('search');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(
    FOOD_TYPES.map((t) => t.value)
  );
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: foods, isLoading, error } = useFoodSearch(
    debouncedSearch,
    selectedDataTypes,
    debouncedSearch.length >= 2
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTabChange('search')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={() => handleTabChange('favorites')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Star className="w-4 h-4" />
          Favorites
        </button>
        <button
          onClick={() => handleTabChange('consumed')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'consumed'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4" />
          Food Log
        </button>
      </div>

      {/* Search Tab Content */}
      {activeTab === 'search' && (
        <>
          {/* Search Input and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for foods... (e.g., chicken, apple, smoothie)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <FoodTypeFilter
              selectedTypes={selectedDataTypes}
              onChange={setSelectedDataTypes}
            />
          </div>

          {/* Search Results */}
          <div className="space-y-2">
            {/* Loading State */}
            {isLoading && <LoadingSpinner message="Searching foods..." />}

            {/* Error State */}
            {error && (
              <div className="text-center py-8 text-red-600">
                <p>Error searching foods. Please try again.</p>
              </div>
            )}

            {/* Empty State - No Search Yet */}
            {!searchTerm && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Start searching for foods</p>
                <p className="text-sm mt-1">Type at least 2 characters to search</p>
              </div>
            )}

            {/* Empty State - No Results */}
            {searchTerm.length >= 2 && !isLoading && foods?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No foods found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}

            {/* Results List */}
            {foods && foods.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Found {foods.length} food{foods.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {foods.map((food) => (
                    <FoodCard
                      key={food.fdcId}
                      food={food}
                      onClick={() => onSelectFood(food.fdcId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Favorites Tab Content */}
      {activeTab === 'favorites' && <FavoritesList onSelectFood={onSelectFood} />}

      {/* Consumed Tab Content */}
      {activeTab === 'consumed' && <ConsumedMealsList />}
    </div>
  );
};
