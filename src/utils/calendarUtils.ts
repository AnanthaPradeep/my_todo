import { v4 as uuidv4 } from 'uuid';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  category: 'work' | 'health' | 'learning' | 'finance' | 'personal';
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  isHabit?: boolean;
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// Date utilities
export const dateUtils = {
  today: () => new Date(),
  
  formatDate: (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  parseDate: (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  },

  isSameDay: (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  isToday: (dateString: string): boolean => {
    return dateUtils.isSameDay(dateUtils.parseDate(dateString), dateUtils.today());
  },

  getDayName: (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  },

  getMonthName: (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  },

  getMonthDays: (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  },

  getFirstDayOfMonth: (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  subtractDays: (date: Date, days: number): Date => {
    return dateUtils.addDays(date, -days);
  },

  startOfWeek: (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  },

  getWeekDates: (startDate: Date): Date[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(dateUtils.addDays(startDate, i));
    }
    return dates;
  },

  isBetween: (date: string, start: string, end: string): boolean => {
    return date >= start && date <= end;
  },
};

// Event utilities with LocalStorage
const STORAGE_KEY = 'lifeos_calendar_events';

export const eventUtils = {
  getAll: (): CalendarEvent[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save: (events: CalendarEvent[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  create: (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
    };
    const events = eventUtils.getAll();
    events.push(newEvent);
    eventUtils.save(events);
    return newEvent;
  },

  update: (id: string, updates: Partial<CalendarEvent>): CalendarEvent | null => {
    const events = eventUtils.getAll();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates };
    eventUtils.save(events);
    return events[index];
  },

  delete: (id: string): boolean => {
    const events = eventUtils.getAll();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;
    eventUtils.save(filtered);
    return true;
  },

  getByDate: (date: string): CalendarEvent[] => {
    return eventUtils.getAll().filter((e) => e.date === date);
  },

  getByDateRange: (start: string, end: string): CalendarEvent[] => {
    return eventUtils.getAll().filter((e) => dateUtils.isBetween(e.date, start, end));
  },

  getByCategory: (category: string): CalendarEvent[] => {
    return eventUtils.getAll().filter((e) => e.category === category);
  },

  getEventsForMonth: (year: number, month: number): CalendarEvent[] => {
    const firstDay = dateUtils.formatDate(new Date(year, month, 1));
    const lastDay = dateUtils.formatDate(new Date(year, month + 1, 0));
    return eventUtils.getByDateRange(firstDay, lastDay);
  },
};

// Category utilities
export const categoryConfig = {
  work: {
    label: 'Work',
    color: '#0ea5e9',
    bgLight: 'rgba(14, 165, 233, 0.1)',
    darkColor: '#3b82f6',
  },
  health: {
    label: 'Health',
    color: '#22c55e',
    bgLight: 'rgba(34, 197, 94, 0.1)',
    darkColor: '#10b981',
  },
  learning: {
    label: 'Learning',
    color: '#a855f7',
    bgLight: 'rgba(168, 85, 247, 0.1)',
    darkColor: '#8b5cf6',
  },
  finance: {
    label: 'Finance',
    color: '#f59e0b',
    bgLight: 'rgba(245, 158, 11, 0.1)',
    darkColor: '#f97316',
  },
  personal: {
    label: 'Personal',
    color: '#06b6d4',
    bgLight: 'rgba(6, 182, 212, 0.1)',
    darkColor: '#14b8a6',
  },
};

export const getCategoryColor = (category: string): string => {
  return (categoryConfig as any)[category]?.color || '#0ea5e9';
};

export const getCategoryLabel = (category: string): string => {
  return (categoryConfig as any)[category]?.label || 'Other';
};
