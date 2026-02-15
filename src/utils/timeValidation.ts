/**
 * Time validation and comparison utilities
 * Handles HH:mm format conversions, comparisons, and duration calculations
 * All times in 24-hour format: HH:mm
 */

/**
 * Convert HH:mm time string to total minutes from midnight
 * @param time - Time in HH:mm format (e.g., "14:30")
 * @returns Total minutes from midnight (e.g., 870)
 * @throws Error if time format is invalid
 */
export const timeToMinutes = (time: string): number => {
  if (!time || typeof time !== 'string') {
    throw new Error('Invalid time: must be a non-empty string');
  }

  const [hours, minutes] = time.split(':').map((x) => parseInt(x, 10));

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: "${time}". Expected HH:mm`);
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time: "${time}". Hours must be 0-23, minutes must be 0-59`);
  }

  return hours * 60 + minutes;
};

/**
 * Convert minutes from midnight back to HH:mm format
 * @param minutes - Total minutes from midnight
 * @returns Time in HH:mm format
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Compare two times
 * @returns -1 if time1 < time2, 0 if equal, 1 if time1 > time2
 */
export const compareTime = (time1: string, time2: string): -1 | 0 | 1 => {
  const min1 = timeToMinutes(time1);
  const min2 = timeToMinutes(time2);

  if (min1 < min2) return -1;
  if (min1 > min2) return 1;
  return 0;
};

/**
 * Check if endTime > startTime
 * @returns true if valid (endTime is after startTime)
 */
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  try {
    return compareTime(startTime, endTime) < 0;
  } catch {
    return false;
  }
};

/**
 * Calculate duration between two times in minutes
 * @returns Duration in minutes. Returns 0 if invalid
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  try {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    return Math.max(0, end - start); // Prevent negative duration
  } catch {
    return 0;
  }
};

/**
 * Format duration (minutes) as human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};

/**
 * Check if two time ranges overlap
 * @param start1 Start time of first range (HH:mm)
 * @param end1 End time of first range (HH:mm)
 * @param start2 Start time of second range (HH:mm)
 * @param end2 End time of second range (HH:mm)
 * @returns true if ranges overlap
 */
export const doTimeRangesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  try {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    // No overlap if one range ends before the other starts
    return !(e1 <= s2 || e2 <= s1);
  } catch {
    return false;
  }
};

/**
 * Validate ISO date format (YYYY-MM-DD)
 * @returns true if valid date
 */
export const isValidDateFormat = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Check if date is today
 */
export const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

/**
 * Check if date is in the past
 */
export const isPastDate = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr < today;
};

/**
 * Calculate reminder time (combine date and startTime)
 * Returns a Date object for the reminder
 * @param date - ISO date format YYYY-MM-DD
 * @param startTime - HH:mm format
 * @returns Date object or null if invalid
 */
export const calculateReminderDate = (date: string, startTime: string): Date | null => {
  try {
    if (!isValidDateFormat(date)) {
      console.error('Invalid date format:', date);
      return null;
    }

    const [hours, minutes] = startTime.split(':').map((x) => parseInt(x, 10));

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time format:', startTime);
      return null;
    }

    const reminderDate = new Date(date);
    reminderDate.setHours(hours, minutes, 0, 0);

    return reminderDate;
  } catch (error) {
    console.error('Error calculating reminder date:', error);
    return null;
  }
};

/**
 * Calculate milliseconds until a given date
 * @returns Milliseconds until date, or 0 if date is in the past or invalid
 */
export const msUntilDate = (date: Date): number => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, diff);
};
