import React, { useEffect, useMemo, useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useChecklistStore } from '../../store/checklistStore';
import type { Task } from '../../types/task';
import type { CalendarView } from '../../utils/calendarUtils';
import { dateUtils } from '../../utils/dateUtils';
import { groupTasksByDate } from '../../services/calendarService';
import { CalendarToolbar } from './CalendarToolbar';
import { CalendarGrid } from './CalendarGrid';
import { RightPanel } from './RightPanel';
import { DayDetailPanel } from './DayDetailPanel';
import { DayView } from './DayView';
import { useCalendarStore } from '../../store/useCalendarStore';

/**
 * CalendarPage - Synchronized with Tasks
 * 
 * Single Source of Truth: useTaskStore
 * Tasks automatically sync between Tasks Page and Calendar Page
 * No separate calendar event storage
 */
export const CalendarPage: React.FC = () => {
  // Subscribe to task store - calendar updates when tasks change
  const { tasks } = useTaskStore();
  const { getDailyCompletionHistory } = useChecklistStore();

  const {
    currentDate,
    currentView,
    selectedDate,
    setCurrentDate,
    setCurrentView,
    setSelectedDate,
  } = useCalendarStore();
  const [sidebarVisible] = useState(true);

  // Get checklist completion history
  const checklistCompletionMap = getDailyCompletionHistory();

  // Memoized task grouping by date
  // Only recomputes when tasks array changes
  const tasksGroupedByDate = useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N for new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const dateStr = selectedDate || dateUtils.getToday();
        setSelectedDate(dateStr);
        // Trigger task creation modal in parent (Dashboard)
        const event = new CustomEvent('openTaskForm', { detail: { date: dateStr } });
        window.dispatchEvent(event);
      }

      // T for today
      if (e.key === 't' || e.key === 'T') {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(dateUtils.formatDateISO(today));
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowLeft') {
        handlePrevMonth();
      }
      if (e.key === 'ArrowRight') {
        handleNextMonth();
      }

      // V for view cycling
      if (e.key === 'v' || e.key === 'V') {
        const viewOrder: CalendarView[] = ['month', 'week', 'day', 'agenda'];
        const currentIndex = viewOrder.indexOf(currentView);
        const nextIndex = (currentIndex + 1) % viewOrder.length;
        setCurrentView(viewOrder[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate, currentView, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(dateUtils.formatDateISO(today));
  };

  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
  };

  const getDefaultStartTime = (dateStr: string): string | undefined => {
    if (dateStr !== dateUtils.getToday()) return undefined;
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:00`;
  };

  const openAddTaskModal = (dateStr: string) => {
    const event = new CustomEvent('openTaskForm', {
      detail: {
        date: dateStr,
        startTime: getDefaultStartTime(dateStr),
      },
    });
    window.dispatchEvent(event);
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCurrentDate(dateUtils.parseDateLocal(dateStr));
    setCurrentView('day');
  };

  const handleMoreClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCurrentDate(dateUtils.parseDateLocal(dateStr));
    setCurrentView('day');
  };

  const handleTaskClick = (task: Task) => {
    // Trigger task details view in parent (Dashboard)
    const event = new CustomEvent('viewTaskDetails', { detail: task });
    window.dispatchEvent(event);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-main">
        {/* Header with toolbar */}
        <div className="calendar-header">
          <CalendarToolbar
            currentView={currentView}
            onViewChange={handleViewChange}
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
        </div>

        {/* Content area */}
        <div className="calendar-content">
          {currentView === 'day' ? (
            <DayView
              selectedDate={selectedDate}
              tasks={tasks}
              onAddTask={() => openAddTaskModal(selectedDate)}
              onTaskClick={handleTaskClick}
            />
          ) : (
            <>
              <div className="calendar-grid-container">
                <CalendarGrid
                  currentView={currentView}
                  currentDate={currentDate}
                  tasks={tasks}
                  tasksGroupedByDate={tasksGroupedByDate}
                  checklistCompletionMap={checklistCompletionMap}
                  onDateClick={handleDateClick}
                  onMoreClick={handleMoreClick}
                  onTaskClick={handleTaskClick}
                  selectedDate={selectedDate}
                />
                <DayDetailPanel
                  selectedDate={selectedDate}
                  tasks={tasks.filter((task) => task.date === selectedDate)}
                  onAddTask={() => openAddTaskModal(selectedDate)}
                  onTaskClick={handleTaskClick}
                />
              </div>

              {/* Right sidebar - hidden on mobile */}
              {sidebarVisible && (
                <RightPanel
                  currentDate={currentDate}
                  tasks={tasks}
                  onTaskClick={handleTaskClick}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

