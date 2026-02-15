import React from 'react';
import type { Task } from '../../types/task';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../../utils/constants';
import { dateUtils } from '../../utils/dateUtils';
import { Icons, getCategoryIcon } from '../../utils/icons';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const category = TASK_CATEGORIES.find((c) => c.value === task.category);
  const priority = TASK_PRIORITIES.find((p) => p.value === task.priority);
  const CategoryIcon = getCategoryIcon(task.category);

  // Use primary date field with fallback for backward compatibility
  const taskDate = task.date || task.dueDate;

  const isOverdue =
    taskDate &&
    !task.completed &&
    dateUtils.getDaysFromToday(taskDate) < 0;

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-content">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
          aria-label={`Complete ${task.title}`}
        />

        {/* Content */}
        <div className="task-body">
          <h3 className="task-title">{task.title}</h3>

          {/* Description */}
          {task.description && <p className="task-description">{task.description}</p>}

          {/* Meta Info */}
          <div className="task-meta">
            {/* Category */}
            {category && (
              <span className="task-badge category">
                <CategoryIcon size={14} />
                <span>{category.label}</span>
              </span>
            )}

            {/* Priority */}
            {priority && <span className={`task-badge priority-${task.priority}`}>{priority.label}</span>}

            {/* Due Date */}
            {taskDate && (
              <span className={`task-badge due-date ${isOverdue ? 'overdue' : ''}`}>
                {dateUtils.isToday(taskDate) ? 'Today' : dateUtils.formatDateReadable(taskDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="task-action-btn edit"
            title="Edit task"
            aria-label="Edit task"
          >
            <Icons.Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="task-action-btn delete"
            title="Delete task"
            aria-label="Delete task"
          >
            <Icons.Delete size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
