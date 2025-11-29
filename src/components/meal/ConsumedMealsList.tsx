import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Calendar, Eye, Download } from 'lucide-react';
import { useConsumedMealsStore } from '../../stores/consumedMealsStore';
import { useAuthStore } from '../../stores/authStore';
import { useMealStore } from '../../stores/mealStore';
import { LoadingSpinner } from '../ui/Spinner';
import { MealDetailsModal } from './MealDetailsModal';
import type { ConsumedMeal } from '../../api/consumedMealApi';
import type { MealItem } from '../../types/meal';

export const ConsumedMealsList = () => {
  const { user } = useAuthStore();
  const { meals, selectedDate, isLoading, setSelectedDate, loadMealsForDate, deleteMeal, getSelectedDateTotals } =
    useConsumedMealsStore();
  const { loadMeal } = useMealStore();
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<ConsumedMeal | null>(null);

  useEffect(() => {
    if (user) {
      loadMealsForDate(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedDate]);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleLoadMeal = (meal: ConsumedMeal) => {
    if (confirm('Load this meal into your current meal? This will replace your current meal.')) {
      const mealItems = Array.isArray(meal.mealData) ? meal.mealData as MealItem[] : [];
      loadMeal(mealItems);
    }
  };

  const handleViewDetails = (meal: ConsumedMeal) => {
    setSelectedMealForDetails(meal);
  };

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Please sign in to view consumed meals</p>
      </div>
    );
  }

  const totals = getSelectedDateTotals();

  return (
    <div className="space-y-4">
      {/* Date Navigator */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <button
          onClick={goToPreviousDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{formatDate(selectedDate)}</span>
          {!isToday() && (
            <button
              onClick={goToToday}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={goToNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Daily Totals */}
      {isToday() && meals.length > 0 && (
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-2">Today's Totals</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Calories</div>
              <div className="font-semibold text-primary-900">{totals.calories.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-gray-600">Protein</div>
              <div className="font-semibold text-primary-900">{totals.protein.toFixed(1)}g</div>
            </div>
            <div>
              <div className="text-gray-600">Carbs</div>
              <div className="font-semibold text-primary-900">{totals.carbs.toFixed(1)}g</div>
            </div>
            <div>
              <div className="text-gray-600">Fat</div>
              <div className="font-semibold text-primary-900">{totals.fat.toFixed(1)}g</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingSpinner message="Loading meals..." />}

      {/* Meals List */}
      {!isLoading && meals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No meals consumed on this day</p>
        </div>
      )}

      {!isLoading && meals.length > 0 && (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {meal.mealName && (
                      <span className="font-medium text-gray-900">{meal.mealName}</span>
                    )}
                    <span className="text-sm text-gray-500">{formatTime(meal.consumedAt)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {Array.isArray(meal.mealData) && meal.mealData.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {meal.mealData.length} item{meal.mealData.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewDetails(meal)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                    aria-label="View details"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleLoadMeal(meal)}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                    aria-label="Load meal"
                    title="Load into current meal"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    aria-label="Delete meal"
                    title="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="grid grid-cols-4 gap-3 text-xs border-t border-gray-100 pt-3">
                <div>
                  <div className="text-gray-500">Calories</div>
                  <div className="font-semibold">{meal.totalCalories?.toFixed(0) || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">Protein</div>
                  <div className="font-semibold">{meal.totalProtein?.toFixed(1) || 0}g</div>
                </div>
                <div>
                  <div className="text-gray-500">Carbs</div>
                  <div className="font-semibold">{meal.totalCarbs?.toFixed(1) || 0}g</div>
                </div>
                <div>
                  <div className="text-gray-500">Fat</div>
                  <div className="font-semibold">{meal.totalFat?.toFixed(1) || 0}g</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meal Details Modal */}
      {selectedMealForDetails && (
        <MealDetailsModal
          isOpen={selectedMealForDetails !== null}
          onClose={() => setSelectedMealForDetails(null)}
          mealName={selectedMealForDetails.mealName}
          mealItems={Array.isArray(selectedMealForDetails.mealData) ? selectedMealForDetails.mealData as MealItem[] : []}
          consumedAt={selectedMealForDetails.consumedAt}
        />
      )}
    </div>
  );
};
