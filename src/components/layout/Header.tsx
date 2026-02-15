import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightAction }) => {
  return (
    <div className="flex flex-row items-center gap-lg" style={{ flex: 1 }}>
      <div className="flex flex-col items-start" style={{ flex: 1 }}>
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      {rightAction && <div className="header-action">{rightAction}</div>}
    </div>
  );
};
