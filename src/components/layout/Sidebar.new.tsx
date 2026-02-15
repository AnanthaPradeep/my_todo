import React from 'react';

interface SidebarProps {
  items: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }>;
  footer?: React.ReactNode;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, footer, onClose = () => {} }) => {
  return (
    <>
      {/* Navigation */}
      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={`sidebar-nav-item ${item.isActive ? 'active' : ''}`}
            title={item.label}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="sidebar-footer">
          {footer}
        </div>
      )}
    </>
  );
};
