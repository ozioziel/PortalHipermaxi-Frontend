import React from 'react';
import AppCard from '../../../core/components/ui/AppCard';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  accent?: 'orange' | 'blue';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({title, description, icon = '◆'}) => {
  return (
    <AppCard className="feature-card">
      <div className="feature-icon" aria-hidden>{icon}</div>
      <h3 style={{margin:'2px 0 4px 0'}}>{title}</h3>
      <p className="text-muted" style={{margin:0,fontSize:14}}>{description}</p>
    </AppCard>
  );
};

export default FeatureCard;
