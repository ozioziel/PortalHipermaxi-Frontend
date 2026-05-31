import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CountByModule } from '../types';

interface MostUsedModulesChartProps {
  data: CountByModule[];
}

const COLORS = ['#2563eb', '#0f766e', '#d97706', '#7c3aed', '#059669', '#dc2626', '#475569'];

const MostUsedModulesChart: React.FC<MostUsedModulesChartProps> = ({ data }) => {
  if (data.every((item) => item.count === 0)) {
    return <div className="admin-chart-empty">No hay uso de módulos para mostrar.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis dataKey="module" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Eventos']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.module} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MostUsedModulesChart;
