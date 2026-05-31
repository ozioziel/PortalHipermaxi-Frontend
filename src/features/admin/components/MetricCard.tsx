import React from 'react';
import type { MetricDefinition } from '../types';

const formatMetricValue = (value: number) => value.toLocaleString('es-BO');

const MetricCard: React.FC<MetricDefinition> = ({
  title,
  value,
  delta,
  description,
  accent,
  icon,
}) => {
  return (
    <article className={`admin-metric-card admin-metric-card--${accent}`}>
      <div className="admin-metric-card__top">
        <div>
          <p className="admin-metric-card__title">{title}</p>
          <strong className="admin-metric-card__value">{formatMetricValue(value)}</strong>
        </div>
        <span className="admin-metric-card__icon" aria-hidden="true">
          {icon}
        </span>
      </div>

      <div className="admin-metric-card__footer">
        <span className="admin-metric-card__delta">{delta}</span>
        <p className="admin-metric-card__description">{description}</p>
      </div>
    </article>
  );
};

export default MetricCard;
