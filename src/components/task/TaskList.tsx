import React from 'react';
import type { Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import { Icons } from '../../utils/icons';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  emptyMessage = 'No tasks yet. Create one to get started!',
}) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="task-list-empty-icon">
          <Icons.Tasks size={40} />
        </div>
        <p className="task-list-empty-title">No tasks here yet</p>
        <p className="task-list-empty-message">{emptyMessage}</p>
      </div>
    );
  }

  // Sort tasks: incomplete first, then by priority and due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Use primary date field with fallback for backward compatibility
    const dateA = a.date || a.dueDate;
    const dateB = b.date || b.dueDate;

    if (dateA && dateB) {
      return dateA.localeCompare(dateB);
    }
    if (dateA) return -1;
    if (dateB) return 1;

    return a.createdAt.localeCompare(b.createdAt);
  });

  return (
    <div className="task-list">
      {sortedTasks.map((task, index) => (
        <div key={task.id} className="task-list-item" style={{ animationDelay: `${index * 50}ms` }}>
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </div>
      ))}
    </div>
  );
};
