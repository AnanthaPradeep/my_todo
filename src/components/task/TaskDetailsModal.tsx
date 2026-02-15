import React from 'react';
import type { Task } from '../../types/task';
import { dateUtils } from '../../utils/dateUtils';
import { Icons } from '../../utils/icons';
import { getCategoryColor, getCategoryLabel } from '../../utils/categoryColors';
import './styles/taskDetailsModal.css';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const getPriorityColor = (priority: Task['priority']): string => {
  const colors: Record<Task['priority'], string> = {
    low: '#3b82f6',
    medium: '#f59e0b',
    high: '#ef5350',
    critical: '#dc2626',
  };
  return colors[priority];
};

const getPriorityLabel = (priority: Task['priority']): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const formatDateTime = (dateStr: string): string => {
  const date = dateUtils.parseDateLocal(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  if (!isOpen || !task) return null;

  const categoryColor = getCategoryColor(task.category);
  const categoryLabel = getCategoryLabel(task.category);
  const priorityColor = getPriorityColor(task.priority);
  const priorityLabel = getPriorityLabel(task.priority);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const backgroundColorMap: Record<Task['category'], string> = {
    work: 'rgba(14, 165, 233, 0.08)',
    health: '#22c55e',
    finance: '#f59e0b',
    learning: '#a855f7',
    relationships: '#06b6d4',
    'personal-growth': '#ec4899',
  };

  return (
    <div className={`task-details-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="task-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="task-details-modal-header">
          <div className="task-details-modal-title-section">
            <h2 className="task-details-modal-title">{task.title}</h2>
            {task.completed && <div className="task-details-completed-badge">Completed</div>}
          </div>
          <button className="task-details-modal-close" onClick={onClose}>
            <Icons.Close size={24} />
          </button>
        </div>

        {/* Category & Priority badges */}
        <div className="task-details-badges">
          <div
            className="task-details-badge category-badge"
            style={{
              backgroundColor: backgroundColorMap[task.category],
              color: categoryColor,
              border: `1px solid ${categoryColor}`,
            }}
          >
            {categoryLabel}
          </div>
          <div
            className="task-details-badge priority-badge"
            style={{
              backgroundColor: `${priorityColor}15`,
              color: priorityColor,
              border: `1px solid ${priorityColor}`,
            }}
          >
            {priorityLabel} Priority
          </div>
          {task.reminder && (
            <div className="task-details-badge reminder-badge">
              <Icons.Target size={14} style={{ marginRight: '4px' }} />
              Reminder Set
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="task-details-modal-content">
          {/* Date & Time */}
          <div className="task-details-section">
            <h3 className="task-details-section-title">When</h3>
            <div className="task-details-info">
              <div className="task-details-info-row">
                <span className="task-details-info-label">Date</span>
                <span className="task-details-info-value">{formatDateTime(task.date)}</span>
              </div>
              <div className="task-details-info-row">
                <span className="task-details-info-label">Time</span>
                <span className="task-details-info-value">{formatTimeRange(task.startTime, task.endTime)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="task-details-section">
              <h3 className="task-details-section-title">Description</h3>
              <p className="task-details-description">{task.description}</p>
            </div>
          )}

          {/* Meta information */}
          <div className="task-details-section">
            <h3 className="task-details-section-title">Details</h3>
            <div className="task-details-info">
              <div className="task-details-info-row">
                <span className="task-details-info-label">Category</span>
                <span className="task-details-info-value">{categoryLabel}</span>
              </div>
              <div className="task-details-info-row">
                <span className="task-details-info-label">Priority</span>
                <span className="task-details-info-value">{priorityLabel}</span>
              </div>
              <div className="task-details-info-row">
                <span className="task-details-info-label">Status</span>
                <span className="task-details-info-value">{task.completed ? 'Completed' : 'Active'}</span>
              </div>
              {task.reminder && (
                <div className="task-details-info-row">
                  <span className="task-details-info-label">Notification</span>
                  <span className="task-details-info-value">Enabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="task-details-section task-details-timestamps">
            <div className="task-details-timestamp">
              <span className="task-details-timestamp-label">Created</span>
              <span className="task-details-timestamp-value">{formatTimestamp(task.createdAt)}</span>
            </div>
            <div className="task-details-timestamp">
              <span className="task-details-timestamp-label">Updated</span>
              <span className="task-details-timestamp-value">{formatTimestamp(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="task-details-modal-actions">
          <button
            className={`task-details-action-btn toggle-complete-btn ${task.completed ? 'completed' : ''}`}
            onClick={handleToggleComplete}
          >
            {task.completed ? (
              <>
                <Icons.Check size={16} />
                Completed
              </>
            ) : (
              <>
                <Icons.Check size={16} />
                Mark Complete
              </>
            )}
          </button>

          <button className="task-details-action-btn edit-btn" onClick={handleEdit}>
            <Icons.Edit size={16} />
            Edit
          </button>

          <button className="task-details-action-btn delete-btn" onClick={handleDelete}>
            <Icons.Delete size={16} />
            Delete
          </button>

          <button className="task-details-action-btn close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
