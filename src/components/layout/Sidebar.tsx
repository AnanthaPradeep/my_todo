import React from 'react';
import '../../styles/sidebar.css';

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
  const mainIds = new Set(['dashboard', 'tasks', 'calendar', 'checkin']);
  const systemIds = new Set(['settings']);

  const mainItems = items.filter((item) => mainIds.has(item.id));
  const systemItems = items.filter((item) => systemIds.has(item.id));
  const extraItems = items.filter(
    (item) => !mainIds.has(item.id) && !systemIds.has(item.id)
  );

  return (
    <div className="sidebar-panel">
      <nav className="sidebar-nav">
        <div className="sidebar-group">
          <div className="sidebar-group-label">Main</div>
          <div className="sidebar-group-items">
            {mainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`sidebar-item ${item.isActive ? 'is-active' : ''}`}
                title={item.label}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-group">
          <div className="sidebar-group-label">System</div>
          <div className="sidebar-group-items">
            {systemItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`sidebar-item ${item.isActive ? 'is-active' : ''}`}
                title={item.label}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {extraItems.length > 0 && (
          <div className="sidebar-group">
            <div className="sidebar-group-label">Other</div>
            <div className="sidebar-group-items">
              {extraItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                  className={`sidebar-item ${item.isActive ? 'is-active' : ''}`}
                  title={item.label}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-version">v1.0.0</span>
        {footer && <div className="sidebar-footer-extra">{footer}</div>}
      </div>
    </div>
  );
};
