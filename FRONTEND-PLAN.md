# Calcthie Frontend - Implementation Plan

**Tagline:** Calculate the nutrition in your smoothies (and meals!)

## Overview

A React + TypeScript web application for tracking food nutrition. Users can search for foods, add them to meals with specific portion sizes, and view detailed macro and micronutrient totals.

---

## Technology Stack

### Core
- **React 18** with **TypeScript**
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing

### State & Data
- **TanStack Query (React Query)** - API calls, caching, loading states
- **Zustand** - Global state management (meals, goals)
- **localStorage** - Persist meals and goals (Phase 1)

### UI & Styling
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Charts and visualizations
- **Lucide React** - Icon library
- **date-fns** - Date utilities

### API Integration
- **Axios** - HTTP client for CalcthieFoodApi

---

## Phase 1 - MVP Features

### 1. Food Search
- Search foods by name
- Display search results with:
  - Food description
  - Data type (branded/generic)
  - Brand owner (if branded)
  - Default serving size
- Prioritize generic foods in results
- Loading and error states
- Empty state ("No results found")

### 2. Food Details View
- View complete food information:
  - Description
  - Category
  - Data type
- **Macro Summary** (main view):
  - Calories
  - Protein
  - Carbohydrates
  - Fat
  - Fiber
- **Micro Details** (expandable/advanced view):
  - All vitamins
  - All minerals
  - Other nutrients
  - Sorted by rank/importance
- Available portion sizes
- "Add to Meal" button

### 3. Add to Meal
- Select portion size from dropdown
- Enter custom quantity
- Calculate nutrients for selected portion
- Add to current meal
- Visual confirmation

### 4. Meal Cart
- List of all added foods with:
  - Food name
  - Portion (e.g., "1 cup", "100g")
  - Quick nutrient preview
  - Edit button (change portion)
  - Remove button
- Empty state ("Your meal is empty")
- Clear all button

### 5. Meal Summary
- **Total Nutrition Display**:
  - Total calories
  - Total macros (protein, carbs, fat, fiber)
  - Total micronutrients (expandable)
- **Visual Charts**:
  - Macro breakdown pie chart (protein/carbs/fat percentages)
  - Progress bars for nutrition goals
- Export/Save button (future)

### 6. Nutrition Goals
- Set daily goals for:
  - Calories
  - Protein (g)
  - Carbohydrates (g)
  - Fat (g)
  - Fiber (g)
- Simple form to edit goals
- Store in localStorage
- Show progress in meal summary

### 7. Recently Added Foods
- Track last 10 foods added to any meal
- Quick add from recent list
- Store in localStorage
- Clear history option

---

## Phase 2 - Enhanced Features (Future)

- **Multiple Meals Per Day** - Breakfast, lunch, dinner, snacks
- **Date-Based Tracking** - Calendar view, navigate days
- **Meal Templates** - Save and reuse common meals
- **Barcode Search** - Mobile barcode scanning
- **Food History** - Full history with search/filter
- **Weekly View** - Nutrition trends over time
- **Recipe Builder** - Combine foods into recipes
- **Custom Foods** - User-created food entries
- **Authentication** - User accounts (requires backend)
- **Backend Persistence** - Save meals to database

---

## Project Structure

