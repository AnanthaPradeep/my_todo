import React, { useState } from 'react';
import { Icons } from '../../utils/icons';
import logo from '../../assets/logo.png';
import { useSettingsStore } from '../../store/settingsStore';
import { useTaskStore } from '../../store/taskStore';
import '../../styles/header.css';

export const TopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useSettingsStore();
  const { tasks } = useTaskStore();

  const handleSearchResultClick = (task: (typeof tasks)[number]) => {
    const event = new CustomEvent('viewTaskDetails', { detail: task });
    window.dispatchEvent(event);
    setSearchQuery('');
  };

  const handleAddTask = () => {
    const event = new CustomEvent('openTaskForm', {
      detail: { date: new Date().toISOString().split('T')[0] },
    });
    window.dispatchEvent(event);
  };

  const filteredTasks = searchQuery.trim()
    ? tasks
        .filter(t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left Section - Logo & Brand */}
        <div className="header-left">
          <div className="header-logo">
            <img src={logo} alt="LifeOS logo" className="header-logo-image" />
            <span className="header-brand">LifeOS</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div className="header-search">
            <input
              type="text"
              placeholder="Search..."
              className="header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="header-search-actions">
              <button
                className="header-search-mic"
                aria-label="Voice search"
                title="Voice search"
              >
                <Icons.Mic size={16} />
              </button>
              <button
                className="header-search-button"
                title="Search"
                aria-label="Search"
              >
                <Icons.Search size={18} />
              </button>
            </div>

            {/* Search Results */}
            {filteredTasks.length > 0 && (
              <div className="header-search-results">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(task)}
                  >
                    <Icons.CheckCircle size={12} />
                    <span>{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="header-right">
          <button
            className="header-button header-add-button"
            onClick={handleAddTask}
            title="Add new task"
            aria-label="Add new task"
          >
            <Icons.Plus size={16} />
            <span>Add</span>
          </button>

          <button
            className="header-button header-theme-button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Icons.Sun size={16} />
            ) : (
              <Icons.Moon size={16} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
