import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '../types/task';
import { v4 as uuidv4 } from 'uuid';
import { registerTaskReminder, unregisterTaskReminder, rehydrateReminders } from '../utils/reminderSystem';

interface TaskStore {
  tasks: Task[];

  // ===== CRUD Operations =====
  /**
   * Add new task
   * Automatically generates ID and timestamps
   * Registers reminder if enabled
   */
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task | null;

  /**
   * Update existing task
   * Updates the updatedAt timestamp
   * Re-registers reminder if time or reminder status changed
   */
  updateTask: (id: string, updates: Partial<Task>) => boolean;

  /**
   * Delete task by ID
   * Unregisters reminder if exists
   */
  deleteTask: (id: string) => boolean;

  /**
   * Toggle task completion status
   * Unregisters reminder if task is completed
   */
  toggleTask: (id: string) => boolean;

  /**
   * Clear all completed tasks
   */
  clearCompleted: () => void;

  /**
   * Clear all tasks (destructive)
   */
  clearAllTasks: () => void;

  // ===== Query Methods =====
  /**
   * Get task by ID
   */
  getTaskById: (id: string) => Task | undefined;

  /**
   * Get all tasks for a specific date (YYYY-MM-DD)
   */
  getTasksByDate: (dateStr: string) => Task[];

  /**
   * Get all tasks within a date range (inclusive)
   */
  getTasksByDateRange: (startDate: string, endDate: string) => Task[];

  /**
   * Get all tasks for a specific month
   */
  getTasksByMonth: (year: number, month: number) => Task[];

  /**
   * Get all tasks for a week starting from the given date
   */
  getTasksForWeek: (startDate: Date) => Task[];

  /**
   * Get all tasks for today
   */
  getTodayTasks: () => Task[];

  /**
   * Get tasks by category
   */
  getTasksByCategory: (category: Task['category']) => Task[];

  /**
   * Get tasks by priority
   */
  getTasksByPriority: (priority: Task['priority']) => Task[];

  /**
   * Get all incomplete tasks
   */
  getIncompleteTasks: () => Task[];

  /**
   * Get tasks with reminders enabled
   */
  getTasksWithReminders: () => Task[];

  // ===== Analytics =====
  /**
   * Get count of completed tasks today
   */
  getTodayCompletedCount: () => number;

  /**
   * Get count of total tasks today
   */
  getTodayTotalCount: () => number;

  /**
   * Get count of completed tasks across all
   */
  getCompletedTasksCount: () => number;

  /**
   * Get total task count
   */
  getTotalTasksCount: () => number;

  /**
   * Get count of tasks on a specific date
   */
  getTaskCountByDate: (dateStr: string) => number;

  /**
   * Get all tasks without a due date
   */
  getTasksWithoutDueDate: () => Task[];

  /**
   * Rehydrate reminders (call after initialization)
   */
  rehydrateReminders: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      // ===== CRUD OPERATIONS =====

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add to store
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        // Register reminder if enabled
        if (newTask.reminder) {
          registerTaskReminder(newTask);
        }

