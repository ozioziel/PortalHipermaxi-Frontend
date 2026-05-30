import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AppCard: React.FC<AppCardProps> = ({children, className = ''}) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export default AppCard;
