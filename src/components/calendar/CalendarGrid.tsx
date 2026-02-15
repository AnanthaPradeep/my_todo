import React from 'react';
import type { Task } from '../../types/task';
import { sortTasksForDisplay, hasHighPriorityTasks } from '../../services/calendarService';
import { dateUtils } from '../../utils/dateUtils';
import { getCategoryClass } from '../../utils/categoryColors';
import { Icons } from '../../utils/icons';

interface CalendarGridProps {
  currentView: 'month' | 'week' | 'day' | 'agenda';
  currentDate: Date;
  tasks: Task[];
  tasksGroupedByDate: Map<string, Task[]>;
  checklistCompletionMap?: Map<string, number>;
  onDateClick: (date: string) => void;
  onMoreClick: (date: string) => void;
  onTaskClick: (task: Task) => void;
  selectedDate: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentView,
  currentDate,
  tasks,
  tasksGroupedByDate,
  checklistCompletionMap,
  onDateClick,
  onMoreClick,
  onTaskClick,
  selectedDate,
}) => {
  if (currentView === 'month') {
    return (
      <MonthView
        currentDate={currentDate}
        tasksGroupedByDate={tasksGroupedByDate}
        checklistCompletionMap={checklistCompletionMap}
        onDateClick={onDateClick}
        onTaskClick={onTaskClick}
        onMoreClick={onMoreClick}
        selectedDate={selectedDate}
        tasks={tasks}
      />
    );
  }

  if (currentView === 'week') {
    return (
      <WeekView
        currentDate={currentDate}
        tasksGroupedByDate={tasksGroupedByDate}
        onTaskClick={onTaskClick}
        onDateClick={onDateClick}
      />
    );
  }

  if (currentView === 'agenda') {
    return <AgendaView tasks={tasks} onTaskClick={onTaskClick} />;
  }

  return (
    <DayView
      currentDate={currentDate}
      tasksGroupedByDate={tasksGroupedByDate}
      onTaskClick={onTaskClick}
    />
  );
};

interface ViewProps {
  currentDate?: Date;
  tasks?: Task[];
  tasksGroupedByDate?: Map<string, Task[]>;
  checklistCompletionMap?: Map<string, number>;
  onDateClick?: (date: string) => void;
  onMoreClick?: (date: string) => void;
  onTaskClick: (task: Task) => void;
  selectedDate?: string;
}

