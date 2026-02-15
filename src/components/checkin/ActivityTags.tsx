/**
 * Activity Tags Component
 * Multi-select tags for tracking daily activities
 */

import React from 'react';
import { ACTIVITY_OPTIONS } from '../../types/checkIn';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/activityTags.css';

interface ActivityTagsProps {
  selectedActivities: string[];
  onChange: (activities: string[]) => void;
}

export const ActivityTags: React.FC<ActivityTagsProps> = ({
  selectedActivities,
  onChange,
}) => {
  const activityIcons: Record<string, typeof Icons.Check> = {
    exercise: Icons.Zap,
    social: Icons.Users,
    learning: Icons.Book,
    'deep-work': Icons.Briefcase,
    leisure: Icons.Circle,
    'ate-well': Icons.Heart,
    'good-sleep': Icons.Moon,
    meditation: Icons.Brain,
  };

  const toggleActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      onChange(selectedActivities.filter((id) => id !== activityId));
    } else {
      onChange([...selectedActivities, activityId]);
    }
  };

  return (
    <div className="activity-tags">
      <h4 className="activity-tags-title">Today's Activities</h4>
      <p className="activity-tags-description">
        Select all that apply (helps track patterns)
      </p>
      <div className="activity-tags-grid">
        {ACTIVITY_OPTIONS.map((activity) => {
          const isSelected = selectedActivities.includes(activity.id);
          return (
          <button
            key={activity.id}
            type="button"
            className={`activity-tag ${
              isSelected ? 'selected' : ''
            }`}
            onClick={() => toggleActivity(activity.id)}
            style={{
              '--activity-color': activity.color,
            } as React.CSSProperties}
          >
            <span className="activity-tag-icon">
              <IconWrapper
                Icon={activityIcons[activity.id] ?? Icons.Circle}
                size={16}
                color={isSelected ? '#FFFFFF' : activity.color}
              />
            </span>
            <span className="activity-tag-label">{activity.label}</span>
            {isSelected && (
              <span className="activity-tag-check">
                <IconWrapper Icon={Icons.Check} size={14} color="currentColor" />
              </span>
            )}
          </button>
        );
        })}
      </div>
    </div>
  );
};
