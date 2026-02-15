import React, { useState, useMemo } from 'react';
import type { ChecklistItem, ChecklistFrequency, ChecklistCategory } from '../../types/checklist';
import { ChecklistCategoryGroup } from './ChecklistCategoryGroup';
import { Icons } from '../../utils/icons';
import type { IconType } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/checklist.css';

interface ChecklistSectionProps {
  frequency: ChecklistFrequency;
  title: string;
  subtitle: string;
  Icon: IconType;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  defaultExpanded?: boolean;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  title,
  subtitle,
  Icon,
  items,
  onToggle,
  onDelete,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<ChecklistCategory, ChecklistItem[]> = {} as any;
    
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    // Sort items within each category by order
    Object.keys(grouped).forEach((category) => {
      grouped[category as ChecklistCategory].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [items]);

  // Calculate progress
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="checklist-section">
      <div className="checklist-section-header" onClick={toggleExpanded}>
        <div className="checklist-section-header-left">
          <span className="checklist-section-icon">
            <IconWrapper Icon={Icon} size={18} color="var(--text-secondary)" />
          </span>
          <div className="checklist-section-title-wrapper">
            <h3 className="checklist-section-title">{title}</h3>
            <p className="checklist-section-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="checklist-section-progress">
          <span className="checklist-section-progress-text">
            {completed}/{total}
          </span>
          <div className="checklist-section-progress-bar">
            <div
              className="checklist-section-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={`checklist-section-chevron ${isExpanded ? 'expanded' : ''}`}>
            <Icons.ChevronDown size={20} />
          </div>
        </div>
      </div>

      <div className={`checklist-section-body ${isExpanded ? 'expanded' : ''}`}>
        <div className="checklist-section-content">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <ChecklistCategoryGroup
              key={category}
              category={category as ChecklistCategory}
              items={categoryItems}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}

          {total === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
              No items yet. Add your first checklist item!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
