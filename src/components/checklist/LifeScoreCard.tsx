import React from 'react';
import type { ChecklistProgress } from '../../types/checklist';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/checklist.css';

interface LifeScoreCardProps {
  overallProgress: ChecklistProgress;
  dailyProgress: ChecklistProgress;
  weeklyProgress: ChecklistProgress;
  monthlyProgress: ChecklistProgress;
  yearlyProgress: ChecklistProgress;
}

export const LifeScoreCard: React.FC<LifeScoreCardProps> = ({
  overallProgress,
  dailyProgress,
  weeklyProgress,
  monthlyProgress,
  yearlyProgress,
}) => {
  const { completed, total, percentage } = overallProgress;

  // Generate motivational message based on percentage
  const getMessage = () => {
    if (percentage === 100) return "Perfect score! You're crushing it!";
    if (percentage >= 80) return "Excellent work! Keep up the momentum!";
    if (percentage >= 60) return "Great progress! You're doing well!";
    if (percentage >= 40) return "Good start! Keep pushing forward!";
    if (percentage >= 20) return "You've got this! Take it one step at a time!";
    return "Every journey starts with a single step! Let's begin!";
  };

  // Calculate SVG circle properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="life-score-card">
      <div className="life-score-content">
        <div className="life-score-circle">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--bg-tertiary)"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-color)" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="life-score-percentage">
            <div className="life-score-number">{percentage}%</div>
            <div className="life-score-label">Life Score</div>
          </div>
        </div>

        <div className="life-score-details">
          <h2 className="life-score-title">Your Life Progress</h2>
          <p className="life-score-message">{getMessage()}</p>

          <div className="life-score-breakdown">
            <div className="life-score-stat">
              <div className="life-score-stat-icon">
                <IconWrapper Icon={Icons.Sun} size={18} color="var(--text-secondary)" />
              </div>
              <div className="life-score-stat-details">
                <p className="life-score-stat-label">Daily</p>
                <p className="life-score-stat-value">{dailyProgress.percentage}%</p>
              </div>
            </div>

            <div className="life-score-stat">
              <div className="life-score-stat-icon">
                <IconWrapper Icon={Icons.Calendar} size={18} color="var(--text-secondary)" />
              </div>
              <div className="life-score-stat-details">
                <p className="life-score-stat-label">Weekly</p>
                <p className="life-score-stat-value">{weeklyProgress.percentage}%</p>
              </div>
            </div>

            <div className="life-score-stat">
              <div className="life-score-stat-icon">
                <IconWrapper Icon={Icons.Calendar} size={18} color="var(--text-secondary)" />
              </div>
              <div className="life-score-stat-details">
                <p className="life-score-stat-label">Monthly</p>
                <p className="life-score-stat-value">{monthlyProgress.percentage}%</p>
              </div>
            </div>

            <div className="life-score-stat">
              <div className="life-score-stat-icon">
                <IconWrapper Icon={Icons.Calendar} size={18} color="var(--text-secondary)" />
              </div>
              <div className="life-score-stat-details">
                <p className="life-score-stat-label">Yearly</p>
                <p className="life-score-stat-value">{yearlyProgress.percentage}%</p>
              </div>
            </div>

            <div className="life-score-stat">
              <div className="life-score-stat-icon">
                <Icons.CheckCircle size={20} style={{ color: 'var(--accent-color)' }} />
              </div>
              <div className="life-score-stat-details">
                <p className="life-score-stat-label">Completed</p>
                <p className="life-score-stat-value">{completed}/{total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
