import React, { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Icons } from '../../utils/icons';

/**
 * Apply CSS variables based on settings
 */
const applyCSSVariables = (settings: any) => {
  const root = document.documentElement;

  // Apply accent color and hover state
  root.style.setProperty('--accent-color', settings.accentColor);
  const accentRGB = hexToRGB(settings.accentColor);
  root.style.setProperty('--accent-color-rgb', accentRGB);
  root.style.setProperty('--accent-color-hover', darkenColor(settings.accentColor, 0.2));

  // Apply font size scaling - affects all typography on the page
  const fontSizeScaleMap: { [key: string]: number } = {
    small: 0.93,   // 93% of normal size
    medium: 1.0,   // 100% (default)
    large: 1.14,   // 114% of normal size
  };
  const scale = fontSizeScaleMap[settings.fontSize] || 1.0;
  root.style.zoom = scale.toString();

  // Apply compact mode
  const spacing = settings.compactMode
    ? { lg: '12px', md: '8px', sm: '4px' }
    : { lg: '24px', md: '16px', sm: '8px' };
  root.style.setProperty('--space-lg', spacing.lg);
  root.style.setProperty('--space-md', spacing.md);
  root.style.setProperty('--space-sm', spacing.sm);

  // Apply animations
  if (settings.reduceAnimations) {
    root.style.setProperty('--transition-duration', '0s');
  } else {
    root.style.setProperty('--transition-duration', '0.2s');
  }

  // Apply theme
  applyTheme(settings.theme);
};

/**
 * Apply theme to document
 */
const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement;
  const isDark = getThemePreference(theme);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * Get effective theme based on preference
 */
const getThemePreference = (theme: 'light' | 'dark' | 'system'): boolean => {
  if (theme === 'light') return false;
  if (theme === 'dark') return true;

  // System theme
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
};

/**
 * Convert hex color to RGB string
 */
const hexToRGB = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

/**
 * Darken a hex color by a percentage
 */
const darkenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const darkR = Math.round(r * (1 - percent));
  const darkG = Math.round(g * (1 - percent));
  const darkB = Math.round(b * (1 - percent));

  return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
};

export const AppearanceSection: React.FC = () => {
  const settings = useSettingsStore();
  const accentColor = useSettingsStore((state) => state.accentColor);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const compactMode = useSettingsStore((state) => state.compactMode);
  const reduceAnimations = useSettingsStore((state) => state.reduceAnimations);
  const theme = useSettingsStore((state) => state.theme);

  // Apply settings on mount and when they change
  useEffect(() => {
    applyCSSVariables(settings);
  }, [accentColor, fontSize, compactMode, reduceAnimations, theme, settings]);

  // Watch for system theme changes
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [settings.theme]);

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Green', value: '#10B981' },
    { name: 'Teal', value: '#14B8A6' },
  ];

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.Palette size={22} />
          <h2 className="settings-section-title">Appearance</h2>
        </div>
        <p className="settings-section-description">Customize look and feel</p>
      </div>

      <div className="settings-section-content">
        {/* Theme Selection */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Theme</label>
            <p className="settings-description">Choose your preferred color scheme</p>
          </div>
          <div className="settings-theme-options">
            <button
              className={`settings-theme-option ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => settings.setTheme('light')}
              aria-pressed={settings.theme === 'light'}
            >
              <div className="settings-theme-preview light" />
              <span>Light</span>
            </button>
            <button
              className={`settings-theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => settings.setTheme('dark')}
              aria-pressed={settings.theme === 'dark'}
            >
              <div className="settings-theme-preview dark" />
              <span>Dark</span>
            </button>
            <button
              className={`settings-theme-option ${settings.theme === 'system' ? 'active' : ''}`}
              onClick={() => settings.setTheme('system')}
              aria-pressed={settings.theme === 'system'}
            >
              <div className="settings-theme-preview system" />
              <span>System</span>
            </button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Accent Color */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Accent Color</label>
            <p className="settings-description">Select your brand color</p>
          </div>
          <div className="settings-color-grid">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`settings-color-option ${
                  settings.accentColor === color.value ? 'active' : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => settings.setAccentColor(color.value)}
                title={color.name}
                aria-label={`Select ${color.name} accent color`}
                aria-pressed={settings.accentColor === color.value}
              >
                {settings.accentColor === color.value && (
                  <Icons.Check size={16} style={{ color: 'white' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-divider" />

        {/* Font Size */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Font Size</label>
            <p className="settings-description">Adjust text size</p>
          </div>
          <div className="settings-size-options">
            <button
              className={`settings-size-option ${settings.fontSize === 'small' ? 'active' : ''}`}
              onClick={() => settings.setFontSize('small')}
              aria-pressed={settings.fontSize === 'small'}
            >
              Small
            </button>
            <button
              className={`settings-size-option ${settings.fontSize === 'medium' ? 'active' : ''}`}
              onClick={() => settings.setFontSize('medium')}
              aria-pressed={settings.fontSize === 'medium'}
            >
              Medium
            </button>
            <button
              className={`settings-size-option ${settings.fontSize === 'large' ? 'active' : ''}`}
              onClick={() => settings.setFontSize('large')}
              aria-pressed={settings.fontSize === 'large'}
            >
              Large
            </button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Compact Mode */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="compact-mode" className="settings-label">
              Compact Mode
            </label>
            <p className="settings-description">Reduce spacing and padding</p>
          </div>
          <button
            id="compact-mode"
            className={`settings-toggle ${settings.compactMode ? 'active' : ''}`}
            onClick={() => settings.setCompactMode(!settings.compactMode)}
            role="switch"
            aria-checked={settings.compactMode}
            aria-label="Toggle compact mode"
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Reduce Animations */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="reduce-animations" className="settings-label">
              Reduce Animations
            </label>
            <p className="settings-description">Minimize motion and transitions</p>
          </div>
          <button
            id="reduce-animations"
            className={`settings-toggle ${settings.reduceAnimations ? 'active' : ''}`}
            onClick={() => settings.setReduceAnimations(!settings.reduceAnimations)}
            role="switch"
            aria-checked={settings.reduceAnimations}
            aria-label="Toggle reduce animations"
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>
      </div>
    </div>
  );
};
