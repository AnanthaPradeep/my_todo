import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernActivityTags.css';

interface ModernActivityTagsProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

const ACTIVITY_OPTIONS = [
  { id: 'work', label: 'Work', icon: Icons.Briefcase, color: '#FF6B6B' },
  { id: 'exercise', label: 'Exercise', icon: Icons.Zap, color: '#FFD93D' },
  { id: 'social', label: 'Social', icon: Icons.Heart, color: '#FF1493' },
  { id: 'creative', label: 'Creative', icon: Icons.Palette, color: '#FF69B4' },
  { id: 'learning', label: 'Learning', icon: Icons.Book, color: '#1F9E9E' },
  { id: 'relax', label: 'Relaxation', icon: Icons.Brain, color: '#4FC7BC' },
  { id: 'family', label: 'Family', icon: Icons.Users, color: '#6C5CE7' },
  { id: 'personal', label: 'Personal', icon: Icons.User, color: '#A29BFE' },
];

export const ModernActivityTags: React.FC<ModernActivityTagsProps> = ({ value, onChange }) => {
  const selected = value ?? [];

  const toggleActivity = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((a) => a !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="modern-activity-tags">
      <div className="activity-header">
        <div>
          <h3>What did you do today?</h3>
          <p>Select all that apply</p>
        </div>
        <div className="activity-count">
          <div className="count-badge">{selected.length}</div>
          <div className="count-label">Activities</div>
        </div>
      </div>

      <div className="activity-grid">
        {ACTIVITY_OPTIONS.map((activity) => {
          const isSelected = selected.includes(activity.id);
          return (
            <button
              key={activity.id}
              className={`activity-tag ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleActivity(activity.id)}
              style={isSelected ? { borderColor: activity.color, backgroundColor: `${activity.color}10` } : {}}
            >
              <div className="activity-icon">
                <IconWrapper Icon={activity.icon} size={28} color={activity.color} />
              </div>
              <div className="activity-label">{activity.label}</div>
              {isSelected && (
                <div className="activity-check">
                  <IconWrapper Icon={Icons.Check} size={16} color={activity.color} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
