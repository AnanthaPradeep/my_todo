import type { Task } from '../types/task';

export const CATEGORY_COLOR_MAP: Record<Task['category'], string> = {
  work: '#0ea5e9',
  health: '#22c55e',
  learning: '#a855f7',
  finance: '#f59e0b',
  relationships: '#06b6d4',
  'personal-growth': '#ec4899',
};

export const getCategoryClass = (category: Task['category']): string => {
  return `task-${category}`;
};

export const getCategoryColor = (category: Task['category']): string => {
  return CATEGORY_COLOR_MAP[category];
};

export const getCategoryLabel = (category: Task['category']): string => {
  const labels: Record<Task['category'], string> = {
    work: 'Work',
    health: 'Health',
    learning: 'Learning',
    finance: 'Finance',
    relationships: 'Relationships',
    'personal-growth': 'Personal Growth',
  };
  return labels[category];
};
