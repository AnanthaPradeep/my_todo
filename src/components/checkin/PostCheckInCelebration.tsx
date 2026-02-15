import React from 'react';
import type { CheckInStats } from '../../types/checkIn';
import './styles/postCheckInCelebration.css';

interface PostCheckInCelebrationProps {
  streak: number;
  longestStreak: number;
  stats: CheckInStats;
}

export const PostCheckInCelebration: React.FC<PostCheckInCelebrationProps> = ({
  streak,
  longestStreak,
  stats,
}) => {
  return (
    <div className="post-checkin-celebration">
      <div className="celebration-header">
        <div className="celebration-badge">Check-In Complete</div>
        <h3>Nice work showing up today</h3>
        <p>Your consistency is building real momentum.</p>
      </div>

      <div className="celebration-stats">
        <div className="celebration-card">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">{streak} days</span>
        </div>
        <div className="celebration-card">
          <span className="stat-label">Longest Streak</span>
          <span className="stat-value">{longestStreak} days</span>
        </div>
        <div className="celebration-card">
          <span className="stat-label">Total Check-Ins</span>
          <span className="stat-value">{stats.totalCheckIns}</span>
        </div>
      </div>
    </div>
  );
};
