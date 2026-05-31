import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
  return (
    <section className="admin-chart-card">
      <div className="admin-chart-card__header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="admin-chart-card__body">{children}</div>
    </section>
  );
};

export default ChartCard;
