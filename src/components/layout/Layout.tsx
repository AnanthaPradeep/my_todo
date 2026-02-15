import React, { useState } from 'react';
import type { ReactElement } from 'react';
import '../../styles/layout.css';
import '../../styles/responsive.css';

interface LayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, header, footer, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout">
      {/* Sidebar with mobile backdrop */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {React.cloneElement(sidebar as ReactElement<{ onClose?: () => void }>, {
          onClose: closeSidebar,
        })}
      </aside>

      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Main content area */}
      <div className="content">
        {/* Header with menu button */}
        <header className="header">
          <button
            className="mobile-menu-button"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            title="Toggle menu"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {header}
        </header>

        {/* Main content */}
        <main className="main-body">
          <div className="content-wrapper">{children}</div>
        </main>

        {footer && <div className="content-footer">{footer}</div>}
      </div>
    </div>
  );
};
