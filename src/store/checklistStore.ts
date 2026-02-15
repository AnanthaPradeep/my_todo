/**
 * Checklist Store
 * Manages structured life checklist system with frequency-based resets
 * Uses Zustand with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  ChecklistItem,
  ChecklistFrequency,
  ChecklistCategory,
  ChecklistStreak,
  ResetTimestamps,
  ChecklistProgress,
  DailyCompletionRecord,
} from '../types/checklist';
import { ALL_CHECKLIST_TEMPLATES } from '../data/checklistTemplates';
import { dateUtils } from '../utils/dateUtils';

interface ChecklistStore {
  // State
  items: ChecklistItem[];
  streak: ChecklistStreak;
  resetTimestamps: ResetTimestamps;
  initialized: boolean;
  completionHistory: DailyCompletionRecord[]; // Last 365 days

  // Initialization
  initializeTemplates: () => void;
  reinitializeTemplates: () => void;

  // CRUD Operations
  addItem: (item: Omit<ChecklistItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<ChecklistItem>) => void;
  deleteItem: (id: string) => void;
  toggleItem: (id: string) => void;
  reorderItems: (frequency: ChecklistFrequency, itemIds: string[]) => void;

  // Reset Operations
  resetDaily: () => void;
  resetWeekly: () => void;
  resetMonthly: () => void;
  resetYearly: () => void;

  // Query Methods
  getItemsByFrequency: (frequency: ChecklistFrequency) => ChecklistItem[];
  getItemsByCategory: (category: ChecklistCategory) => ChecklistItem[];
  getProgress: (frequency: ChecklistFrequency, category?: ChecklistCategory) => ChecklistProgress;
  getOverallProgress: () => ChecklistProgress;
  getDailyCompletionHistory: () => Map<string, number>;

  // Streak Management
  updateStreak: () => void;
  resetStreak: () => void;

  // Utility
  recordDailyCompletion: () => void;
  clearAllData: () => void;
}

const initialResetTimestamps: ResetTimestamps = {
  lastDailyReset: new Date().toISOString(),
  lastWeeklyReset: new Date().toISOString(),
  lastMonthlyReset: new Date().toISOString(),
  lastYearlyReset: new Date().toISOString(),
};

const initialStreak: ChecklistStreak = {
  current: 0,
  longest: 0,
  lastCompletedDate: '',
  totalDaysCompleted: 0,
};

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      streak: initialStreak,
      resetTimestamps: initialResetTimestamps,
      initialized: false,
      completionHistory: [],

      // Initialize Templates
      initializeTemplates: () => {
        const { initialized, items } = get();
        
        if (initialized && items.length > 0) {
          return; // Already initialized
        }

        const now = new Date().toISOString();
        const templatedItems: ChecklistItem[] = ALL_CHECKLIST_TEMPLATES.map((template) => ({
          ...template,
          id: uuidv4(),
          completed: false,
          createdAt: now,
        }));

        set({
          items: templatedItems,
          initialized: true,
          resetTimestamps: initialResetTimestamps,
        });
      },

      // Force Reinitialize Templates (preserves completion state)
      reinitializeTemplates: () => {
        const { items: currentItems } = get();
        const now = new Date().toISOString();
        
        // Create a map of current completion states by title+category+frequency
        const completionMap = new Map<string, { completed: boolean; completedAt?: string }>();
        currentItems.forEach(item => {
          const key = `${item.title}|${item.category}|${item.frequency}`;
          completionMap.set(key, {
            completed: item.completed,
            completedAt: item.completedAt,
          });
        });

        // Create new items from templates, preserving completion state where items match
        const newItems: ChecklistItem[] = ALL_CHECKLIST_TEMPLATES.map((template) => {
          const key = `${template.title}|${template.category}|${template.frequency}`;
          const existingState = completionMap.get(key);
          
          return {
            ...template,
            id: uuidv4(),
            completed: existingState?.completed || false,
            completedAt: existingState?.completedAt,
            createdAt: now,
          };
        });

        set({
          items: newItems,
          initialized: true,
        });
      },

      // Add Custom Item
      addItem: (itemData) => {
        const newItem: ChecklistItem = {
          ...itemData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      // Update Item
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      // Delete Item (only custom items)
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // Toggle Item Completion
      toggleItem: (id) => {
        const now = new Date().toISOString();
        
        set((state) => {
          const items = state.items.map((item) => {
            if (item.id === id) {
              const newCompleted = !item.completed;
              return {
                ...item,
                completed: newCompleted,
                completedAt: newCompleted ? now : undefined,
              };
            }
            return item;
          });

          return { items };
        });

        // Record daily completion if it's a daily item
        const item = get().items.find((i) => i.id === id);
        if (item?.frequency === 'daily') {
          get().recordDailyCompletion();
        }
      },

      // Reorder Items
      reorderItems: (frequency, itemIds) => {
        set((state) => {
          const frequencyItems = state.items.filter((item) => item.frequency === frequency);
          const otherItems = state.items.filter((item) => item.frequency !== frequency);

          const reorderedFrequencyItems = itemIds
            .map((id) => frequencyItems.find((item) => item.id === id))
            .filter((item): item is ChecklistItem => item !== undefined)
            .map((item, index) => ({ ...item, order: index + 1 }));

          return {
            items: [...otherItems, ...reorderedFrequencyItems],
          };
        });
      },

      // Reset Daily Items
      resetDaily: () => {
        const now = new Date().toISOString();
        
        set((state) => ({
          items: state.items.map((item) =>
            item.frequency === 'daily'
              ? { ...item, completed: false, completedAt: undefined }
              : item
          ),
          resetTimestamps: {
            ...state.resetTimestamps,
            lastDailyReset: now,
          },
        }));
      },

      // Reset Weekly Items
      resetWeekly: () => {
        const now = new Date().toISOString();
        
        set((state) => ({
          items: state.items.map((item) =>
            item.frequency === 'weekly'
              ? { ...item, completed: false, completedAt: undefined }
              : item
          ),
          resetTimestamps: {
            ...state.resetTimestamps,
            lastWeeklyReset: now,
          },
        }));
      },

      // Reset Monthly Items
      resetMonthly: () => {
        const now = new Date().toISOString();
        
        set((state) => ({
          items: state.items.map((item) =>
            item.frequency === 'monthly'
              ? { ...item, completed: false, completedAt: undefined }
              : item
          ),
          resetTimestamps: {
            ...state.resetTimestamps,
            lastMonthlyReset: now,
          },
        }));
      },

      // Reset Yearly Items
      resetYearly: () => {
        const now = new Date().toISOString();
        
        set((state) => ({
          items: state.items.map((item) =>
            item.frequency === 'yearly'
              ? { ...item, completed: false, completedAt: undefined }
              : item
          ),
          resetTimestamps: {
            ...state.resetTimestamps,
            lastYearlyReset: now,
          },
        }));
      },

      // Get Items by Frequency
      getItemsByFrequency: (frequency) => {
        const { items } = get();
        return items
          .filter((item) => item.frequency === frequency)
          .sort((a, b) => {
            // Sort by category, then order
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category);
            }
            return a.order - b.order;
          });
      },

      // Get Items by Category
      getItemsByCategory: (category) => {
        const { items } = get();
        return items
          .filter((item) => item.category === category)
          .sort((a, b) => a.order - b.order);
      },

      // Get Progress
      getProgress: (frequency, category?) => {
        const { items } = get();
        let filtered = items.filter((item) => item.frequency === frequency);
        
        if (category) {
          filtered = filtered.filter((item) => item.category === category);
        }

        const completed = filtered.filter((item) => item.completed).length;
        const total = filtered.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          frequency,
          category,
          completed,
          total,
          percentage,
        };
      },

      // Get Overall Progress (0-100)
      getOverallProgress: () => {
        const { items } = get();
        const completed = items.filter((item) => item.completed).length;
        const total = items.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
      },

      // Get Daily Completion History
      getDailyCompletionHistory: () => {
        const { completionHistory } = get();
        const historyMap = new Map<string, number>();
        
        completionHistory.forEach((record) => {
          historyMap.set(record.date, record.percentage);
        });

        return historyMap;
      },

      // Update Streak
      updateStreak: () => {
        const { items, streak } = get();
        const dailyItems = items.filter((item) => item.frequency === 'daily');
        const allDailyCompleted = dailyItems.every((item) => item.completed);

        const today = dateUtils.getToday();
        const yesterday = dateUtils.formatDateISO(
          new Date(new Date().setDate(new Date().getDate() - 1))
        );

        // Check if yesterday was 100% complete
        const yesterdayRecord = get()
          .completionHistory
          .find((record) => record.date === yesterday);

        if (!yesterdayRecord || yesterdayRecord.percentage < 100) {
          // Streak breaks if yesterday wasn't 100%
          if (allDailyCompleted) {
            // Start new streak
            set({
              streak: {
                current: 1,
                longest: Math.max(1, streak.longest),
                lastCompletedDate: today,
                totalDaysCompleted: streak.totalDaysCompleted + 1,
              },
            });
          }
          return;
        }

        // Continue streak
        if (allDailyCompleted && streak.lastCompletedDate !== today) {
          const newCurrent = streak.current + 1;
          set({
            streak: {
              current: newCurrent,
              longest: Math.max(newCurrent, streak.longest),
              lastCompletedDate: today,
              totalDaysCompleted: streak.totalDaysCompleted + 1,
            },
          });
        }
      },

      // Reset Streak
      resetStreak: () => {
        set({ streak: initialStreak });
      },

      // Record Daily Completion
      recordDailyCompletion: () => {
        const { items, completionHistory } = get();
        const today = dateUtils.getToday();
        
        const dailyItems = items.filter((item) => item.frequency === 'daily');
        const completed = dailyItems.filter((item) => item.completed).length;
        const total = dailyItems.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        const existingRecordIndex = completionHistory.findIndex(
          (record) => record.date === today
        );

        let newHistory = [...completionHistory];
        
        if (existingRecordIndex >= 0) {
          // Update existing record
          newHistory[existingRecordIndex] = {
            date: today,
            completed,
            total,
            percentage,
          };
        } else {
          // Add new record
          newHistory.push({
            date: today,
            completed,
            total,
            percentage,
          });
        }

        // Keep only last 365 days
        newHistory = newHistory
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 365);

        set({ completionHistory: newHistory });
      },

      // Clear All Data
      clearAllData: () => {
        set({
          items: [],
          streak: initialStreak,
          resetTimestamps: initialResetTimestamps,
          initialized: false,
          completionHistory: [],
        });
      },
    }),
    {
      name: 'lifeos_checklists',
      version: 1,
    }
  )
);
