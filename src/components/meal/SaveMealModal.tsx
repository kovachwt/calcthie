import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useMealStore } from '../../stores/mealStore';
import { useConsumedMealsStore } from '../../stores/consumedMealsStore';
import { useAuthStore } from '../../stores/authStore';

interface SaveMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveMealModal = ({ isOpen, onClose }: SaveMealModalProps) => {
  const { user } = useAuthStore();
  const { items, getTotals, clearMeal } = useMealStore();
  const { saveMeal } = useConsumedMealsStore();
  const [mealName, setMealName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to save meals');
      return;
    }

    if (items.length === 0) {
      alert('Cannot save an empty meal');
      return;
    }

    setIsSaving(true);
    try {
      const totals = getTotals();
      await saveMeal(mealName || 'Meal', items, totals);

      // Clear the current meal after saving
      clearMeal();

      // Reset and close
      setMealName('');
      onClose();
    } catch (error) {
      console.error('Failed to save meal:', error);
      alert('Failed to save meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const totals = getTotals();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Meal">
      <div className="space-y-4">
        {/* Meal Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Name (optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Breakfast, Lunch, Snack"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to save as "Meal"
          </p>
        </div>

        {/* Meal Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Meal Summary</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-600">Items</div>
              <div className="font-semibold">{items.length}</div>
            </div>
            <div>
              <div className="text-gray-600">Calories</div>
              <div className="font-semibold">{totals.calories.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-gray-600">Protein</div>
              <div className="font-semibold">{totals.protein.toFixed(1)}g</div>
            </div>
            <div>
              <div className="text-gray-600">Carbs</div>
              <div className="font-semibold">{totals.carbs.toFixed(1)}g</div>
            </div>
            <div>
              <div className="text-gray-600">Fat</div>
              <div className="font-semibold">{totals.fat.toFixed(1)}g</div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Please sign in to save meals and track your daily nutrition
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="flex-1"
            disabled={isSaving || !user}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Meal'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
