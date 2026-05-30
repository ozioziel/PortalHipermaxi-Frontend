import React from 'react';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const AppButton: React.FC<AppButtonProps> = ({variant = 'primary', children, ...rest}) => {
  const className = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`;
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};

export default AppButton;