```
calcthie-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios setup
│   │   ├── foodApi.ts             # Food search, details, nutrients
│   │   └── types.ts               # API response types (match DTOs)
│   ├── components/
│   │   ├── food/
│   │   │   ├── FoodSearch.tsx     # Search input + results
│   │   │   ├── FoodCard.tsx       # Food result card
│   │   │   ├── FoodDetails.tsx    # Detailed food view
│   │   │   └── NutrientTable.tsx  # Nutrient list/table
│   │   ├── meal/
│   │   │   ├── MealCart.tsx       # Meal items list
│   │   │   ├── MealItem.tsx       # Single meal item
│   │   │   ├── MealSummary.tsx    # Totals + charts
│   │   │   └── AddFoodModal.tsx   # Portion selection modal
│   │   ├── nutrition/
│   │   │   ├── MacroBreakdown.tsx # Pie chart
│   │   │   ├── MacroSummary.tsx   # Cards for macros
│   │   │   ├── MicroTable.tsx     # Micronutrient table
│   │   │   └── GoalProgress.tsx   # Progress bars
│   │   ├── goals/
│   │   │   └── GoalsForm.tsx      # Edit nutrition goals
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Spinner.tsx
│   ├── hooks/
│   │   ├── useFoodSearch.ts       # React Query hook
│   │   ├── useFoodDetails.ts      # React Query hook
│   │   └── useDebounce.ts         # Debounce search input
│   ├── stores/
│   │   ├── mealStore.ts           # Zustand: current meal
│   │   ├── goalsStore.ts          # Zustand: nutrition goals
│   │   └── historyStore.ts        # Zustand: recent foods
│   ├── types/
│   │   ├── food.ts                # Food, FoodDetail types
│   │   ├── nutrient.ts            # Nutrient, NutrientInfo types
│   │   ├── meal.ts                # MealItem, Meal types
│   │   └── goals.ts               # NutritionGoals type
│   ├── utils/
│   │   ├── nutrition.ts           # Calculate totals, macros
│   │   ├── format.ts              # Format numbers, nutrients
│   │   └── storage.ts             # localStorage helpers
│   ├── pages/
│   │   ├── HomePage.tsx           # Search + Meal cart
│   │   ├── FoodDetailsPage.tsx    # Food detail view
│   │   ├── MealSummaryPage.tsx    # Full meal analysis
│   │   └── GoalsPage.tsx          # Edit goals
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## API Integration

### Base URL
```typescript
const API_BASE_URL = 'http://localhost:5187/api';
```

### Key Endpoints

1. **Search Foods**
   ```typescript
   GET /search/foods?query={text}&limit=20
   Returns: FoodSearchResultDto[]
   ```

2. **Get Food Details**
   ```typescript
   GET /foods/{fdcId}
   Returns: FoodDetailDto
   ```

3. **Get Food Nutrients**
   ```typescript
   GET /foods/{fdcId}/nutrients
   Returns: NutrientInfoDto[]
   ```

4. **Get Food Portions**
   ```typescript
   GET /foods/{fdcId}/portions
   Returns: PortionInfoDto[]
   ```

---

## Data Models (TypeScript)

### API Response Types (match backend DTOs)

```typescript
// src/types/food.ts
export interface FoodSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  defaultServingSizeGrams: number | null;
}

export interface FoodDetail {
  fdcId: number;
  description: string;
  dataType: string;
  category: string | null;
  nutrients: NutrientInfo[];
  portions: PortionInfo[];
  brandInfo: BrandedFoodInfo | null;
}

export interface NutrientInfo {
  nutrientId: number;
  name: string;
  amount: number | null;
  unit: string;
  percentDailyValue: number | null;
  rank: number | null;
}

export interface PortionInfo {
  amount: number | null;
  unit: string;
  gramWeight: number | null;
  description: string | null;
  modifier: string | null;
}

export interface BrandedFoodInfo {
  brandOwner: string | null;
  brandName: string | null;
  gtinUpc: string | null;
  ingredients: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
  householdServing: string | null;
  category: string | null;
}
```

### App State Types

```typescript
// src/types/meal.ts
export interface MealItem {
  id: string; // unique ID for this meal item
  food: FoodDetail;
  portion: PortionInfo;
  quantity: number; // e.g., 1.5 cups
  nutrients: NutrientInfo[]; // calculated for this portion
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  createdAt: Date;
}

