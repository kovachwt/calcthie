import { useState, useEffect } from 'react';
import { FoodSearch } from './components/food/FoodSearch';
import { FoodDetails } from './components/food/FoodDetails';
import { AddFoodModal } from './components/meal/AddFoodModal';
import { EditMealItemModal } from './components/meal/EditMealItemModal';
import { MealCart } from './components/meal/MealCart';
import { MealSummary } from './components/meal/MealSummary';
import { UserMenu } from './components/auth/UserMenu';
import { Logo } from './components/ui/Logo';
import { useMealStore } from './stores/mealStore';
import { useGoalsStore } from './stores/goalsStore';
import { useHistoryStore } from './stores/historyStore';
import { useFavoritesStore } from './stores/favoritesStore';
import { useAuthStore } from './stores/authStore';
import type { FoodDetail, PortionInfo } from './types/food';

function App() {
  // Initialize stores from localStorage
  const { loadFromStorage: loadMeal, syncWithBackend: syncMeal } = useMealStore();
  const { loadFromStorage: loadGoals } = useGoalsStore();
  const { loadFromStorage: loadHistory } = useHistoryStore();
  const { loadFromStorage: loadFavorites, syncWithBackend: syncFavorites } = useFavoritesStore();
  const { addItem } = useMealStore();
  const { user, initializeAuth } = useAuthStore();

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
    }
  }, [user, syncMeal, syncFavorites]);

  // Modal states
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [foodToAdd, setFoodToAdd] = useState<FoodDetail | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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
                <p className="text-sm text-gray-600">Nutrition Calculator & Tracker</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Food Search */}
          <div className="lg:col-span-2">
            <FoodSearch onSelectFood={handleFoodSelect} />
          </div>

          {/* Right Column - Meal Cart */}
          <div className="lg:col-span-1">
            <MealCart onEditItem={handleEditItem} />
          </div>
        </div>

        {/* Meal Summary */}
        <div className="mt-8">
          <MealSummary />
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Powered by FoodData Central | Built with React + TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
