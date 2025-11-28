import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

export interface FoodType {
  value: string;
  label: string;
}

export const FOOD_TYPES: FoodType[] = [
  { value: 'sr_legacy_food', label: 'Generic Foods' },
  { value: 'foundation_food', label: 'Foundation Foods' },
  { value: 'survey_fndds_food', label: 'Survey Foods' },
  { value: 'branded_food', label: 'Branded Foods' },
];

interface FoodTypeFilterProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export const FoodTypeFilter = ({ selectedTypes, onChange }: FoodTypeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (typeValue: string) => {
    if (selectedTypes.includes(typeValue)) {
      onChange(selectedTypes.filter((t) => t !== typeValue));
    } else {
      onChange([...selectedTypes, typeValue]);
    }
  };

  const selectAll = () => {
    onChange(FOOD_TYPES.map((t) => t.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedTypes.length;
  const allSelected = selectedCount === FOOD_TYPES.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          selectedCount > 0 && selectedCount < FOOD_TYPES.length
            ? 'border-primary-500 bg-primary-50 text-primary-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          Food Types
          {selectedCount > 0 && selectedCount < FOOD_TYPES.length && ` (${selectedCount})`}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Filter by Food Type</span>
              <button
                onClick={clearAll}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear
              </button>
            </div>
            <button
              onClick={selectAll}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Select All
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {FOOD_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.value)}
                  onChange={() => toggleType(type.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
