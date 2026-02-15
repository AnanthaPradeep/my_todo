/**
 * Calendar Service
 * 
 * Converts tasks to calendar display format
 * Single source of truth: Tasks from useTaskStore
 * No separate calendar event storage
 */

import type { Task } from '../types/task';
import { dateUtils } from '../utils/dateUtils';

/**
 * Task-to-Calendar adapter
 * Shows tasks as calendar events
 */
export interface CalendarTaskDisplay extends Task {
  // Visual metadata (computed from task properties)
  displayColor: string; // Category-based color
  isOverdue: boolean;
  isUpcoming: boolean;
  timeDisplay: string; // Formatted time or "All day"
}

/**
 * Group tasks by date for calendar grid rendering
 * Used by: Month view, Week view, Agenda view
 */
export const groupTasksByDate = (tasks: Task[]): Map<string, Task[]> => {
  const grouped = new Map<string, Task[]>();

  tasks.forEach((task) => {
    if (!task.date) return; // Skip tasks without due dates

    if (!grouped.has(task.date)) {
      grouped.set(task.date, []);
    }
    grouped.get(task.date)?.push(task);
  });

  return grouped;
};

/**
 * Get category color for calendar display
 */
const getCategoryColor = (category: Task['category']): string => {
  const colorMap: Record<Task['category'], string> = {
    work: '#0ea5e9',           // Sky blue
    health: '#22c55e',         // Green
    learning: '#a855f7',       // Purple
    finance: '#f59e0b',        // Amber
    'personal-growth': '#ec4899', // Pink
    relationships: '#06b6d4',  // Cyan
  };
  return colorMap[category] || '#6b7280'; // Default gray
};

/**
 * Convert task to calendar display format
 */
export const taskToCalendarDisplay = (task: Task): CalendarTaskDisplay => {
  const today = dateUtils.getToday();
  const taskDate = task.date || today;
  const isOverdue = !task.completed && taskDate < today;
  const isUpcoming = taskDate > today && !task.completed;

  // Format time display
  let timeDisplay = 'All day';
  if (task.startTime) {
    const [hours, minutes] = task.startTime.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    timeDisplay = `${displayHour}:${minute} ${ampm}`;
  }

  return {
    ...task,
    displayColor: getCategoryColor(task.category),
    isOverdue,
    isUpcoming,
    timeDisplay,
  };
};

/**
 * Get visual indicator for a date
 * Used by: Calendar grid, month view cells
 */
export const getDateIndicator = (tasks: Task[], date: string) => {
  const tasksOnDate = tasks.filter((t) => t.date === date);
  const incompleteTasks = tasksOnDate.filter((t) => !t.completed);
  const completedTasks = tasksOnDate.filter((t) => t.completed);

  return {
    hasTask: tasksOnDate.length > 0,
    taskCount: tasksOnDate.length,
    completedCount: completedTasks.length,
    incompleteCount: incompleteTasks.length,
    isHighCapacity: incompleteTasks.length > 3,
    showBadge: incompleteTasks.length > 0,
    badgeNumber: incompleteTasks.length,
  };
};

/**
 * Sort tasks for display
 * Priority: Not completed → Completed
 * Within each: By priority → By time
 */
export const sortTasksForDisplay = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority
    const priorityOrder: Record<Task['priority'], number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    const aPriority = priorityOrder[a.priority] ?? 3;
    const bPriority = priorityOrder[b.priority] ?? 3;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Then by time if available
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }

    // Fall back to title
    return a.title.localeCompare(b.title);
  });
};

/**
 * Filter tasks by completion status
 */
export const filterTasksByCompletion = (
  tasks: Task[],
  showCompleted: boolean = true
): Task[] => {
  if (showCompleted) return tasks;
  return tasks.filter((t) => !t.completed);
};

/**
 * Get tasks approaching due date
 * Used by: Upcoming section, alerts
 */
export const getApproachingTasks = (
  tasks: Task[],
  daysAhead: number = 14
): Task[] => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  const todayStr = dateUtils.formatDateISO(today);
  const futureDateStr = dateUtils.formatDateISO(futureDate);

  return tasks.filter((task) => {
    if (!task.date || task.completed) return false;
    return task.date >= todayStr && task.date <= futureDateStr;
  });
};

/**
 * Check if tasks on a date have any high-priority items
 */
export const hasHighPriorityTasks = (tasks: Task[], date: string): boolean => {
  return tasks
    .filter((t) => t.date === date && !t.completed)
    .some((t) => t.priority === 'critical' || t.priority === 'high');
};

/**
 * Get task count by date for heatmap visualization
 */
export const getTaskCountMap = (tasks: Task[]): Map<string, number> => {
  const countMap = new Map<string, number>();

  tasks.forEach((task) => {
    if (!task.date) return;
    countMap.set(task.date, (countMap.get(task.date) || 0) + 1);
  });

  return countMap;
};

/**
 * Format date for display in various formats
 */
export const formatDateForDisplay = (dateStr: string): string => {
  const date = dateUtils.parseDateLocal(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
