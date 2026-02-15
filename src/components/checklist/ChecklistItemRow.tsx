import React from 'react';
import type { ChecklistItem } from '../../types/checklist';
import { Icons } from '../../utils/icons';
import './styles/checklist.css';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item,
  onToggle,
  onDelete,
}) => {
  const handleToggle = () => {
    onToggle(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <div className={`checklist-item ${item.completed ? 'completed' : ''}`}>
      <div className="checklist-item-checkbox-wrapper">
        <input
          type="checkbox"
          className="checklist-item-checkbox"
          checked={item.completed}
          onChange={handleToggle}
          id={`checklist-${item.id}`}
        />
        <label htmlFor={`checklist-${item.id}`} className="checklist-item-checkbox-custom">
          <Icons.Check />
        </label>
      </div>
      
      <div className="checklist-item-content">
        <span className="checklist-item-title">{item.title}</span>
      </div>

      {!item.isTemplate && onDelete && (
        <div className="checklist-item-actions">
          <button
            className="checklist-item-action-btn delete"
            onClick={handleDelete}
            title="Delete item"
          >
            <Icons.Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
