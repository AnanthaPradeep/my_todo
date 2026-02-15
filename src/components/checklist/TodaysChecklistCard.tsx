import React from 'react';
import { ChecklistItemRow } from './ChecklistItemRow';
import type { ChecklistItem } from '../../types/checklist';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/checklist.css';

interface TodaysChecklistCardProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  completedCount: number;
  totalCount: number;
}

export const TodaysChecklistCard: React.FC<TodaysChecklistCardProps> = ({
  items,
  onToggle,
  completedCount,
  totalCount,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="todays-checklist-card">
      <div className="todays-checklist-header">
        <div className="todays-checklist-title-wrapper">
          <span className="todays-checklist-icon">
            <IconWrapper Icon={Icons.Sun} size={18} color="var(--text-secondary)" />
          </span>
          <div>
            <h3 className="todays-checklist-title">Today's Checklist</h3>
            <p className="todays-checklist-subtitle">
              Daily habits and routines
            </p>
          </div>
        </div>
        <div className="todays-checklist-progress">
          <span className="todays-checklist-progress-text">
            {completedCount}/{totalCount}
          </span>
          <div className="todays-checklist-progress-bar">
            <div
              className="todays-checklist-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="todays-checklist-items">
        {items.length === 0 ? (
          <p className="todays-checklist-empty">
            No daily checklist items yet. Go to Dashboard to see all checklists.
          </p>
        ) : (
          items.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};
