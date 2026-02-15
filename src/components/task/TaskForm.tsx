import React, { useState, useEffect, useMemo } from 'react';
import type { Task } from '../../types/task';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../../utils/constants';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validateTaskForm, getFieldError, isFormValid } from '../../utils/taskValidation';
import { calculateDuration, formatDuration, isValidTimeRange } from '../../utils/timeValidation';
import type { ValidationError } from '../../utils/taskValidation';
import { dateUtils } from '../../utils/dateUtils';
import { useChecklistStore } from '../../store/checklistStore';
import type { ChecklistCategory } from '../../types/checklist';

type TaskFormMode = 'add' | 'edit';

interface TaskFormProps {
  mode: TaskFormMode;
  task?: Task;
  initialValues?: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const normalizeDateInput = (value?: string): string => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return dateUtils.formatDateISO(parsed);
};

const normalizeTimeInput = (value?: string): string => {
  if (!value) return '';
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!match) return '';

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const meridiem = match[3].toLowerCase();

  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  mode,
  task,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work' as Task['category'],
    priority: 'medium' as Task['priority'],
    date: '',
    startTime: '',
    endTime: '',
    reminder: false,
  });

  const [selectedChecklistIds, setSelectedChecklistIds] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [durationDisplay, setDurationDisplay] = useState<string>('');

  // Get all checklist items
  const allChecklistItems = useChecklistStore((state) => state.items);

  // Filter checklist items by selected category
  const categoryChecklists = useMemo(() => {
    return allChecklistItems.filter(
      (item) => item.category === formData.category as ChecklistCategory
    );
  }, [allChecklistItems, formData.category]);

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: (task.category || 'work') as Task['category'],
        priority: (task.priority || 'medium') as Task['priority'],
        date: normalizeDateInput(task.date ?? task.dueDate),
        startTime: normalizeTimeInput(task.startTime ?? task.dueTime),
        endTime: normalizeTimeInput(task.endTime),
        reminder: task.reminder || false,
      });
      setSelectedChecklistIds(task.checklistIds || []);
      setValidationErrors([]);
      return;
    }

    if (mode === 'add' && initialValues) {
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
        category: (initialValues.category || 'work') as Task['category'],
        priority: (initialValues.priority || 'medium') as Task['priority'],
        date: normalizeDateInput(initialValues.date),
        startTime: normalizeTimeInput(initialValues.startTime),
        endTime: normalizeTimeInput(initialValues.endTime),
        reminder: initialValues.reminder || false,
      });
      setSelectedChecklistIds([]);
      setValidationErrors([]);
      return;
    }

    setFormData({
      title: '',
      description: '',
      category: 'work',
      priority: 'medium',
      date: '',
      startTime: '',
      endTime: '',
      reminder: false,
    });
    setSelectedChecklistIds([]);
    setValidationErrors([]);
    setDurationDisplay('');
  }, [task, mode, initialValues]);

  // Update duration display when times change
  useEffect(() => {
    if (formData.startTime && formData.endTime && isValidTimeRange(formData.startTime, formData.endTime)) {
      const minutes = calculateDuration(formData.startTime, formData.endTime);
      setDurationDisplay(formatDuration(minutes));
    } else {
      setDurationDisplay('');
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear selected checklists when category changes
    if (name === 'category') {
      setSelectedChecklistIds([]);
    }

    // Clear error for this field when user starts editing
    setValidationErrors((prev) =>
      prev.filter((err) => err.field !== name)
    );
  };

  const toggleChecklistItem = (checklistId: string) => {
    setSelectedChecklistIds((prev) =>
      prev.includes(checklistId)
        ? prev.filter((id) => id !== checklistId)
        : [...prev, checklistId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation
    const errors = validateTaskForm({
      ...formData,
      completed: task?.completed || false,
    });
    setValidationErrors(errors);

    // If validation failed, don't submit
    if (!isFormValid(errors)) {
      return;
    }

    // Submit valid form data
    onSubmit({
      ...formData,
      checklistIds: selectedChecklistIds.length > 0 ? selectedChecklistIds : undefined,
      completed: task?.completed || false,
    });

    // Clear form after successful submission
    setFormData({
      title: '',
      description: '',
      category: 'work',
      priority: 'medium',
      date: '',
      startTime: '',
      endTime: '',
      reminder: false,
    });
    setSelectedChecklistIds([]);
    setValidationErrors([]);
    setDurationDisplay('');
  };

  const getTitleError = getFieldError(validationErrors, 'title');
  const getDateError = getFieldError(validationErrors, 'date');
  const getStartTimeError = getFieldError(validationErrors, 'startTime');
  const getEndTimeError = getFieldError(validationErrors, 'endTime');
  const getDescriptionError = getFieldError(validationErrors, 'description');

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {/* Title */}
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        error={getTitleError}
        autoFocus
      />

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows={3}
          className={`form-field form-textarea ${getDescriptionError ? 'error' : ''}`}
        />
        {getDescriptionError && <span className="form-error">{getDescriptionError}</span>}
      </div>

      {/* Date */}
      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={getDateError}
      />

      {/* Start Time */}
      <Input
        label="Start Time"
        name="startTime"
        type="time"
        value={formData.startTime}
        onChange={handleChange}
        error={getStartTimeError}
      />

      {/* End Time */}
      <Input
        label="End Time"
        name="endTime"
        type="time"
        value={formData.endTime}
        onChange={handleChange}
        error={getEndTimeError}
      />

      {/* Duration Display */}
      {durationDisplay && (
        <div className="form-group">
          <label className="form-label">Duration</label>
          <div className="form-field form-duration-display">{durationDisplay}</div>
        </div>
      )}

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-field"
        >
          {TASK_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Checklist Items for Selected Category */}
      {categoryChecklists.length > 0 && (
        <div className="form-group">
          <label className="form-label">
            Related Checklist Items <span className="form-label-optional">(Optional)</span>
          </label>
          <div className="checklist-selector">
            {categoryChecklists.map((item) => (
              <label key={item.id} className="checklist-option">
                <input
                  type="checkbox"
                  checked={selectedChecklistIds.includes(item.id)}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="checklist-checkbox"
                />
                <span className="checklist-title">{item.title}</span>
                <span className="frequency-badge">{item.frequency}</span>
              </label>
            ))}
          </div>
          {selectedChecklistIds.length > 0 && (
            <div className="checklist-count">
              {selectedChecklistIds.length} item{selectedChecklistIds.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Priority */}
      <div className="form-group">
        <label className="form-label">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-field"
        >
          {TASK_PRIORITIES.map((pri) => (
            <option key={pri.value} value={pri.value}>
              {pri.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reminder */}
      <div className="form-group form-checkbox">
        <input
          type="checkbox"
          id="reminder"
          name="reminder"
          checked={formData.reminder}
          onChange={handleChange}
        />
        <label htmlFor="reminder" className="form-label">
          Send notification at task start time
        </label>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <Button
          variant="primary"
          type="submit"
          disabled={validationErrors.length > 0}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
