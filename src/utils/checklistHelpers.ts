/**
 * Checklist Helper Functions
 * Utilities for working with checklist categories and data
 */

import checklistData from '../data/checklistData.json';
import type { ChecklistCategory } from '../types/checklist';

export interface CategoryInfo {
  id: ChecklistCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

/**
 * Get all available categories
 */
export function getAllCategories(): CategoryInfo[] {
  return checklistData.categories.map(cat => ({
    id: cat.id as ChecklistCategory,
    label: cat.label,
    icon: cat.icon,
    color: cat.color,
    description: cat.description,
  }));
}

/**
 * Get category info by ID
 */
export function getCategoryInfo(categoryId: ChecklistCategory): CategoryInfo | undefined {
  const cat = checklistData.categories.find(c => c.id === categoryId);
  if (!cat) return undefined;
  
  return {
    id: cat.id as ChecklistCategory,
    label: cat.label,
    icon: cat.icon,
    color: cat.color,
    description: cat.description,
  };
}

/**
 * Get category label
 */
export function getCategoryLabel(categoryId: ChecklistCategory): string {
  const cat = getCategoryInfo(categoryId);
  return cat ? cat.label : categoryId;
}

/**
 * Get category color
 */
export function getCategoryColor(categoryId: ChecklistCategory): string {
  const cat = getCategoryInfo(categoryId);
  return cat?.color || '#6B7280';
}

/**
 * Get categories for a specific frequency
 */
export function getCategoriesForFrequency(frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): ChecklistCategory[] {
  const frequencyData = checklistData.checklists[frequency];
  return frequencyData.map(group => group.category as ChecklistCategory);
}

/**
 * Get checklist statistics
 */
export function getChecklistStats() {
  return {
    daily: checklistData.checklists.daily.reduce((sum, group) => sum + group.items.length, 0),
    weekly: checklistData.checklists.weekly.reduce((sum, group) => sum + group.items.length, 0),
    monthly: checklistData.checklists.monthly.reduce((sum, group) => sum + group.items.length, 0),
    yearly: checklistData.checklists.yearly.reduce((sum, group) => sum + group.items.length, 0),
    totalCategories: checklistData.categories.length,
  };
}
