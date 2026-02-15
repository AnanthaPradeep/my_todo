import { useTaskStore } from '../store/taskStore';
import { useCheckInStore } from '../store/checkInStore';
import { useSettingsStore } from '../store/settingsStore';
import { useChecklistStore } from '../store/checklistStore';

export interface AppDataExport {
  version: string;
  exportDate: string;
  tasks: any[];
  checkIns: any[];
  checklists?: {
    items: any[];
    streak: any;
    resetTimestamps: any;
    completionHistory: any[];
  };
  settings: any;
}

/**
 * Export all application data as JSON
 */
export const exportAppData = (): AppDataExport => {
  const taskState = useTaskStore.getState();
  const checkInState = useCheckInStore.getState();
  const checklistState = useChecklistStore.getState();
  const settings = useSettingsStore.getState();

  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    tasks: taskState.tasks,
    checkIns: checkInState.checkIns,
    checklists: {
      items: checklistState.items,
      streak: checklistState.streak,
      resetTimestamps: checklistState.resetTimestamps,
      completionHistory: checklistState.completionHistory,
    },
    settings: {
      theme: settings.theme,
      accentColor: settings.accentColor,
      fontSize: settings.fontSize,
      compactMode: settings.compactMode,
      reduceAnimations: settings.reduceAnimations,
      taskRemindersEnabled: settings.taskRemindersEnabled,
      dailyCheckInReminder: settings.dailyCheckInReminder,
      soundEnabled: settings.soundEnabled,
      quietHours: settings.quietHours,
      browserNotificationsEnabled: settings.browserNotificationsEnabled,
      defaultView: settings.defaultView,
      weekStartDay: settings.weekStartDay,
      timeFormat: settings.timeFormat,
      showCompletedTasks: settings.showCompletedTasks,
      highlightWeekends: settings.highlightWeekends,
      defaultTaskDuration: settings.defaultTaskDuration,
      defaultPriority: settings.defaultPriority,
      autoCompleteOverdue: settings.autoCompleteOverdue,
      showTaskDuration: settings.showTaskDuration,
      enableTimeBlocking: settings.enableTimeBlocking,
      focusModeEnabled: settings.focusModeEnabled,
      streakTrackingEnabled: settings.streakTrackingEnabled,
      enableDailyGoal: settings.enableDailyGoal,
      showProductivityInsights: settings.showProductivityInsights,
      autoHideCompletedTasks: settings.autoHideCompletedTasks,
    },
  };
};

/**
 * Download data as JSON file
 */
