import React from 'react';
import type { Task } from '../../types/task';
import { getDateIndicator, hasHighPriorityTasks } from '../../services/calendarService';
import { dateUtils } from '../../utils/dateUtils';
import { useCalendarStore } from '../../store/useCalendarStore';

interface MiniCalendarProps {
  currentDate: Date;
  tasks: Task[];
  onSelectDate?: (date: string) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ currentDate, tasks, onSelectDate }) => {
  const { selectedDate, setSelectedDate, setCurrentDate, setCurrentView } = useCalendarStore();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = dateUtils.getToday();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const miniDays: (number | null)[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    miniDays.push(-(i + 1));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    miniDays.push(i);
  }

  const remainingDays = 35 - miniDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    miniDays.push(-1000 - i);
  }

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleSelectDate = (dateStr: string) => {
    if (!dateStr) return;
    setSelectedDate(dateStr);
    setCurrentDate(dateUtils.parseDateLocal(dateStr));
    setCurrentView('day');
    onSelectDate?.(dateStr);
  };

  return (
    <div className="calendar-mini-month">
      {weekdays.map((day) => (
        <div key={day} className="calendar-mini-weekday">
          {day}
        </div>
      ))}
      {miniDays.map((dayNum, idx) => {
        const isOtherMonth = dayNum === null || dayNum < 1;
        let dateStr = '';
        let displayNum = 0;

        if (dayNum && dayNum > 0) {
          dateStr = dateUtils.formatDateISO(new Date(year, month, dayNum));
          displayNum = dayNum;
        } else if (dayNum && dayNum < -1000) {
          const nextMonthDay = -dayNum - 1000;
          displayNum = nextMonthDay;
        } else if (dayNum && dayNum < 0) {
          const prevMonthDay = daysInPrevMonth + dayNum + 1;
          displayNum = prevMonthDay;
        }

        const isTodayDate = dateStr === todayStr;
        const isSelected = selectedDate === dateStr;
        const indicator = dateStr ? getDateIndicator(tasks, dateStr) : null;
        const isHighPriority = dateStr ? hasHighPriorityTasks(tasks, dateStr) : false;

        return (
          <button
            key={idx}
            type="button"
            className={`calendar-mini-day ${isOtherMonth ? 'other-month' : ''} ${
              isTodayDate ? 'today' : ''
            } ${isSelected ? 'selected' : ''}`}
            title={indicator ? `${indicator.incompleteCount} tasks` : ''}
            onClick={() => handleSelectDate(dateStr)}
          >
            {displayNum}
            {indicator && indicator.taskCount > 0 && !isOtherMonth && (
              <div
                className={`calendar-mini-day-dot ${isHighPriority ? 'priority' : ''}`}
                style={{
                  opacity: indicator.incompleteCount > 0 ? 1 : 0.4,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
