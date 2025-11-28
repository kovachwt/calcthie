import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FoodDetail, PortionInfo } from '../../types/food';
import { getPortionDisplayName } from '../../utils/nutrition';

interface AddFoodModalProps {
  food: FoodDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: FoodDetail, portion: PortionInfo, quantity: number) => void;
}

export const AddFoodModal = ({ food, isOpen, onClose, onAdd }: AddFoodModalProps) => {
  const [selectedPortion, setSelectedPortion] = useState<PortionInfo | null>(null);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    if (food) {
      // Always default to the custom 1 gram portion (will be first in the list)
      setSelectedPortion({
        amount: 1,
        unit: 'g',
        gramWeight: 1,
        description: '1 gram',
        modifier: null,
      });
    }
  }, [food]);

  const handleAdd = () => {
    if (food && selectedPortion) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        onAdd(food, selectedPortion, qty);
        onClose();
        setQuantity('1');
      }
    }
  };

  if (!food) return null;

  // Always add a "1 gram" custom portion as the first option
  const customGramPortion: PortionInfo = {
    amount: 1,
    unit: 'g',
    gramWeight: 1,
    description: '1 gram',
    modifier: null,
  };

  const portions = food.portions.length > 0
    ? [customGramPortion, ...food.portions]
    : [
        customGramPortion,
        {
          amount: 1,
          unit: 'serving',
          gramWeight: 100,
          description: '100g (default)',
          modifier: null,
        },
      ];

  const calculateTotalGrams = () => {
    if (!selectedPortion) return 0;
    const qty = parseFloat(quantity) || 0;
    return ((selectedPortion.gramWeight || 100) * qty).toFixed(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Meal" size="md">
      <div className="space-y-4">
        {/* Food Name */}
        <div>
          <h3 className="font-semibold text-gray-900">{food.description}</h3>
          {food.brandInfo?.brandOwner && (
            <p className="text-sm text-gray-600 mt-1">{food.brandInfo.brandOwner}</p>
          )}
        </div>

        {/* Portion Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Portion
          </label>
          <select
            value={portions.findIndex((p) => p === selectedPortion)}
            onChange={(e) => setSelectedPortion(portions[parseInt(e.target.value)])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {portions.map((portion, index) => (
              <option key={index} value={index}>
                {getPortionDisplayName(portion)}
                {portion.gramWeight && ` (${portion.gramWeight}g)`}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <Input
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.1"
            step="0.1"
            placeholder="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total: {calculateTotalGrams()}g
          </p>
        </div>

        {/* Macro Preview */}
        {selectedPortion && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Nutrition for this serving:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {food.nutrients
                .filter((n) => [1008, 1003, 1005, 1004].includes(n.nutrientId))
                .map((nutrient) => {
                  const totalGrams = parseFloat(calculateTotalGrams() || '0');
                  const amount = nutrient.amount ? (nutrient.amount * totalGrams) / 100 : 0;
                  return (
                    <div key={nutrient.nutrientId} className="flex justify-between">
                      <span className="text-gray-600">{nutrient.name}:</span>
                      <span className="font-medium text-gray-900">
                        {amount.toFixed(1)} {nutrient.unit}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!selectedPortion || parseFloat(quantity) <= 0}>
            Add to Meal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
