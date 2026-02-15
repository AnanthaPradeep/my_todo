import React from 'react';
import type { Task } from '../../types/task';
import { DayDetailPanel } from './DayDetailPanel';
import './styles/dayView.css';

interface DayViewProps {
  selectedDate: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  tasks,
  onAddTask,
  onTaskClick,
}) => {
  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  return (
    <div className="day-view-container">
      <div className="day-view-card">
        <DayDetailPanel
          selectedDate={selectedDate}
          tasks={filteredTasks}
          onAddTask={onAddTask}
          onTaskClick={onTaskClick}
        />
      </div>
    </div>
  );
};
