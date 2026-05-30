import React from 'react';
import AppCard from '../../../core/components/ui/AppCard';

export interface FeatureCardProps {
  title: string;
  description: string;
  accent?: 'orange' | 'blue';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({title, description}) => {
  return (
    <AppCard className="feature-card">
      <h3 style={{margin:'0 0 6px 0'}}>{title}</h3>
      <p className="text-muted" style={{margin:0}}>{description}</p>
    </AppCard>
  );
};

export default FeatureCard;
