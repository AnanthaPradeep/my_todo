import { create } from 'zustand';
import type { CalendarView } from '../utils/calendarUtils';
import { dateUtils } from '../utils/dateUtils';

interface CalendarStoreState {
  selectedDate: string;
  currentDate: Date;
  currentView: CalendarView;
  setSelectedDate: (date: string) => void;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarView) => void;
}

export const useCalendarStore = create<CalendarStoreState>((set) => ({
  selectedDate: dateUtils.getToday(),
  currentDate: new Date(),
  currentView: 'month',
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setCurrentView: (view) => set({ currentView: view }),
}));
