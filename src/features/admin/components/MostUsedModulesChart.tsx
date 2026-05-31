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

const COLORS = ['#f66014', '#0f9d58', '#f9a826', '#334155', '#ff7a3d', '#1f7a4c', '#7c3aed'];

const MostUsedModulesChart: React.FC<MostUsedModulesChartProps> = ({ data }) => {
  if (data.every((item) => item.count === 0)) {
    return <div className="admin-chart-empty">No hay uso de módulos para mostrar.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis dataKey="module" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Eventos']}
        />
        <Bar dataKey="count" radius={[10, 10, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.module} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MostUsedModulesChart;
