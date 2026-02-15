import React from 'react';
import { StreakBadge } from './StreakBadge';
import { Icons } from '../../utils/icons';
import './styles/checkinComponents.css';

interface CheckInHeaderProps {
  streak: number;
  hasCheckInToday: boolean;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const CheckInHeader: React.FC<CheckInHeaderProps> = ({ streak, hasCheckInToday }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="checkin-header">
      <div className="header-content">
        <h1 className="header-greeting">{getGreeting()}</h1>
        <p className="header-date">{dateStr}</p>
        {hasCheckInToday && (
          <div className="header-message">
            <Icons.Check size={16} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
            You've already checked in today
          </div>
        )}
      </div>
      <StreakBadge streak={streak} />
    </div>
  );
};
