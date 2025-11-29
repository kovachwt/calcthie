import { useState, useEffect } from 'react';
import { FoodSearch, type TabType } from './components/food/FoodSearch';
import { FoodDetails } from './components/food/FoodDetails';
import { AddFoodModal } from './components/meal/AddFoodModal';
import { EditMealItemModal } from './components/meal/EditMealItemModal';
import { MealCart } from './components/meal/MealCart';
import { MealSummary } from './components/meal/MealSummary';
import { UserMenu } from './components/auth/UserMenu';
import { Logo } from './components/ui/Logo';
import { Spinner } from './components/ui/Spinner';
import { useMealStore } from './stores/mealStore';
import { useGoalsStore } from './stores/goalsStore';
import { useHistoryStore } from './stores/historyStore';
import { useFavoritesStore } from './stores/favoritesStore';
import { useAuthStore } from './stores/authStore';
import { useConsumedMealsStore } from './stores/consumedMealsStore';
import { useSharedMeal } from './hooks/useSharedMeal';
import type { FoodDetail, PortionInfo } from './types/food';

function App() {
  // Handle shared meal from URL
  const { isLoading: isLoadingSharedMeal, error: sharedMealError } = useSharedMeal();

  // Initialize stores from localStorage
  const { loadFromStorage: loadMeal, syncWithBackend: syncMeal } = useMealStore();
  const { loadFromStorage: loadGoals } = useGoalsStore();
  const { loadFromStorage: loadHistory } = useHistoryStore();
  const { loadFromStorage: loadFavorites, syncWithBackend: syncFavorites } = useFavoritesStore();
  const { addItem } = useMealStore();
  const { user, initializeAuth } = useAuthStore();
  const { initialize: initializeConsumedMeals } = useConsumedMealsStore();

  useEffect(() => {
    // Initialize auth first
    initializeAuth();

    // Then load other data
    loadMeal();
    loadGoals();
    loadHistory();
    loadFavorites();
  }, [initializeAuth, loadMeal, loadGoals, loadHistory, loadFavorites]);

  // Sync with backend when user logs in
  useEffect(() => {
    if (user) {
      syncMeal();
      syncFavorites();
      initializeConsumedMeals();
    }
  }, [user, syncMeal, syncFavorites, initializeConsumedMeals]);

  // Modal states
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [foodToAdd, setFoodToAdd] = useState<FoodDetail | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('search');

  const handleFoodSelect = (fdcId: number) => {
    setSelectedFoodId(fdcId);
  };

  const handleCloseFoodDetails = () => {
    setSelectedFoodId(null);
  };

  const handleAddToMeal = (food: FoodDetail) => {
    setSelectedFoodId(null);
    setFoodToAdd(food);
  };

  const handleCloseAddFood = () => {
    setFoodToAdd(null);
  };

  const handleAddFoodToMeal = (food: FoodDetail, portion: PortionInfo, quantity: number) => {
    addItem(food, portion, quantity);
    setFoodToAdd(null);
  };

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleCloseEditItem = () => {
    setEditingItemId(null);
  };

  // Show loading state while shared meal is being loaded
  if (isLoadingSharedMeal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading shared meal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calcthie</h1>
                <p className="text-sm text-gray-600">Nutrition Calculator</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Shared Meal Error Banner */}
      {sharedMealError && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-red-800">{sharedMealError}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Food Search */}
          <div className="lg:col-span-2">
            <FoodSearch onSelectFood={handleFoodSelect} onTabChange={setActiveTab} />
          </div>

          {/* Right Column - Meal Cart */}
          <div className="lg:col-span-1">
            <MealCart onEditItem={handleEditItem} />
          </div>
        </div>

        {/* Meal Summary */}
        <div className="mt-8">
          <MealSummary activeTab={activeTab} />
        </div>
      </main>

      {/* Modals */}
      <FoodDetails
        fdcId={selectedFoodId}
        isOpen={selectedFoodId !== null}
        onClose={handleCloseFoodDetails}
        onAddToMeal={handleAddToMeal}
      />

      <AddFoodModal
        food={foodToAdd}
        isOpen={foodToAdd !== null}
        onClose={handleCloseAddFood}
        onAdd={handleAddFoodToMeal}
      />

      <EditMealItemModal
        itemId={editingItemId}
        isOpen={editingItemId !== null}
        onClose={handleCloseEditItem}
      />
    </div>
  );
}

export default App;
