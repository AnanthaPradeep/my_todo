import React from 'react';
import type { Task } from '../../types/task';
import { dateUtils } from '../../utils/dateUtils';
import { getCategoryClass } from '../../utils/categoryColors';
import { Icons } from '../../utils/icons';
import { MiniCalendar } from './MiniCalendar';

interface RightPanelProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

/**
 * Right Sidebar Panel
 * Shows:
 * - Mini calendar navigator
 * - Upcoming tasks (next 14 days)
 * - Category indicators
 */
export const RightPanel: React.FC<RightPanelProps> = ({
  currentDate,
  tasks,
  onTaskClick,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const todayStr = dateUtils.getToday();

  return (
    <div className="calendar-sidebar">
      {/* Mini Month Navigator */}
      <div className="calendar-sidebar-section">
        <div className="calendar-sidebar-title">
          <Icons.Calendar size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
          {new Date(year, month).toLocaleDateString('en-US', { month: 'long' })} {year}
        </div>
        <MiniCalendar currentDate={currentDate} tasks={tasks} />
      </div>

      {/* Category Legend */}
      <div className="calendar-sidebar-section">
        <div className="calendar-sidebar-title">
          <Icons.Target size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
          Categories
        </div>
        <div className="calendar-category-list">
          {(['work', 'health', 'learning', 'finance', 'relationships', 'personal-growth'] as const).map((category) => {
            const colorMap: Record<typeof category, string> = {
              work: '#0ea5e9',
              health: '#22c55e',
              learning: '#a855f7',
              finance: '#f59e0b',
              relationships: '#06b6d4',
              'personal-growth': '#ec4899',
            };

            const labelMap: Record<typeof category, string> = {
              work: 'Work',
              health: 'Health',
              learning: 'Learning',
              finance: 'Finance',
              relationships: 'Relationships',
              'personal-growth': 'Personal Growth',
            };

            return (
              <div key={category} className="calendar-category-item">
                <div className="calendar-category-dot" style={{ backgroundColor: colorMap[category] }} />
                <span>{labelMap[category]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="calendar-sidebar-section" style={{ flex: 1 }}>
        <div className="calendar-sidebar-title">
          <Icons.Tasks size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
          Upcoming
        </div>
        <div className="calendar-upcoming-events">
          {tasks.length > 0 ? (
            tasks
              .filter((t) => !t.completed)
              .slice(0, 5)
              .map((task) => {
                return (
                  <div
                    key={task.id}
                    className={`calendar-upcoming-event ${getCategoryClass(task.category)}`}
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="calendar-upcoming-event-title">
                      {task.completed && <Icons.Check size={14} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'text-bottom' }} />}
                      {task.title}
                    </div>
                    <div className="calendar-upcoming-event-date">
                      {task.date ? (
                        <>
                          {task.date === todayStr
                            ? 'Today'
                            : task.date === dateUtils.formatDateISO(new Date(today.getTime() + 24 * 60 * 60 * 1000))
                            ? 'Tomorrow'
                            : dateUtils.parseDateLocal(task.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                          {task.startTime && (
                            <>
                              <Icons.Dot size={8} style={{ margin: '0 4px', verticalAlign: 'middle' }} />
                              {task.startTime}
                            </>
                          )}
                        </>
                      ) : (
                        'No due date'
                      )}
                    </div>
                  </div>
                );
              })
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
              No upcoming tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
