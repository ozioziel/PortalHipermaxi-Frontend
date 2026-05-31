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

const COLORS = ['#f66014', '#0f9d58', '#f9a826', '#334155', '#ff9f6b', '#4b8a5b', '#d94f30', '#94a3b8'];

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
          innerRadius={70}
          outerRadius={106}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Eventos']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventsByTypeChart;
