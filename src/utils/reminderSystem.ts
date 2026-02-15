/**
 * Task Reminder/Notification System
 * Handles browser notifications and reminder scheduling
 * Frontend-only implementation using setTimeout and Notification API
 */

import { calculateReminderDate, msUntilDate } from './timeValidation';
import type { Task } from '../types/task';

// Store active reminder timeouts
const activeReminders = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Request notification permission from user
 * Must be called in response to user gesture (click, etc)
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported by this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied by user');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Check if notifications are enabled and permission given
 */
export const isNotificationEnabled = (): boolean => {
  if (!('Notification' in window)) {
    return false;
  }

  return Notification.permission === 'granted';
};

/**
 * Show browser notification
 * @param title - Notification title
 * @param options - Notification options
 */
export const showNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!isNotificationEnabled()) {
    console.log('Notifications not enabled:', title);
    return null;
  }

  try {
    return new Notification(title, {
      icon: '/logo.png',
      badge: '/logo-small.png',
      ...options,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

/**
 * Register a reminder for a task
 * Schedules a notification to show at task start time
 * @param task - The task to set reminder for
 */
export const registerTaskReminder = (task: Task): void => {
  // Cancel existing reminder for this task
  unregisterTaskReminder(task.id);

  // Only set reminder if enabled
  if (!task.reminder) {
    return;
  }

  try {
    const reminderDate = calculateReminderDate(task.date, task.startTime);

    if (!reminderDate) {
      console.warn(`Could not calculate reminder date for task ${task.id}`);
      return;
    }

    const msUntil = msUntilDate(reminderDate);

    // Don't set reminder if task start time is in the past
    if (msUntil <= 0) {
      console.log(`Task ${task.id} start time is in the past, skipping reminder`);
      return;
    }

    // Schedule the timeout
    const timeoutId = setTimeout(() => {
      showTaskNotification(task);
    }, msUntil);

    // Store the timeout ID for cleanup
    activeReminders.set(task.id, timeoutId);

    console.log(
      `Reminder registered for task "${task.title}" at ${task.date} ${task.startTime} (in ${msUntil}ms)`
    );
  } catch (error) {
    console.error(`Error registering reminder for task ${task.id}:`, error);
  }
};

/**
 * Unregister (cancel) a reminder for a task
 */
export const unregisterTaskReminder = (taskId: string): void => {
  const timeoutId = activeReminders.get(taskId);

  if (timeoutId) {
    clearTimeout(timeoutId);
    activeReminders.delete(taskId);
    console.log(`Reminder cancelled for task ${taskId}`);
  }
};

/**
 * Show notification for a task
 * Called when reminder time reaches
 */
export const showTaskNotification = (task: Task): void => {
  const title = `Task Starting: ${task.title}`;
  const body = `${task.startTime} - ${task.endTime}${task.description ? '\n' + task.description : ''}`;

  showNotification(title, {
    body,
    tag: `task-${task.id}`,
    requireInteraction: true, // Keep notification visible until user dismisses
  });

  // Handle notification clicks
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        tag: `task-${task.id}`,
        requireInteraction: true,
      });
    });
  }
};

/**
 * Re-register all task reminders from store
 * Call this on app startup or after hydration
 * @param tasks - All tasks from store
 */
export const rehydrateReminders = (tasks: Task[]): void => {
  console.log(`Rehydrating reminders for ${tasks.length} tasks...`);

  // Clear existing reminders
  activeReminders.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  activeReminders.clear();

  // Re-register all reminders
  tasks.forEach((task) => {
    if (task.reminder && !task.completed) {
      registerTaskReminder(task);
    }
  });
};

/**
 * Clear all active reminders (for cleanup)
 */
export const clearAllReminders = (): void => {
  activeReminders.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  activeReminders.clear();
  console.log('All reminders cleared');
};

/**
 * Get count of active reminders
 */
export const getActiveRemindersCount = (): number => {
  return activeReminders.size;
};
