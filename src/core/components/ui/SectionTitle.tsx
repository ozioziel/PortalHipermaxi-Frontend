import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({title, subtitle}) => {
  return (
    <div style={{marginBottom:12}}>
      <h2 style={{margin:0}}>{title}</h2>
      {subtitle && <p className="text-muted" style={{margin:0}}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
