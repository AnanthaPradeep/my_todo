import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface SettingsState {
  // Appearance Settings
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  reduceAnimations: boolean;

  // Notifications Settings
  taskRemindersEnabled: boolean;
  dailyCheckInReminder: boolean;
  soundEnabled: boolean;
  quietHours: QuietHours;
  browserNotificationsEnabled: boolean;

  // Calendar Preferences
  defaultView: 'month' | 'week' | 'day' | 'agenda';
  weekStartDay: 'sunday' | 'monday';
  timeFormat: '12h' | '24h';
  showCompletedTasks: boolean;
  highlightWeekends: boolean;

  // Task Preferences
  defaultTaskDuration: number; // in minutes
  defaultPriority: 'low' | 'medium' | 'high';
  autoCompleteOverdue: boolean;
  showTaskDuration: boolean;
  enableTimeBlocking: boolean;

  // Productivity Settings
  focusModeEnabled: boolean;
  streakTrackingEnabled: boolean;
  enableDailyGoal: boolean;
  showProductivityInsights: boolean;
  autoHideCompletedTasks: boolean;

  // Methods
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setCompactMode: (enabled: boolean) => void;
  setReduceAnimations: (enabled: boolean) => void;

  setTaskRemindersEnabled: (enabled: boolean) => void;
  setDailyCheckInReminder: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setQuietHours: (quietHours: QuietHours) => void;
  setBrowserNotificationsEnabled: (enabled: boolean) => void;

  setDefaultView: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  setWeekStartDay: (day: 'sunday' | 'monday') => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setShowCompletedTasks: (show: boolean) => void;
  setHighlightWeekends: (highlight: boolean) => void;

  setDefaultTaskDuration: (duration: number) => void;
  setDefaultPriority: (priority: 'low' | 'medium' | 'high') => void;
  setAutoCompleteOverdue: (enabled: boolean) => void;
  setShowTaskDuration: (show: boolean) => void;
  setEnableTimeBlocking: (enabled: boolean) => void;

  setFocusModeEnabled: (enabled: boolean) => void;
  setStreakTrackingEnabled: (enabled: boolean) => void;
  setEnableDailyGoal: (enabled: boolean) => void;
  setShowProductivityInsights: (show: boolean) => void;
  setAutoHideCompletedTasks: (hide: boolean) => void;

  resetToDefaults: () => void;
}

const defaultSettings = {
  // Appearance
  theme: 'system' as const,
  accentColor: '#3B82F6',
  fontSize: 'medium' as const,
  compactMode: false,
  reduceAnimations: false,

  // Notifications
  taskRemindersEnabled: true,
  dailyCheckInReminder: true,
  soundEnabled: true,
  quietHours: {
    enabled: false,
    start: '21:00',
    end: '08:00',
  } as QuietHours,
  browserNotificationsEnabled: false,

  // Calendar
  defaultView: 'month' as const,
  weekStartDay: 'sunday' as const,
  timeFormat: '12h' as const,
  showCompletedTasks: false,
  highlightWeekends: true,

  // Tasks
  defaultTaskDuration: 30,
  defaultPriority: 'medium' as const,
  autoCompleteOverdue: false,
  showTaskDuration: true,
  enableTimeBlocking: false,

  // Productivity
  focusModeEnabled: false,
  streakTrackingEnabled: true,
  enableDailyGoal: true,
  showProductivityInsights: true,
  autoHideCompletedTasks: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      // Appearance Methods
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontSize: (fontSize) => set({ fontSize }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setReduceAnimations: (reduceAnimations) => set({ reduceAnimations }),

      // Notification Methods
      setTaskRemindersEnabled: (taskRemindersEnabled) => set({ taskRemindersEnabled }),
      setDailyCheckInReminder: (dailyCheckInReminder) => set({ dailyCheckInReminder }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setQuietHours: (quietHours) => set({ quietHours }),
      setBrowserNotificationsEnabled: (browserNotificationsEnabled) =>
        set({ browserNotificationsEnabled }),

      // Calendar Methods
      setDefaultView: (defaultView) => set({ defaultView }),
      setWeekStartDay: (weekStartDay) => set({ weekStartDay }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
      setShowCompletedTasks: (showCompletedTasks) => set({ showCompletedTasks }),
      setHighlightWeekends: (highlightWeekends) => set({ highlightWeekends }),

      // Task Methods
      setDefaultTaskDuration: (defaultTaskDuration) => set({ defaultTaskDuration }),
      setDefaultPriority: (defaultPriority) => set({ defaultPriority }),
      setAutoCompleteOverdue: (autoCompleteOverdue) => set({ autoCompleteOverdue }),
      setShowTaskDuration: (showTaskDuration) => set({ showTaskDuration }),
      setEnableTimeBlocking: (enableTimeBlocking) => set({ enableTimeBlocking }),

      // Productivity Methods
      setFocusModeEnabled: (focusModeEnabled) => set({ focusModeEnabled }),
      setStreakTrackingEnabled: (streakTrackingEnabled) => set({ streakTrackingEnabled }),
      setEnableDailyGoal: (enableDailyGoal) => set({ enableDailyGoal }),
      setShowProductivityInsights: (showProductivityInsights) =>
        set({ showProductivityInsights }),
      setAutoHideCompletedTasks: (autoHideCompletedTasks) =>
        set({ autoHideCompletedTasks }),

      // Reset
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'settings-store',
      version: 1,
    }
  )
);