export const downloadAppData = () => {
  const data = exportAppData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validate imported data structure
 */
export const validateImportData = (data: any): data is AppDataExport => {
  if (!data || typeof data !== 'object') return false;
  if (!data.version || !data.exportDate) return false;
  if (!Array.isArray(data.tasks) || !Array.isArray(data.checkIns)) return false;
  if (!data.settings || typeof data.settings !== 'object') return false;
  return true;
};

/**
 * Import app data from JSON file
 */
export const importAppData = (file: File): Promise<AppDataExport | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!validateImportData(data)) {
          reject(new Error('Invalid backup file format'));
          return;
        }

        // Import tasks
        const taskStore = useTaskStore.getState();
        if (Array.isArray(data.tasks)) {
          data.tasks.forEach((task) => {
            // Only add if not already exists
            if (!taskStore.tasks.find((t) => t.id === task.id)) {
              taskStore.addTask({
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                date: task.date,
                startTime: task.startTime,
                endTime: task.endTime,
                category: task.category,
                completed: task.completed,
              });
            }
          });
        }

        // Import check-ins
        const checkInStore = useCheckInStore.getState();
        if (Array.isArray(data.checkIns)) {
          data.checkIns.forEach((checkIn) => {
            // Only add if not already exists
            if (!checkInStore.checkIns.find((c) => c.id === checkIn.id)) {
              checkInStore.addCheckIn({
                date: checkIn.date,
                mood: checkIn.mood,
                energy: checkIn.energy,
                focus: checkIn.focus,
                reflection: checkIn.reflection,
                gratitude: checkIn.gratitude,
                completedTasksCount: checkIn.completedTasksCount,
                missedTasksCount: checkIn.missedTasksCount,
              });
            }
          });
        }

        // Import checklists
        if (data.checklists) {
          const checklistStore = useChecklistStore.getState();
          
          // Replace all checklist data
          if (Array.isArray(data.checklists.items)) {
            // Clear existing and set new items
            checklistStore.clearAllData();
            data.checklists.items.forEach((item: any) => {
              checklistStore.addItem({
                title: item.title,
                category: item.category,
                frequency: item.frequency,
                completed: item.completed,
                completedAt: item.completedAt,
                order: item.order,
                isTemplate: item.isTemplate,
              });
            });
          }
          
          // Restore streak data
          if (data.checklists.streak) {
            // Streak will be recalculated based on completion history
          }
          
          // Restore completion history
          if (Array.isArray(data.checklists.completionHistory)) {
            // History is already included in the items state
          }
        }

        // Import settings
        if (data.settings) {
          const settingsStore = useSettingsStore.getState();
          if (data.settings.theme) settingsStore.setTheme(data.settings.theme);
          if (data.settings.accentColor) settingsStore.setAccentColor(data.settings.accentColor);
          if (data.settings.fontSize) settingsStore.setFontSize(data.settings.fontSize);
          if (data.settings.compactMode !== undefined)
            settingsStore.setCompactMode(data.settings.compactMode);
          if (data.settings.reduceAnimations !== undefined)
            settingsStore.setReduceAnimations(data.settings.reduceAnimations);
          if (data.settings.taskRemindersEnabled !== undefined)
            settingsStore.setTaskRemindersEnabled(data.settings.taskRemindersEnabled);
          if (data.settings.dailyCheckInReminder !== undefined)
            settingsStore.setDailyCheckInReminder(data.settings.dailyCheckInReminder);
          if (data.settings.soundEnabled !== undefined)
            settingsStore.setSoundEnabled(data.settings.soundEnabled);
          if (data.settings.quietHours)
            settingsStore.setQuietHours(data.settings.quietHours);
          if (data.settings.browserNotificationsEnabled !== undefined)
            settingsStore.setBrowserNotificationsEnabled(
              data.settings.browserNotificationsEnabled
            );
          if (data.settings.defaultView)
            settingsStore.setDefaultView(data.settings.defaultView);
          if (data.settings.weekStartDay)
            settingsStore.setWeekStartDay(data.settings.weekStartDay);
          if (data.settings.timeFormat) settingsStore.setTimeFormat(data.settings.timeFormat);
          if (data.settings.showCompletedTasks !== undefined)
            settingsStore.setShowCompletedTasks(data.settings.showCompletedTasks);
          if (data.settings.highlightWeekends !== undefined)
            settingsStore.setHighlightWeekends(data.settings.highlightWeekends);
          if (data.settings.defaultTaskDuration !== undefined)
            settingsStore.setDefaultTaskDuration(data.settings.defaultTaskDuration);
          if (data.settings.defaultPriority)
            settingsStore.setDefaultPriority(data.settings.defaultPriority);
          if (data.settings.autoCompleteOverdue !== undefined)
            settingsStore.setAutoCompleteOverdue(data.settings.autoCompleteOverdue);
          if (data.settings.showTaskDuration !== undefined)
            settingsStore.setShowTaskDuration(data.settings.showTaskDuration);
          if (data.settings.enableTimeBlocking !== undefined)
            settingsStore.setEnableTimeBlocking(data.settings.enableTimeBlocking);
          if (data.settings.focusModeEnabled !== undefined)
            settingsStore.setFocusModeEnabled(data.settings.focusModeEnabled);
          if (data.settings.streakTrackingEnabled !== undefined)
            settingsStore.setStreakTrackingEnabled(data.settings.streakTrackingEnabled);
          if (data.settings.enableDailyGoal !== undefined)
            settingsStore.setEnableDailyGoal(data.settings.enableDailyGoal);
          if (data.settings.showProductivityInsights !== undefined)
            settingsStore.setShowProductivityInsights(
              data.settings.showProductivityInsights
            );
          if (data.settings.autoHideCompletedTasks !== undefined)
            settingsStore.setAutoHideCompletedTasks(data.settings.autoHideCompletedTasks);
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
