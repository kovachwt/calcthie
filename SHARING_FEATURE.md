# Meal Sharing Feature

## Overview
The meal sharing feature allows users to share their current meal with others via a URL. The URL encodes only the essential information (food IDs, portion indices, and quantities) to keep it compact.

## How It Works

### URL Format
```
http://localhost:5173/calcthie/?items=fdcId:portionIndex:quantity,fdcId:portionIndex:quantity,...
```

**Example:**
```
http://localhost:5173/calcthie/?items=123456:-1:150,789012:2:1
```

This URL represents:
- Food with ID `123456`, using custom 1 gram portion (index `-1`), with quantity `150`
- Food with ID `789012`, using portion at index `2` (from the food's portions array), with quantity `1`

**Special Portion Index Values:**
- `-1` = Custom 1 gram portion (always available for all foods)
- `0+` = Index in the food's portions array from the API

### User Flow

1. **Creating a Shareable Link:**
   - User adds foods to their current meal
   - Clicks "Copy Shareable Link" button in the Current Meal section
   - The URL is copied to their clipboard

2. **Opening a Shared Meal:**
   - User opens a shared meal URL
   - App shows a loading screen while fetching food details
   - All foods are added to the current meal
   - URL parameters are cleared after loading

### Implementation Details

#### Files Modified/Created:

1. **`src/utils/mealSharing.ts`** (new)
   - `encodeMealToUrl()` - Converts meal items to URL-safe format
   - `decodeMealFromUrl()` - Parses URL parameters back to food data
   - `generateShareableUrl()` - Creates the complete shareable URL
   - `copyMealUrlToClipboard()` - Copies URL to clipboard

2. **`src/hooks/useSharedMeal.ts`** (new)
   - Detects shared meal URL parameters on app load
   - Fetches food details from the API
   - Reconstructs the meal items
   - Handles errors and loading states

3. **`src/components/meal/MealCart.tsx`** (modified)
   - Added "Copy Shareable Link" button
   - Shows "Link Copied!" confirmation for 2 seconds

4. **`src/App.tsx`** (modified)
   - Integrated `useSharedMeal` hook
   - Shows loading state while shared meal is being loaded
   - Displays error banner if loading fails

### Benefits

- **Compact URLs:** Only essential data is encoded (3 numbers per food item)
- **Always Fresh:** Food details are fetched from the API, ensuring latest nutritional data
- **User Friendly:** Simple copy button with visual feedback
- **Error Handling:** Graceful error messages if URL is invalid or foods can't be loaded

### Limitations

- Requires internet connection to load shared meals (needs API access)
- If a food is removed from the database, the shared meal won't load completely
- Portion indices could become invalid if the food's portion data changes
