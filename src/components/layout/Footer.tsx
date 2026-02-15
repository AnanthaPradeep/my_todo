import React from 'react';
import { Icons } from '../../utils/icons';
import '../../styles/footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Copyright & Version */}
        <div className="footer-section footer-left">
          <div className="footer-copyright">
            <span>© {currentYear} LifeOS</span>
            <span className="footer-divider">·</span>
            <span className="footer-version">v1.0.0</span>
          </div>
          <span className="footer-tagline">Your life, organized</span>
        </div>

        {/* Center Section - Quick Links */}
        <div className="footer-section footer-center">
          <nav className="footer-links">
            <a href="#privacy" className="footer-link">
              Privacy
            </a>
            <span className="footer-link-divider">·</span>
            <a href="#terms" className="footer-link">
              Terms
            </a>
            <span className="footer-link-divider">·</span>
            <a href="#changelog" className="footer-link">
              Changelog
            </a>
          </nav>
        </div>

        {/* Right Section - Social Icons & Feedback */}
        <div className="footer-section footer-right">
          <div className="footer-social">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <Icons.Github size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Twitter"
            >
              <Icons.Twitter size={18} />
            </a>
          </div>
          <button className="footer-feedback-button">
            <Icons.MessageSquare size={16} />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="footer-divider-line" />
    </footer>
  );
};
