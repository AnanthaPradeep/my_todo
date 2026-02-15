/**
 * Checklist Type Definitions
 * Structured life management system with frequency-based recurring tasks
 */

export type ChecklistFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Unified with Task Categories for better integration
export type ChecklistCategory =
  | 'work'
  | 'health'
  | 'finance'
  | 'learning'
  | 'relationships'
  | 'personal-growth';

export interface ChecklistItem {
  id: string;
  title: string;
  category: ChecklistCategory;
  frequency: ChecklistFrequency;
  completed: boolean;
  completedAt?: string; // ISO timestamp
  createdAt: string; // ISO timestamp
  order: number; // for custom ordering within category
  isTemplate: boolean; // true for predefined items, false for user-added
}

export interface ChecklistProgress {
  frequency?: ChecklistFrequency;
  category?: ChecklistCategory;
  completed: number;
  total: number;
  percentage: number;
}

export interface ChecklistStreak {
  current: number;
  longest: number;
  lastCompletedDate: string; // YYYY-MM-DD
  totalDaysCompleted: number;
}

export interface ResetTimestamps {
  lastDailyReset: string; // ISO timestamp
  lastWeeklyReset: string; // ISO timestamp
  lastMonthlyReset: string; // ISO timestamp
  lastYearlyReset: string; // ISO timestamp
}

export interface DailyCompletionRecord {
  date: string; // YYYY-MM-DD
  completed: number;
  total: number;
  percentage: number;
}
