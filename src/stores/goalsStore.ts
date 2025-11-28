import { create } from 'zustand';
import type { NutritionGoals } from '../types/goals';
import { DEFAULT_GOALS } from '../types/goals';
import { storage } from '../utils/storage';

interface GoalsState {
  goals: NutritionGoals;
  setGoals: (goals: NutritionGoals) => void;
  resetGoals: () => void;
  loadFromStorage: () => void;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: DEFAULT_GOALS,

  setGoals: (goals) => {
    storage.goals.save(goals);
    set({ goals });
  },

  resetGoals: () => {
    storage.goals.save(DEFAULT_GOALS);
    set({ goals: DEFAULT_GOALS });
  },

  loadFromStorage: () => {
    const goals = storage.goals.load<NutritionGoals>(DEFAULT_GOALS);
    set({ goals });
  },
}));
