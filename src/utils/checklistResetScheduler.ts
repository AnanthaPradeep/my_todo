/**
 * Checklist Reset Scheduler
 * Automatically resets checklists based on frequency at appropriate times
 * - Daily: Midnight (00:00)
 * - Weekly: Sunday 00:00
 * - Monthly: 1st of month 00:00
 * - Yearly: January 1st 00:00
 */

import { isSameDay, isAfter, startOfDay, getDay, getDate, getMonth } from 'date-fns';
import type { useChecklistStore } from '../store/checklistStore';

type ChecklistStore = ReturnType<typeof useChecklistStore.getState>;

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Initialize the reset scheduler
 * Checks immediately on mount, then periodically
 */
export const initChecklistResetScheduler = (store: ChecklistStore): void => {
  // Immediate check on initialization
  checkAndResetChecklists(store);

  // Clear any existing interval
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  // Check every hour for date changes
  schedulerInterval = setInterval(() => {
    checkAndResetChecklists(store);
  }, 60 * 60 * 1000); // 1 hour
};

/**
 * Stop the reset scheduler
 */
export const stopChecklistResetScheduler = (): void => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
};

/**
 * Check all reset conditions and trigger appropriate resets
 */
export const checkAndResetChecklists = (store: ChecklistStore): void => {
  const now = new Date();
  const { resetTimestamps } = store;

  // Daily reset check
  if (shouldResetDaily(resetTimestamps.lastDailyReset, now)) {
    console.log('[Checklist] Triggering daily reset...');
    store.updateStreak(); // Must run before reset to check yesterday's completion
    store.resetDaily();
    store.recordDailyCompletion(); // Record the reset
  }

  // Weekly reset check (Sunday)
  if (shouldResetWeekly(resetTimestamps.lastWeeklyReset, now)) {
    console.log('[Checklist] Triggering weekly reset...');
    store.resetWeekly();
  }

  // Monthly reset check (1st of month)
  if (shouldResetMonthly(resetTimestamps.lastMonthlyReset, now)) {
    console.log('[Checklist] Triggering monthly reset...');
    store.resetMonthly();
  }

  // Yearly reset check (January 1st)
  if (shouldResetYearly(resetTimestamps.lastYearlyReset, now)) {
    console.log('[Checklist] Triggering yearly reset...');
    store.resetYearly();
  }
};

/**
 * Check if daily reset is needed
 * Reset daily items if date has changed
 */
export const shouldResetDaily = (lastResetISO: string, now: Date): boolean => {
  if (!lastResetISO) return true;

  const lastReset = new Date(lastResetISO);
  const today = startOfDay(now);
  const lastResetDay = startOfDay(lastReset);

  // Reset if we're on a different day
  return !isSameDay(today, lastResetDay) && isAfter(today, lastResetDay);
};

/**
 * Check if weekly reset is needed
 * Reset weekly items every Sunday at 00:00
 */
export const shouldResetWeekly = (lastResetISO: string, now: Date): boolean => {
  if (!lastResetISO) return true;

  const lastReset = new Date(lastResetISO);
  const today = startOfDay(now);
  const lastResetDay = startOfDay(lastReset);

  // Check if we're on Sunday (day 0)
  const isSunday = getDay(now) === 0;

  // Reset if:
  // 1. It's Sunday AND
  // 2. Last reset was before today
  return isSunday && !isSameDay(today, lastResetDay) && isAfter(today, lastResetDay);
};

/**
 * Check if monthly reset is needed
 * Reset monthly items on the 1st of each month at 00:00
 */
export const shouldResetMonthly = (lastResetISO: string, now: Date): boolean => {
  if (!lastResetISO) return true;

  const lastReset = new Date(lastResetISO);
  const today = startOfDay(now);
  const lastResetDay = startOfDay(lastReset);

  // Check if we're on the 1st of the month
  const isFirstOfMonth = getDate(now) === 1;

  // Reset if:
  // 1. It's the 1st of the month AND
  // 2. Last reset was before today
  return isFirstOfMonth && !isSameDay(today, lastResetDay) && isAfter(today, lastResetDay);
};

/**
 * Check if yearly reset is needed
 * Reset yearly items on January 1st at 00:00
 */
export const shouldResetYearly = (lastResetISO: string, now: Date): boolean => {
  if (!lastResetISO) return true;

  const lastReset = new Date(lastResetISO);
  const today = startOfDay(now);
  const lastResetDay = startOfDay(lastReset);

  // Check if we're on January 1st
  const isJanuaryFirst = getMonth(now) === 0 && getDate(now) === 1;

  // Reset if:
  // 1. It's January 1st AND
  // 2. Last reset was before today
  return isJanuaryFirst && !isSameDay(today, lastResetDay) && isAfter(today, lastResetDay);
};

/**
 * Manual trigger for testing resets
 * Use only for development/testing
 */
export const manualResetChecklists = (
  store: ChecklistStore,
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
): void => {
  switch (frequency) {
    case 'daily':
      store.updateStreak();
      store.resetDaily();
      break;
    case 'weekly':
      store.resetWeekly();
      break;
    case 'monthly':
      store.resetMonthly();
      break;
    case 'yearly':
      store.resetYearly();
      break;
  }
  console.log(`[Checklist] Manual ${frequency} reset triggered`);
};