const MonthView: React.FC<ViewProps> = ({
  currentDate,
  tasksGroupedByDate,
  checklistCompletionMap,
  onDateClick,
  onTaskClick,
  onMoreClick,
  selectedDate,
  tasks = [],
}) => {
  if (!currentDate || !tasksGroupedByDate) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: (number | null)[] = [];

  // Previous month dates
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(-(i + 1));
  }

  // Current month dates
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Next month dates
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(-1000 - i);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-grid-wrapper">
      <div className="calendar-month-grid">
        {/* Weekday headers */}
        {weekdays.map((day) => (
          <div key={day} className="calendar-weekday-header">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((dayNum, idx) => {
          const isOtherMonth = dayNum === null || dayNum < 1;
          let dateStr = '';
          let displayNum = 0;

          if (dayNum && dayNum > 0) {
            dateStr = dateUtils.formatDateISO(new Date(year, month, dayNum));
            displayNum = dayNum;
          } else if (dayNum && dayNum < -1000) {
            const nextMonthDay = -dayNum - 1000;
            dateStr = dateUtils.formatDateISO(new Date(year, month + 1, nextMonthDay));
            displayNum = nextMonthDay;
          } else if (dayNum && dayNum < 0) {
            const prevMonthDay = daysInPrevMonth + dayNum + 1;
            dateStr = dateUtils.formatDateISO(new Date(year, month - 1, prevMonthDay));
            displayNum = prevMonthDay;
          }

          const todayStr = dateUtils.getToday();
          const dayTasks = tasksGroupedByDate.get(dateStr) || [];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const capacity = dayTasks.length > 5 ? 'high' : 'normal';
          const hasTasks = dayTasks.length > 0;
          const isHighPriority = dateStr ? hasHighPriorityTasks(tasks, dateStr) : false;
          const uniqueCategories = Array.from(new Set(dayTasks.map((task) => task.category)));
          
          // Get checklist completion for this date
          const checklistCompletion = checklistCompletionMap?.get(dateStr) || 0;
          const hasFullChecklist = checklistCompletion === 100;

          return (
            <div
              key={idx}
              className={`calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTasks ? 'has-tasks' : ''}`}
              onClick={() => onDateClick?.(dateStr)}
            >
              {isHighPriority && <div className="calendar-day-priority" />}
              
              {/* Checklist completion badge */}
              {hasFullChecklist && !isOtherMonth && (
                <div className="calendar-day-checklist-badge" title="Daily checklist completed">
                  <Icons.Check size={12} />
                </div>
              )}
              
              <div className="calendar-day-header">
                <span
                  className={`calendar-day-number ${isToday ? 'today' : ''}`}
                  style={{ textAlign: 'right' }}
                >
                  {displayNum}
                </span>
                {dayTasks.length > 0 && capacity === 'high' && (
                  <span className={`calendar-day-capacity ${capacity}`}>{dayTasks.length}</span>
                )}
              </div>

              {uniqueCategories.length > 0 && (
                <div className="calendar-day-indicators">
                  {uniqueCategories.slice(0, 4).map((category) => (
                    <span
                      key={category}
                      className={`calendar-day-indicator ${getCategoryClass(category)}`}
                    />
                  ))}
                </div>
              )}

              <div className="calendar-day-events">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`calendar-event-item ${getCategoryClass(task.category)}`}
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.6 : 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                    title={task.title}
                  >
                    {task.completed && <Icons.Check size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'text-bottom' }} />}
                    {task.title}
                  </div>
                ))}

                {dayTasks.length > 2 && (
                  <div
                    className="calendar-more-events"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoreClick?.(dateStr);
                    }}
                  >
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeekView: React.FC<ViewProps> = ({ currentDate, tasksGroupedByDate, onTaskClick, onDateClick }) => {
  if (!currentDate || !tasksGroupedByDate) return null;

  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDates.push(date);
  }

  return (
    <div className="calendar-grid-wrapper">
      <div className="calendar-week-grid">
        {weekDates.map((date) => {
          const dateStr = dateUtils.formatDateISO(date);
          const dayTasks = tasksGroupedByDate.get(dateStr) || [];
          const todayStr = dateUtils.getToday();
          const isToday = dateStr === todayStr;

          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

          return (
            <div key={dateStr} className={`calendar-week-day ${isToday ? 'today' : ''}`}>
              <div
                className="calendar-week-day-header"
                onClick={() => onDateClick?.(dateStr)}
              >
                <div>{dayNames[date.getDay()]}</div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{date.getDate()}</div>
              </div>
              <div className="calendar-week-day-content">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`calendar-event-item ${getCategoryClass(task.category)}`}
                    style={{
                      cursor: 'pointer',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.6 : 1,
                    }}
                    onClick={() => onTaskClick(task)}
                    title={task.title}
                  >
                  <div>
                    {task.completed && <Icons.Check size={12} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                    {task.title}
                  </div>
                  {task.startTime && <div style={{ fontSize: '10px' }}>{task.startTime}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayView: React.FC<ViewProps> = ({ currentDate, tasksGroupedByDate, onTaskClick }) => {
  if (!currentDate || !tasksGroupedByDate) return null;

  const dateStr = dateUtils.formatDateISO(currentDate);
  const dayTasks = tasksGroupedByDate.get(dateStr) || [];
  const sortedTasks = sortTasksForDisplay(dayTasks);

  return (
    <div className="calendar-grid-wrapper">
      <div style={{ padding: 'var(--space-lg)' }}>
        <h2 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
          {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className={`calendar-event-item ${getCategoryClass(task.category)}`}
                style={{
                  padding: 'var(--space-md)',
                  cursor: 'pointer',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.6 : 1,
                }}
                onClick={() => onTaskClick(task)}
              >
                <div style={{ fontWeight: '600' }}>
                  {task.completed && <Icons.Check size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                  {task.title}
                </div>
                {task.startTime && <div style={{ fontSize: '12px', marginTop: '4px' }}>{task.startTime}</div>}
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>No tasks scheduled for this date</div>
          )}
        </div>
      </div>
    </div>
  );
};

const AgendaView: React.FC<ViewProps> = ({ tasks = [], onTaskClick }) => {
  const upcomingDays = 30;
  const today = new Date();
  const startDate = dateUtils.getToday();
  const endDate = dateUtils.formatDateISO(
    new Date(today.getTime() + upcomingDays * 24 * 60 * 60 * 1000)
  );

  // Filter tasks within date range
  const filteredTasks = (tasks as Task[])
    .filter((t: Task) => t.date && t.date >= startDate && t.date <= endDate)
    .sort((a: Task, b: Task) => {
      if (!a.date || !b.date) return 0;
      let comparison = a.date.localeCompare(b.date);
      if (comparison !== 0) return comparison;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });

  // Group by date
  const groupedByDate: { [key: string]: Task[] } = {};
  filteredTasks.forEach((task: Task) => {
    if (task.date) {
      if (!groupedByDate[task.date]) {
        groupedByDate[task.date] = [];
      }
      groupedByDate[task.date].push(task);
    }
  });

  return (
    <div className="calendar-agenda">
      {Object.entries(groupedByDate).map(([date, dateTasks]) => {
        const dateObj = dateUtils.parseDateLocal(date);
        const todayStr = dateUtils.getToday();
        const isToday = date === todayStr;

        return (
          <div key={date} className="calendar-agenda-date-group">
            <div className={`calendar-agenda-date-header ${isToday ? 'today' : ''}`}>
              {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              <span className="calendar-agenda-date-badge">{dateTasks.length}</span>
            </div>
            <div className="calendar-agenda-events">
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`calendar-agenda-event ${getCategoryClass(task.category)}`}
                  onClick={() => onTaskClick(task)}
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  <div className="calendar-agenda-event-title">
                    {task.completed && <Icons.Check size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                    {task.title}
                  </div>
                  <div className="calendar-agenda-event-meta">
                    {task.startTime && (
                      <div className="calendar-agenda-event-time">
                        <Icons.Circle size={12} style={{ marginRight: '4px' }} />
                        <span>{task.startTime}</span>
                      </div>
                    )}
                    <div className={`calendar-agenda-event-category ${getCategoryClass(task.category)}`}>
                      ● {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </div>
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {task.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedByDate).length === 0 && (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No tasks scheduled in the next {upcomingDays} days
        </div>
      )}
    </div>
  );
};
