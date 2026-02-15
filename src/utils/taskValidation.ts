/**
 * Task validation logic
 * All validation happens before persistence
 */

import type { Task } from '../types/task';
import {
  isValidDateFormat,
  isValidTimeRange,
  doTimeRangesOverlap,
} from './timeValidation';

export interface ValidationError {
  field: keyof typeof formFields;
  message: string;
}

const formFields = {
  title: 'Title',
  date: 'Date',
  startTime: 'Start Time',
  endTime: 'End Time',
  description: 'Description',
  category: 'Category',
  priority: 'Priority',
  reminder: 'Reminder',
};

/**
 * Validate task form data before saving
 * @returns Array of validation errors (empty if valid)
 */
export const validateTaskForm = (
  formData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!formData.title || !formData.title.trim()) {
    errors.push({
      field: 'title',
      message: 'Task title is required',
    });
  } else if (formData.title.trim().length > 200) {
    errors.push({
      field: 'title',
      message: 'Title must be less than 200 characters',
    });
  }

  // Date validation
  if (!formData.date) {
    errors.push({
      field: 'date',
      message: 'Date is required',
    });
  } else if (!isValidDateFormat(formData.date)) {
    errors.push({
      field: 'date',
      message: 'Invalid date format',
    });
  }

  // Start time validation
  if (!formData.startTime) {
    errors.push({
      field: 'startTime',
      message: 'Start time is required',
    });
  } else if (!isValidTimeFormat(formData.startTime)) {
    errors.push({
      field: 'startTime',
      message: 'Invalid start time format (use HH:mm)',
    });
  }

  // End time validation
  if (!formData.endTime) {
    errors.push({
      field: 'endTime',
      message: 'End time is required',
    });
  } else if (!isValidTimeFormat(formData.endTime)) {
    errors.push({
      field: 'endTime',
      message: 'Invalid end time format (use HH:mm)',
    });
  }

  // Time range validation (must have both start and end time)
  if (formData.startTime && formData.endTime) {
    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
      errors.push({
        field: 'endTime',
        message: 'End time must be after start time',
      });
    }
  }

  // Description validation
  if (formData.description && formData.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'Description must be less than 1000 characters',
    });
  }

  // Category validation
  const validCategories = ['work', 'health', 'finance', 'learning', 'relationships', 'personal-growth'];
  if (!validCategories.includes(formData.category)) {
    errors.push({
      field: 'category',
      message: 'Invalid category selected',
    });
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (!validPriorities.includes(formData.priority)) {
    errors.push({
      field: 'priority',
      message: 'Invalid priority selected',
    });
  }

  return errors;
};

/**
 * Check if time format is valid (HH:mm)
 */
export const isValidTimeFormat = (time: string): boolean => {
  if (!time || typeof time !== 'string') return false;

  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

/**
 * Get user-friendly error message for a specific field
 */
export const getFieldError = (errors: ValidationError[], field: keyof typeof formFields): string | undefined => {
  return errors.find((err) => err.field === field)?.message;
};

/**
 * Check if form is valid (no errors)
 */
export const isFormValid = (errors: ValidationError[]): boolean => {
  return errors.length === 0;
};

/**
 * Check for overlapping tasks on the same date
 * @param existingTasks - All tasks in store
 * @param newTaskDate - Date of task being added/edited
 * @param newTaskStartTime - Start time of new task
 * @param newTaskEndTime - End time of new task
 * @param excludeTaskId - ID of task being edited (to not compare with itself)
 * @returns Array of conflicting task IDs
 */
export const findOverlappingTasks = (
  existingTasks: Task[],
  newTaskDate: string,
  newTaskStartTime: string,
  newTaskEndTime: string,
  excludeTaskId?: string
): string[] => {
  return existingTasks
    .filter((task) => {
      // Skip the task being edited
      if (excludeTaskId && task.id === excludeTaskId) {
        return false;
      }

      // Only check tasks on the same date
      if (task.date !== newTaskDate) {
        return false;
      }

      // Check for time overlap
      try {
        return doTimeRangesOverlap(newTaskStartTime, newTaskEndTime, task.startTime, task.endTime);
      } catch {
        return false;
      }
    })
    .map((task) => task.id);
};
