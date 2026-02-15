import React, { useState } from 'react';
import type { CalendarEvent } from '../../utils/calendarUtils';
import { categoryConfig } from '../../utils/calendarUtils';
import { Icons } from '../../utils/icons';

interface EventModalProps {
  event?: CalendarEvent;
  prefilledDate?: string;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  onDelete?: (id: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  prefilledDate,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || prefilledDate || '');
  const [startTime, setStartTime] = useState(event?.startTime || '');
  const [endTime, setEndTime] = useState(event?.endTime || '');
  const [category, setCategory] = useState<CalendarEvent['category']>(event?.category || 'work');
  const [notes, setNotes] = useState(event?.notes || '');
  const [priority, setPriority] = useState(event?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onSave({
      title,
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      category,
      notes: notes || undefined,
      priority: priority as 'low' | 'medium' | 'high',
    });

    setTitle('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setCategory('work');
    setNotes('');
    setPriority('medium');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div className="calendar-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-event-modal-header">
          <h2 className="calendar-event-modal-title">{event ? 'Edit Event' : 'New Event'}</h2>
          <button className="calendar-event-modal-close" onClick={onClose}>
            <Icons.Close size={20} />
          </button>
        </div>

        <form className="calendar-event-modal-body" onSubmit={handleSubmit}>
          <div className="calendar-event-form-group">
            <label className="calendar-event-form-label">Event Title *</label>
            <input
              type="text"
              className="calendar-event-form-input"
              placeholder="What do you want to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="calendar-event-form-group">
              <label className="calendar-event-form-label">Date *</label>
              <input
                type="date"
                className="calendar-event-form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="calendar-event-form-group">
              <label className="calendar-event-form-label">Category</label>
              <select className="calendar-event-form-input" value={category} onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="calendar-event-form-group">
              <label className="calendar-event-form-label">Start Time</label>
              <input
                type="time"
                className="calendar-event-form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="calendar-event-form-group">
              <label className="calendar-event-form-label">End Time</label>
              <input
                type="time"
                className="calendar-event-form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="calendar-event-form-group">
              <label className="calendar-event-form-label">Priority</label>
              <select className="calendar-event-form-input" value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="calendar-event-form-group">
            <label className="calendar-event-form-label">Notes</label>
            <textarea
              className="calendar-event-form-input"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div className="calendar-event-form-actions">
            {event && onDelete && (
              <button
                type="button"
                className="calendar-event-form-button secondary"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
                style={{ marginRight: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              >
                Delete
              </button>
            )}
            <button type="button" className="calendar-event-form-button secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="calendar-event-form-button primary">
              {event ? 'Update' : 'Add'} Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