// src/types/goals.ts
export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}
```

---

## State Management (Zustand)

### Meal Store

```typescript
// src/stores/mealStore.ts
interface MealState {
  items: MealItem[];
  addItem: (food: FoodDetail, portion: PortionInfo, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
  clearMeal: () => void;
  getTotals: () => NutrientTotals;
}
```

### Goals Store

```typescript
// src/stores/goalsStore.ts
interface GoalsState {
  goals: NutritionGoals;
  setGoals: (goals: NutritionGoals) => void;
  resetGoals: () => void;
}
```

### History Store

```typescript
// src/stores/historyStore.ts
interface HistoryState {
  recentFoods: FoodDetail[];
  addToHistory: (food: FoodDetail) => void;
  clearHistory: () => void;
}
```

---

## Key Utilities

### Calculate Nutrients for Portion

```typescript
// src/utils/nutrition.ts
export function calculateNutrientsForPortion(
  nutrients: NutrientInfo[],
  portionGrams: number
): NutrientInfo[] {
  // Nutrients from API are per 100g
  // Calculate for specific portion size
  return nutrients.map(nutrient => ({
    ...nutrient,
    amount: nutrient.amount ? (nutrient.amount * portionGrams) / 100 : null
  }));
}
```

### Calculate Meal Totals

```typescript
export function calculateMealTotals(items: MealItem[]): NutrientTotals {
  // Sum all nutrients across all items
  // Return organized by macros and micros
}
```

### Get Macro Percentages

```typescript
export function getMacroPercentages(totals: NutrientTotals): {
  protein: number;
  carbs: number;
  fat: number;
} {
  // Calculate % of calories from each macro
}
```

---

## UI/UX Design Notes

### Color Scheme (Smoothie-Inspired)
- **Primary**: Green (#10b981) - Fresh, healthy
- **Secondary**: Purple (#8b5cf6) - Berry smoothies
- **Accent**: Orange (#f97316) - Tropical fruits
- **Neutral**: Gray scale for text

### Layout
- **Desktop**: Two-column layout (search/details left, meal cart right)
- **Mobile**: Single column, bottom sheet for meal cart

### Key Interactions
1. **Search** → Auto-search as you type (debounced)
2. **Click food** → Show details modal/page
3. **Add to meal** → Select portion → Confirm → Add to cart
4. **Edit portion** → Click edit → Update quantity → Save
5. **View totals** → Expand macro/micro sections

---

## Development Phases

### Phase 1.1: Project Setup
- [x] Create Vite + React + TypeScript project
- [x] Install dependencies
- [x] Configure Tailwind CSS
- [x] Setup project structure
- [x] Create base components (Button, Input, Card)
- [x] Setup API client

### Phase 1.2: Food Search
- [ ] Build search input component
- [ ] Implement food search API integration
- [ ] Create food result cards
- [ ] Add loading/error states
- [ ] Test with real API

### Phase 1.3: Food Details
- [ ] Create food details view
- [ ] Display macro summary
- [ ] Build expandable micro table
- [ ] Show portion options
- [ ] Test with various food types

### Phase 1.4: Add to Meal
- [ ] Create portion selection modal
- [ ] Implement quantity input
- [ ] Calculate nutrients for portion
- [ ] Add to meal store
- [ ] Update meal cart

### Phase 1.5: Meal Cart & Summary
- [ ] Build meal item list
- [ ] Add edit/remove actions
- [ ] Calculate totals
- [ ] Create macro pie chart
- [ ] Build micro totals table

### Phase 1.6: Goals & Progress
- [ ] Create goals form
- [ ] Store in localStorage
- [ ] Build progress bars
- [ ] Show goal vs actual

### Phase 1.7: Recent Foods
- [ ] Track recent foods
- [ ] Display recent list
- [ ] Quick add functionality

### Phase 1.8: Polish
- [ ] Responsive design
- [ ] Empty states
- [ ] Error handling
- [ ] Loading states
- [ ] Accessibility

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Search for branded food
- [ ] Search for generic food
- [ ] View food with many nutrients
- [ ] View food with few nutrients
- [ ] Add food with standard portion
- [ ] Add food with custom amount
- [ ] Edit meal item quantity
- [ ] Remove meal item
- [ ] View meal totals
- [ ] Set nutrition goals
- [ ] Check goal progress
- [ ] Clear meal
- [ ] Test with slow network
- [ ] Test error states
- [ ] Test on mobile

---

## Performance Considerations

1. **API Caching** - React Query caches search results
2. **Debounced Search** - Wait 300ms before searching
3. **Lazy Loading** - Load food details on demand
4. **Memoization** - Memoize expensive calculations
5. **Virtual Scrolling** - For long nutrient lists (future)

---

## Deployment (Future)

### Build
```bash
npm run build
```

### Hosting Options
- **Vercel** - Automatic deployments
- **Netlify** - Simple static hosting
- **Azure Static Web Apps** - Integrate with .NET backend

---

## Notes

- All nutrient amounts from API are **per 100g**
- Must convert to selected portion size
- Category field may be text name OR numeric ID
- Handle null nutrients gracefully
- Default portion is 100g if no portions available
