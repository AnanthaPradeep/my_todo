import React from 'react';
import { MOOD_OPTIONS } from '../../types/checkIn';
import { MOOD_ICON_MAP } from '../../utils/moodIcons';
import type { MoodType } from '../../utils/moodIcons';
import { dateUtils } from '../../utils/dateUtils';
import type { CheckInStats } from '../../types/checkIn';
import { IconWrapper } from '../icons/IconWrapper';
import { Target } from 'lucide-react';
import './styles/checkinComponents.css';

interface WeeklyTrendPreviewProps {
  stats: CheckInStats;
  totalCheckInsAllTime: number;
}

export const WeeklyTrendPreview: React.FC<WeeklyTrendPreviewProps> = ({
  stats,
  totalCheckInsAllTime,
}) => {
  const getDayLabel = (dateStr: string): string => {
    const date = dateUtils.parseDateLocal(dateStr);
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return labels[date.getDay()];
  };

  const getMoodIcon = (moodId: string) => {
    const mood = MOOD_OPTIONS.find((m) => m.id === moodId);
    if (!mood) return null;
    return {
      Icon: MOOD_ICON_MAP[mood.id as MoodType],
      color: mood.color,
    };
  };

  return (
    <div className="weekly-trend">
      <h3 className="trend-title">This Week</h3>
      
      <div className="trend-stats">
        <div className="stat-item">
          <span className="stat-label">Check-Ins</span>
          <span className="stat-value">{stats.weeklyMoods.length}/7</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Energy</span>
          <span className="stat-value">{stats.weeklyAvgEnergy}/10</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Focus</span>
          <span className="stat-value">{stats.weeklyAvgFocus}/5</span>
        </div>
      </div>

      <div className="mood-history">
        <div className="mood-days">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = dateUtils.formatDateISO(date);
            const moodEntry = stats.weeklyMoods.find((m) => m.date === dateStr);
            const moodIcon = moodEntry ? getMoodIcon(moodEntry.mood) : null;

            return (
              <div key={i} className="mood-day">
                <div className="day-label">{getDayLabel(dateStr)}</div>
                <div className="day-mood">
                  {moodIcon ? (
                    <IconWrapper
                      Icon={moodIcon.Icon}
                      size={20}
                      color={moodIcon.color}
                    />
                  ) : (
                    <span className="mood-placeholder">·</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalCheckInsAllTime > 0 && (
        <p className="trend-message">
          You've checked in <strong>{totalCheckInsAllTime}</strong> time{totalCheckInsAllTime !== 1 ? 's' : ''} total.
          Great consistency!
          <IconWrapper
            Icon={Target}
            size={16}
            className="inline-icon"
            color="#FFD93D"
          />
        </p>
      )}
    </div>
  );
};
