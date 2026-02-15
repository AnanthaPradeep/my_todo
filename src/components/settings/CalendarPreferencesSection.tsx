import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Icons } from '../../utils/icons';

export const CalendarPreferencesSection: React.FC = () => {
  const settings = useSettingsStore();

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.Calendar size={22} />
          <h2 className="settings-section-title">Calendar Preferences</h2>
        </div>
        <p className="settings-section-description">Configure your calendar behavior</p>
      </div>

      <div className="settings-section-content">
        {/* Default View */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label htmlFor="default-view" className="settings-label">Default View</label>
            <p className="settings-description">Choose your preferred calendar view</p>
          </div>
          <select
            id="default-view"
            value={settings.defaultView}
            onChange={(e) =>
              settings.setDefaultView(e.target.value as 'month' | 'week' | 'day' | 'agenda')
            }
            className="settings-select"
          >
            <option value="month">Month View</option>
            <option value="week">Week View</option>
            <option value="day">Day View</option>
            <option value="agenda">Agenda View</option>
          </select>
        </div>

        <div className="settings-divider" />

        {/* Week Start Day */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label htmlFor="week-start" className="settings-label">Week Starts On</label>
            <p className="settings-description">Set your week's starting day</p>
          </div>
          <select
            id="week-start"
            value={settings.weekStartDay}
            onChange={(e) => settings.setWeekStartDay(e.target.value as 'sunday' | 'monday')}
            className="settings-select"
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </div>

        <div className="settings-divider" />

        {/* Time Format */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Time Format</label>
            <p className="settings-description">Choose between 12-hour or 24-hour format</p>
          </div>
          <div className="settings-button-group">
            <button
              className={`settings-button-group-item ${
                settings.timeFormat === '12h' ? 'active' : ''
              }`}
              onClick={() => settings.setTimeFormat('12h')}
              aria-pressed={settings.timeFormat === '12h'}
            >
              12-hour (3:30 PM)
            </button>
            <button
              className={`settings-button-group-item ${
                settings.timeFormat === '24h' ? 'active' : ''
              }`}
              onClick={() => settings.setTimeFormat('24h')}
              aria-pressed={settings.timeFormat === '24h'}
            >
              24-hour (15:30)
            </button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Show Completed Tasks */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="show-completed" className="settings-label">Show Completed Tasks</label>
            <p className="settings-description">Display finished tasks in calendar</p>
          </div>
          <button
            id="show-completed"
            className={`settings-toggle ${settings.showCompletedTasks ? 'active' : ''}`}
            onClick={() => settings.setShowCompletedTasks(!settings.showCompletedTasks)}
            role="switch"
            aria-checked={settings.showCompletedTasks}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Highlight Weekends */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="highlight-weekends" className="settings-label">Highlight Weekends</label>
            <p className="settings-description">Visually distinguish weekends</p>
          </div>
          <button
            id="highlight-weekends"
            className={`settings-toggle ${settings.highlightWeekends ? 'active' : ''}`}
            onClick={() => settings.setHighlightWeekends(!settings.highlightWeekends)}
            role="switch"
            aria-checked={settings.highlightWeekends}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>
      </div>
    </div>
  );
};
