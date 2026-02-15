import React from 'react';
import { MOOD_OPTIONS } from '../../types/checkIn';
import { MOOD_ICON_MAP } from '../../utils/moodIcons';
import type { MoodType } from '../../utils/moodIcons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernMoodSelector.css';

interface MoodSelectorProps {
  selectedMood?: string;
  onChange: (mood: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange }) => {
  const MOOD_DESCRIPTIONS: { [key: string]: string } = {
    happy: 'Feeling great',
    excited: 'Full of energy',
    calm: 'Peaceful',
    productive: 'In the zone',
    neutral: 'Just okay',
    tired: 'Need rest',
    stressed: 'Overwhelming',
  };

  return (
    <div className="modern-mood-selector">
      <div className="mood-header">
        <h3>How are you feeling?</h3>
        <p>Choose the mood that best describes your current state</p>
      </div>
      <div className="mood-grid">
        {MOOD_OPTIONS.map((mood) => {
          const Icon = MOOD_ICON_MAP[mood.id as MoodType];
          const isSelected = selectedMood === mood.id;
          
          return (
            <button
              key={mood.id}
              className={`mood-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(mood.id)}
              title={mood.label}
              style={{
                borderColor: isSelected ? mood.color : undefined,
                backgroundColor: isSelected ? `${mood.color}15` : undefined,
              }}
            >
              <div className="mood-icon-wrapper" style={{ color: mood.color }}>
                <IconWrapper
                  Icon={Icon}
                  size={32}
                  color={mood.color}
                />
              </div>
              <div className="mood-label">{mood.label}</div>
              <div className="mood-description">{MOOD_DESCRIPTIONS[mood.id] || mood.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
