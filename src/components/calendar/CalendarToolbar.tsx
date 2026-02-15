import React from 'react';
import type { CalendarView } from '../../utils/calendarUtils';

interface CalendarToolbarProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentView,
  onViewChange,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const monthYear = `${currentDate.toLocaleDateString('en-US', { month: 'long' })} ${currentDate.getFullYear()}`;

  const views: { id: CalendarView; label: string }[] = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'day', label: 'Day' },
    { id: 'agenda', label: 'Agenda' },
  ];

  return (
    <div className="calendar-toolbar">
      <div className="calendar-toolbar-nav">
        <button className="calendar-nav-button" onClick={onPrevMonth} title="Previous">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="calendar-month-label">{monthYear}</div>
        <button className="calendar-nav-button" onClick={onNextMonth} title="Next">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <button className="calendar-today-button" onClick={onToday}>
        Today
      </button>

      <div className="calendar-toolbar-spacer" />

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        {views.map((view) => (
          <button
            key={view.id}
            className={`calendar-header-button ${currentView === view.id ? 'active' : ''}`}
            onClick={() => onViewChange(view.id)}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
};
