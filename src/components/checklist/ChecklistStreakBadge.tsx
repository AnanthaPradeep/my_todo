import React from 'react';
import type { ChecklistStreak } from '../../types/checklist';
import { Icons } from '../../utils/icons';
import './styles/checklist.css';

interface ChecklistStreakBadgeProps {
  streak: ChecklistStreak;
}

export const ChecklistStreakBadge: React.FC<ChecklistStreakBadgeProps> = ({ streak }) => {
  if (streak.current === 0) return null;

  return (
    <div className="checklist-streak-container">
      <div className="checklist-streak-badge">
        <div className="checklist-streak-icon">
          <Icons.Flame size={32} />
        </div>
        <div className="checklist-streak-content">
          <div className="checklist-streak-number">{streak.current}</div>
          <div className="checklist-streak-label">
            {streak.current === 1 ? 'Day Streak' : 'Days Streak'}
          </div>
        </div>
      </div>
    </div>
  );
};
