import React from 'react';

const MetricCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
};

export default MetricCard;
