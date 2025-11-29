import { useState } from 'react';
import { ShoppingCart, Trash2, Save, Share2, Check } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { MealItem } from './MealItem';
import { SaveMealModal } from './SaveMealModal';
import { useMealStore } from '../../stores/mealStore';
import { copyMealUrlToClipboard } from '../../utils/mealSharing';

interface MealCartProps {
  onEditItem?: (itemId: string) => void;
}

export const MealCart = ({ onEditItem }: MealCartProps) => {
  const { items, removeItem, clearMeal } = useMealStore();
  const [showSaveMealModal, setShowSaveMealModal] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const handleRemove = (id: string) => {
    if (confirm('Remove this item from your meal?')) {
      removeItem(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all items from your meal?')) {
      clearMeal();
    }
  };

  const handleCopyUrl = async () => {
    const success = await copyMealUrlToClipboard(items);
    if (success) {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Current Meal
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({items.length} item{items.length !== 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Your meal is empty</p>
            <p className="text-sm text-gray-400 mt-1">
              Search for foods and add them to your meal
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {items.map((item) => (
                <MealItem
                  key={item.id}
                  item={item}
                  onEdit={onEditItem || (() => {})}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Button
                onClick={() => setShowSaveMealModal(true)}
                className="w-full"
                variant="primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Add to Food Log
              </Button>
              <Button
                onClick={handleCopyUrl}
                className="w-full"
                variant="secondary"
              >
                {urlCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Shareable Link
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>

      {/* Save Meal Modal */}
      <SaveMealModal
        isOpen={showSaveMealModal}
        onClose={() => setShowSaveMealModal(false)}
      />
    </Card>
  );
};
