import React from 'react';
import { Flame } from 'lucide-react';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/checkinComponents.css';

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  return (
    <div className="streak-badge">
      <div className="streak-glow" />
      <div className="streak-content">
        <IconWrapper
          Icon={Flame}
          size={28}
          className="streak-fire"
          color="white"
        />
        <div className="streak-info">
          <span className="streak-number">{streak}</span>
          <span className="streak-text">day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
