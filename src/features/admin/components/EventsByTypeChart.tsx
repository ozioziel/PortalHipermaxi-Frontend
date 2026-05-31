import React from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CountByLabel } from '../types';

interface EventsByTypeChartProps {
  data: CountByLabel[];
}

const COLORS = ['#2563eb', '#0f766e', '#d97706', '#7c3aed', '#059669', '#dc2626', '#475569', '#0891b2'];

const EventsByTypeChart: React.FC<EventsByTypeChartProps> = ({ data }) => {
  if (data.every((item) => item.count === 0)) {
    return <div className="admin-chart-empty">No hay tipos de evento disponibles.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          innerRadius={66}
          outerRadius={102}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Eventos']}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventsByTypeChart;
