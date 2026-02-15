import React from 'react';
import { Icons } from '../../utils/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'sm-modal',
    md: 'md-modal',
    lg: 'lg-modal',
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* Modal Content */}
      <div 
        className={`modal-content ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="modal-close"
              aria-label="Close modal"
            >
              <Icons.Close size={24} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 'var(--space-md)', justifyContent: 'flex-end', paddingTop: 'var(--space-lg)', borderTopWidth: '1px', borderTopColor: 'var(--border-color)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
