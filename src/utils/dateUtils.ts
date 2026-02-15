import { format, parse, isSameDay, startOfDay, endOfDay, isToday } from 'date-fns';

export const dateUtils = {
  /**
   * Format date as YYYY-MM-DD
   */
  formatDateISO: (date: Date | string): string => {
    if (typeof date === 'string') {
      return date;
    }
    return format(date, 'yyyy-MM-dd');
  },

  /**
   * Format date as readable string (e.g., "Feb 14, 2026")
   */
  formatDateReadable: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    return format(dateObj, 'MMM dd, yyyy');
  },

  /**
   * Format time as HH:MM
   */
  formatTime: (time: string | Date): string => {
    if (typeof time === 'string') {
      return time;
    }
    return format(time, 'HH:mm');
  },

  /**
   * Get today's date as ISO string
   */
  getToday: (): string => {
    return format(new Date(), 'yyyy-MM-dd');
  },

  /**
   * Check if date is today
   */
  isToday: (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    return isToday(dateObj);
  },

  /**
   * Check if two dates are the same day
   */
  isSameDay: (date1: string | Date, date2: string | Date): boolean => {
    const d1 = typeof date1 === 'string' ? parse(date1, 'yyyy-MM-dd', new Date()) : date1;
    const d2 = typeof date2 === 'string' ? parse(date2, 'yyyy-MM-dd', new Date()) : date2;
    return isSameDay(d1, d2);
  },

  /**
   * Get start of day
   */
  getStartOfDay: (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    return startOfDay(dateObj);
  },

  /**
   * Get end of day
   */
  getEndOfDay: (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    return endOfDay(dateObj);
  },

  /**
   * Parse ISO date string
   */
  parseDate: (dateString: string): Date => {
    return parse(dateString, 'yyyy-MM-dd', new Date());
  },

  /**
   * Parse YYYY-MM-DD as local Date (no UTC conversion)
   */
  parseDateLocal: (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  },

  /**
   * Get date in days from today (negative for past, positive for future)
   */
  getDaysFromToday: (date: string): number => {
    const today = new Date();
    const targetDate = parse(date, 'yyyy-MM-dd', new Date());
    return Math.floor(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  },
};
