import { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useMealStore } from '../../stores/mealStore';
import { getPortionDisplayName } from '../../utils/nutrition';
import type { PortionInfo } from '../../types/food';

interface EditMealItemModalProps {
  itemId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditMealItemModal = ({ itemId, isOpen, onClose }: EditMealItemModalProps) => {
  const { items, updateItem } = useMealStore();
  const [quantity, setQuantity] = useState('1');
  const [selectedPortion, setSelectedPortion] = useState<PortionInfo | null>(null);

  // Find the item being edited
  const item = items.find((i) => i.id === itemId);

  // Initialize quantity and portion when item changes
  useEffect(() => {
    if (item) {
      setQuantity(item.quantity.toString());
      setSelectedPortion(item.portion);
    }
  }, [item]);

  const handleSave = () => {
    if (item && selectedPortion) {
      const newQuantity = parseFloat(quantity);
      if (newQuantity > 0) {
        updateItem(item.id, newQuantity, selectedPortion);
        onClose();
      }
    }
  };

  const handleCancel = () => {
    // Reset to original quantity and portion
    if (item) {
      setQuantity(item.quantity.toString());
      setSelectedPortion(item.portion);
    }
    onClose();
  };

  // Always add a "1 gram" custom portion as the first option
  // Use useMemo to ensure stable object reference - MUST be before early return
  const portions = useMemo(() => {
    if (!item) return [];

    const customGramPortion: PortionInfo = {
      amount: 1,
      unit: 'g',
      gramWeight: 1,
      description: '1 gram',
      modifier: null,
    };

    return item.food.portions.length > 0
      ? [customGramPortion, ...item.food.portions]
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
  }, [item]);

  const calculateTotalGrams = () => {
    if (!selectedPortion) return '0';
    const qty = parseFloat(quantity) || 0;
    return ((selectedPortion.gramWeight || 100) * qty).toFixed(1);
  };

  if (!item) return null;

  // Find the index of the selected portion by comparing properties
  const getSelectedPortionIndex = () => {
    if (!selectedPortion) return 0;
    return portions.findIndex(
      (p) =>
        p.gramWeight === selectedPortion.gramWeight &&
        p.description === selectedPortion.description &&
        p.modifier === selectedPortion.modifier &&
        p.amount === selectedPortion.amount &&
        p.unit === selectedPortion.unit
    );
  };

  const selectedIndex = getSelectedPortionIndex();

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Edit Meal Item" size="md">
      <div className="space-y-4">
        {/* Food Name */}
        <div>
          <h3 className="font-semibold text-gray-900">{item.food.description}</h3>
          {item.food.brandInfo?.brandOwner && (
            <p className="text-sm text-gray-600 mt-1">{item.food.brandInfo.brandOwner}</p>
          )}
        </div>

        {/* Portion Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portion Size
          </label>
          <select
            value={selectedIndex >= 0 ? selectedIndex : 0}
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

        {/* Quantity Input */}
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
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Updated nutrition for this serving:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {item.food.nutrients
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

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedPortion || parseFloat(quantity) <= 0}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
