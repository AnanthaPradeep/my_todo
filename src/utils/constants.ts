// Unified Categories - Used for both Tasks and Checklists
import checklistData from '../data/checklistData.json';

export const UNIFIED_CATEGORIES = checklistData.categories.map(cat => ({
  value: cat.id,
  label: cat.label,
  icon: cat.icon,
  color: cat.color,
  description: cat.description,
}));

// Task Categories - Now uses unified categories
export const TASK_CATEGORIES = UNIFIED_CATEGORIES.map(cat => ({
  value: cat.value,
  label: cat.label,
}));

// Checklist Categories - Now uses unified categories  
export const CHECKLIST_CATEGORIES = UNIFIED_CATEGORIES.map(cat => ({
  value: cat.value,
  label: cat.label,
  icon: cat.icon,
  color: cat.color,
  description: cat.description,
}));

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
] as const;

export const MOOD_OPTIONS = ['tired', 'stressed', 'neutral', 'happy', 'excited', 'productive'] as const;

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const DEFAULT_PAGE_TITLE = 'LifeOS - Life Management System';

export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'Ctrl+N',
  SEARCH: 'Ctrl+K',
  TOGGLE_DARK_MODE: 'Ctrl+Shift+L',
  COMPLETE_TASK: 'Ctrl+Enter',
} as const;

// Checklist Frequencies
export const CHECKLIST_FREQUENCIES = [
  { value: 'daily', label: 'Daily', shortLabel: 'Daily' },
  { value: 'weekly', label: 'Weekly', shortLabel: 'Weekly' },
  { value: 'monthly', label: 'Monthly', shortLabel: 'Monthly' },
  { value: 'yearly', label: 'Yearly', shortLabel: 'Yearly' },
] as const;
