import React, { useEffect, useState } from 'react';
import { Confetti } from './Confetti';
import type { CheckInStats } from '../../types/checkIn';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/celebrationModal.css';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  longestStreak: number;
  stats: CheckInStats;
  microCommitment?: string;
}

const STREAK_MILESTONES: { [key: number]: string } = {
  3: '3-day streak! Momentum is building!',
  7: 'One week! You\'re unstoppable!',
  14: 'Two weeks! This is becoming a habit!',
  30: 'One month! Incredible consistency!',
  60: 'Two months! You\'re a check-in champion!',
  100: '100 days! Legendary status achieved!',
};

const getStreakMessage = (streak: number): string => {
  if (streak >= 100) return STREAK_MILESTONES[100];
  if (streak >= 60) return STREAK_MILESTONES[60];
  if (streak >= 30) return STREAK_MILESTONES[30];
  if (streak >= 14) return STREAK_MILESTONES[14];
  if (streak >= 7) return STREAK_MILESTONES[7];
  if (streak >= 3) return STREAK_MILESTONES[3];
  return `Day ${streak}! Keep building!`;
};

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  streak,
  longestStreak,
  stats,
  microCommitment,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="celebration-modal-overlay">
      {showConfetti && <Confetti />}

      <div className="celebration-modal">
        <div className="celebration-content">
          <div className="celebration-icon">
            <IconWrapper Icon={Icons.Sparkles} size={28} color="#FFD93D" />
          </div>

          <h2 className="celebration-title">Check-In Complete!</h2>

          <p className="celebration-subtitle">Your consistency is paying off</p>

          <div className="streak-badge">
            <div className="streak-display">
              {Array.from({ length: Math.min(streak, 10) }).map((_, i) => (
                <span key={i} className="streak-icon">
                  <IconWrapper Icon={Icons.Flame} size={16} color="#FF6B6B" />
                </span>
              ))}
              {streak > 10 && <span className="streak-count">+{streak - 10}</span>}
            </div>
            <p className="streak-message">{getStreakMessage(streak)}</p>
          </div>

          {microCommitment && (
            <div className="commitment-box">
              <p className="commitment-label">Your Micro-Commitment</p>
              <p className="commitment-text">"{microCommitment}"</p>
              <p className="commitment-note">You got this!</p>
            </div>
          )}

          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{stats.totalCheckIns}</span>
              <span className="stat-label">Total Check-Ins</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{longestStreak}</span>
              <span className="stat-label">Longest Streak</span>
            </div>
          </div>

          <button className="btn-celebrate" onClick={onClose}>
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
