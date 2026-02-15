import React from 'react';
import { Icons } from '../../utils/icons';

export const AboutSection: React.FC = () => {
  const version = '1.0.0';
  const buildDate = new Date(2026, 1, 15).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleFeedback = () => {
    // Open email client or feedback form
    window.open('mailto:feedback@lifeos.app?subject=LifeOS Feedback');
  };

  const handleChangelog = () => {
    // Could open a changelog modal or external link
    alert(
      'Changelog v1.0.0\n\nNew Features:\n- Complete task management\n- Daily check-in system\n- Mood tracking\n- Productivity analytics\n- Dark/Light theme\n\nBug Fixes:\n- Various UI improvements'
    );
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.Info size={22} />
          <h2 className="settings-section-title">About</h2>
        </div>
        <p className="settings-section-description">Information and resources</p>
      </div>

      <div className="settings-section-content">
        {/* App Info */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">LifeOS</label>
            <p className="settings-description">Your personal life operating system</p>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Version */}
        <div className="settings-info-row">
          <div className="settings-info-label">Version</div>
          <div className="settings-info-value">{version}</div>
        </div>

        <div className="settings-divider" />

        {/* Build Date */}
        <div className="settings-info-row">
          <div className="settings-info-label">Build Date</div>
          <div className="settings-info-value">{buildDate}</div>
        </div>

        <div className="settings-divider" />

        {/* Changelog */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Changelog</label>
            <p className="settings-description">View what's new in this version</p>
          </div>
          <button className="settings-button primary" onClick={handleChangelog}>
            <Icons.FileText size={18} />
            View Changelog
          </button>
        </div>

        <div className="settings-divider" />

        {/* Feedback */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Send Feedback</label>
            <p className="settings-description">Help us improve LifeOS</p>
          </div>
          <button className="settings-button primary" onClick={handleFeedback}>
            <Icons.Mail size={18} />
            Send Feedback
          </button>
        </div>

        <div className="settings-divider" />

        {/* Developer Info */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Technology</label>
            <p className="settings-description">Built with modern web technologies</p>
          </div>
          <div className="settings-tech-stack">
            <span className="settings-tech-badge">React 18+</span>
            <span className="settings-tech-badge">TypeScript</span>
            <span className="settings-tech-badge">Zustand</span>
            <span className="settings-tech-badge">Vite</span>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Footer */}
        <div className="settings-footer">
          <p>
            Empowering productivity through intelligent design
          </p>
          <p className="settings-copyright">© 2026 LifeOS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
