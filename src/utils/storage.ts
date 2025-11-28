/**
 * localStorage utility functions
 */

const STORAGE_KEYS = {
  MEAL: 'calcthie_current_meal',
  GOALS: 'calcthie_nutrition_goals',
  HISTORY: 'calcthie_recent_foods',
  FAVORITES: 'calcthie_favorite_foods',
  USER: 'calcthie_user',
} as const;

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

export const storage = {
  meal: {
    save: (value: unknown) => saveToLocalStorage(STORAGE_KEYS.MEAL, value),
    load: <T>(defaultValue: T) => loadFromLocalStorage(STORAGE_KEYS.MEAL, defaultValue),
    clear: () => removeFromLocalStorage(STORAGE_KEYS.MEAL),
  },
  goals: {
    save: (value: unknown) => saveToLocalStorage(STORAGE_KEYS.GOALS, value),
    load: <T>(defaultValue: T) => loadFromLocalStorage(STORAGE_KEYS.GOALS, defaultValue),
    clear: () => removeFromLocalStorage(STORAGE_KEYS.GOALS),
  },
  history: {
    save: (value: unknown) => saveToLocalStorage(STORAGE_KEYS.HISTORY, value),
    load: <T>(defaultValue: T) => loadFromLocalStorage(STORAGE_KEYS.HISTORY, defaultValue),
    clear: () => removeFromLocalStorage(STORAGE_KEYS.HISTORY),
  },
  favorites: {
    save: (value: unknown) => saveToLocalStorage(STORAGE_KEYS.FAVORITES, value),
    load: <T>(defaultValue: T) => loadFromLocalStorage(STORAGE_KEYS.FAVORITES, defaultValue),
    clear: () => removeFromLocalStorage(STORAGE_KEYS.FAVORITES),
  },
  user: {
    save: (value: unknown) => saveToLocalStorage(STORAGE_KEYS.USER, value),
    load: <T>(defaultValue: T) => loadFromLocalStorage(STORAGE_KEYS.USER, defaultValue),
    clear: () => removeFromLocalStorage(STORAGE_KEYS.USER),
  },
};
