import React from 'react';
import type { ChecklistItem, ChecklistCategory } from '../../types/checklist';
import { ChecklistItemRow } from './ChecklistItemRow';
import { CHECKLIST_CATEGORIES } from '../../utils/constants';
import './styles/checklist.css';

interface ChecklistCategoryGroupProps {
  category: ChecklistCategory;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ChecklistCategoryGroup: React.FC<ChecklistCategoryGroupProps> = ({
  category,
  items,
  onToggle,
  onDelete,
}) => {
  if (items.length === 0) return null;

  const categoryConfig = CHECKLIST_CATEGORIES.find((c) => c.value === category);
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="checklist-category-group">
      <div className="checklist-category-header">
        <div className="checklist-category-title-wrapper">
          <h4 className="checklist-category-title" style={{ color: categoryConfig?.color }}>
            {categoryConfig?.label || category}
          </h4>
        </div>
        <span className="checklist-category-progress">
          {completed}/{total} ({progress}%)
        </span>
      </div>

      <div className="checklist-category-items">
        {items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
