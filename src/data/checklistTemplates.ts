/**
 * Checklist Templates
 * Predefined checklist items organized by frequency and category
 * Data loaded from JSON for better maintainability
 */

import type { ChecklistItem, ChecklistCategory, ChecklistFrequency } from '../types/checklist';
import checklistData from './checklistData.json';

type ChecklistTemplate = Omit<ChecklistItem, 'id' | 'completed' | 'completedAt' | 'createdAt'>;

// Helper function to convert JSON data to template format
function convertJsonToTemplates(
  frequency: ChecklistFrequency,
  categoryGroups: Array<{ category: string; items: Array<{ title: string; order: number }> }>
): ChecklistTemplate[] {
  const templates: ChecklistTemplate[] = [];
  
  categoryGroups.forEach((group) => {
    group.items.forEach((item) => {
      templates.push({
        title: item.title,
        category: group.category as ChecklistCategory,
        frequency,
        order: item.order,
        isTemplate: true,
      });
    });
  });
  
  return templates;
}

// ============================================
// CHECKLIST TEMPLATES FROM JSON
// ============================================

export const DAILY_CHECKLIST_TEMPLATES: ChecklistTemplate[] = 
  convertJsonToTemplates('daily', checklistData.checklists.daily);

export const WEEKLY_CHECKLIST_TEMPLATES: ChecklistTemplate[] = 
  convertJsonToTemplates('weekly', checklistData.checklists.weekly);

export const MONTHLY_CHECKLIST_TEMPLATES: ChecklistTemplate[] = 
  convertJsonToTemplates('monthly', checklistData.checklists.monthly);

export const YEARLY_CHECKLIST_TEMPLATES: ChecklistTemplate[] = 
  convertJsonToTemplates('yearly', checklistData.checklists.yearly);

// ============================================
// COMBINED TEMPLATES
// ============================================

export const ALL_CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  ...DAILY_CHECKLIST_TEMPLATES,
  ...WEEKLY_CHECKLIST_TEMPLATES,
  ...MONTHLY_CHECKLIST_TEMPLATES,
  ...YEARLY_CHECKLIST_TEMPLATES,
];

// ============================================
// TEMPLATE COUNTS
// ============================================

export const CHECKLIST_TEMPLATE_COUNTS = {
  daily: DAILY_CHECKLIST_TEMPLATES.length,
  weekly: WEEKLY_CHECKLIST_TEMPLATES.length,
  monthly: MONTHLY_CHECKLIST_TEMPLATES.length,
  yearly: YEARLY_CHECKLIST_TEMPLATES.length,
  total: ALL_CHECKLIST_TEMPLATES.length,
};