        console.log(`Task added: "${newTask.title}" (${newTask.id})`);
        return newTask;
      },

      updateTask: (id, updates) => {
        const existingTask = get().getTaskById(id);

        if (!existingTask) {
          console.warn(`Task ${id} not found`);
          return false;
        }

        const updatedTask: Task = {
          ...existingTask,
          ...updates,
          id: existingTask.id, // Preserve ID
          createdAt: existingTask.createdAt, // Preserve creation date
          updatedAt: new Date().toISOString(), // Update modification date
        };

        // Update in store (immutably)
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        }));

        // Handle reminder re-registration
        const reminderChanged = existingTask.reminder !== updatedTask.reminder;
        const timeChanged =
          existingTask.date !== updatedTask.date ||
          existingTask.startTime !== updatedTask.startTime;

        if (reminderChanged || timeChanged) {
          // Unregister old reminder
          unregisterTaskReminder(id);

          // Register new reminder if enabled
          if (updatedTask.reminder && !updatedTask.completed) {
            registerTaskReminder(updatedTask);
          }
        }

        console.log(`Task updated: "${updatedTask.title}" (${id})`);
        return true;
      },

      deleteTask: (id) => {
        const task = get().getTaskById(id);

        if (!task) {
          console.warn(`Task ${id} not found`);
          return false;
        }

        // Unregister reminder
        unregisterTaskReminder(id);

        // Remove from store
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        console.log(`Task deleted: "${task.title}" (${id})`);
        return true;
      },

      toggleTask: (id) => {
        const task = get().getTaskById(id);

        if (!task) {
          console.warn(`Task ${id} not found`);
          return false;
        }

        const updatedTask = {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString(),
        };

        // Update in store
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        }));

        // Unregister reminder if completing task
        if (updatedTask.completed && task.reminder) {
          unregisterTaskReminder(id);
        }

        // Re-register reminder if uncompleting task
        if (!updatedTask.completed && task.reminder) {
          registerTaskReminder(updatedTask);
        }

        console.log(`Task toggled: "${task.title}" (${id}) -> ${updatedTask.completed}`);
        return true;
      },

      clearCompleted: () => {
        const completedTasks = get().tasks.filter((t) => t.completed);

        // Unregister reminders
        completedTasks.forEach((task) => {
          unregisterTaskReminder(task.id);
        });

        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        }));

        console.log(`Cleared ${completedTasks.length} completed tasks`);
      },

      clearAllTasks: () => {
        const allTasks = get().tasks;

        // Unregister all reminders
        allTasks.forEach((task) => {
          unregisterTaskReminder(task.id);
        });

        set({
          tasks: [],
        });

        console.log(`Cleared all ${allTasks.length} tasks`);
      },

      // ===== QUERY METHODS =====

      getTaskById: (id) => get().tasks.find((task) => task.id === id),

      getTasksByDate: (dateStr) => {
        return get()
          .tasks.filter((task) => task.date === dateStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
      },

      getTasksByDateRange: (startDate, endDate) => {
        return get()
          .tasks.filter((task) => task.date >= startDate && task.date <= endDate)
          .sort((a, b) => {
            if (a.date !== b.date) {
              return a.date.localeCompare(b.date);
            }
            return a.startTime.localeCompare(b.startTime);
          });
      },

      getTasksByMonth: (year, month) => {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
        return get().getTasksByDateRange(firstDay, lastDay);
      },

      getTasksForWeek: (startDate) => {
        const start = startDate.toISOString().split('T')[0];
        const end = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        return get().getTasksByDateRange(start, end);
      },

      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().getTasksByDate(today);
      },

      getTasksByCategory: (category) => {
        return get().tasks.filter((task) => task.category === category);
      },

      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority);
      },

      getIncompleteTasks: () => {
        return get().tasks.filter((task) => !task.completed);
      },

      getTasksWithReminders: () => {
        return get().tasks.filter((task) => task.reminder && !task.completed);
      },

      // ===== ANALYTICS =====

      getTodayCompletedCount: () => {
        const today = new Date().toISOString().split('T')[0];
        return get()
          .tasks.filter((task) => task.date === today && task.completed).length;
      },

      getTodayTotalCount: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter((task) => task.date === today).length;
      },

      getCompletedTasksCount: () => {
        return get().tasks.filter((task) => task.completed).length;
      },

      getTotalTasksCount: () => {
        return get().tasks.length;
      },

      getTaskCountByDate: (dateStr) => {
        return get().getTasksByDate(dateStr).length;
      },

      getTasksWithoutDueDate: () => {
        return get().tasks.filter((task) => !task.date);
      },

      rehydrateReminders: () => {
        console.log('Rehydrating reminders from stored tasks');
        rehydrateReminders(get().tasks);
      },
    }),
    {
      name: 'task-store',
      onRehydrateStorage: () => (state) => {
        // Re-register reminders after hydration from localStorage
        if (state) {
          setTimeout(() => {
            state.rehydrateReminders();
          }, 100);
        }
      },
    }
  )
);
