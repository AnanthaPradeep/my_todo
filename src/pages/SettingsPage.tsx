import React, { useState } from 'react';
import { AppearanceSection } from '../components/settings/AppearanceSection';
import { NotificationsSection } from '../components/settings/NotificationsSection';
import { CalendarPreferencesSection } from '../components/settings/CalendarPreferencesSection';
import { TaskPreferencesSection } from '../components/settings/TaskPreferencesSection';
import { ProductivitySection } from '../components/settings/ProductivitySection';
import { DataManagementSection } from '../components/settings/DataManagementSection';
import { AboutSection } from '../components/settings/AboutSection';
import { Icons } from '../utils/icons';
import '../components/settings/styles/settings.css';

type SettingsTab =
  | 'appearance'
  | 'notifications'
  | 'calendar'
  | 'tasks'
  | 'productivity'
  | 'data'
  | 'about';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  const tabs: Array<{ id: SettingsTab; label: string; icon: React.ReactNode }> = [
    { id: 'appearance', label: 'Appearance', icon: <Icons.Palette size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Icons.Bell size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Icons.Calendar size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <Icons.CheckCircle size={20} /> },
    { id: 'productivity', label: 'Productivity', icon: <Icons.Zap size={20} /> },
    { id: 'data', label: 'Data', icon: <Icons.Database size={20} /> },
    { id: 'about', label: 'About', icon: <Icons.Info size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <AppearanceSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'calendar':
        return <CalendarPreferencesSection />;
      case 'tasks':
        return <TaskPreferencesSection />;
      case 'productivity':
        return <ProductivitySection />;
      case 'data':
        return <DataManagementSection />;
      case 'about':
        return <AboutSection />;
      default:
        return <AppearanceSection />;
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <h1 className="settings-page-title">Settings</h1>
          <p className="settings-page-subtitle">Customize your LifeOS experience</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="settings-nav-icon">{tab.icon}</span>
                <span className="settings-nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="settings-main">
          <div className="settings-content">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};
