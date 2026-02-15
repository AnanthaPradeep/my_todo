import React from 'react';
import type { Task } from '../../types/task';
import { dateUtils } from '../../utils/dateUtils';
import { getCategoryClass } from '../../utils/categoryColors';
import { Icons } from '../../utils/icons';

interface DayDetailPanelProps {
  selectedDate: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

const formatDateLabel = (dateStr: string): string => {
  const date = dateUtils.parseDateLocal(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const formatTimeRange = (task: Task): string => {
  if (task.startTime && task.endTime) {
    return `${task.startTime} - ${task.endTime}`;
  }
  if (task.startTime) {
    return task.startTime;
  }
  return 'All day';
};

export const DayDetailPanel: React.FC<DayDetailPanelProps> = ({
  selectedDate,
  tasks,
  onAddTask,
  onTaskClick,
}) => {
  return (
    <div className="calendar-day-detail">
      <div className="calendar-day-detail-header">
        <div>
          <div className="calendar-day-detail-title">{formatDateLabel(selectedDate)}</div>
          <div className="calendar-day-detail-subtitle">{tasks.length} task{tasks.length === 1 ? '' : 's'}</div>
        </div>
        <button
          type="button"
          className="calendar-day-detail-add"
          onClick={onAddTask}
        >
          <Icons.Plus size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />
          Add New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="calendar-day-detail-empty">No tasks for this day.</div>
      ) : (
        <div className="calendar-day-detail-list">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              className={`calendar-day-detail-item ${getCategoryClass(task.category)}`}
              onClick={() => onTaskClick(task)}
            >
              <div className="calendar-day-detail-item-main">
                <div className="calendar-day-detail-item-title">
                  {task.completed && <Icons.Check size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />}
                  {task.title}
                </div>
                <div className="calendar-day-detail-item-meta">
                  <span className="calendar-day-detail-time">{formatTimeRange(task)}</span>
                  <span className={`calendar-day-detail-category ${getCategoryClass(task.category)}`}>
                    {task.category.replace('-', ' ')}
                  </span>
                  <span className={`calendar-day-detail-priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
