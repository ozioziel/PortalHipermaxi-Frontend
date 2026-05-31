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
import type { CountByLabel } from '../types';

interface AiUsageChartProps {
  data: CountByLabel[];
}

const getColor = (label: string) => {
  if (label.includes('Errores')) return '#e05a47';
  if (label.includes('Fallback')) return '#f9a826';
  if (label.includes('WhatsApp')) return '#0f9d58';
  if (label.includes('Correo')) return '#f66014';
  if (label.includes('Llamada')) return '#334155';
  return '#0f9d58';
};

const AiUsageChart: React.FC<AiUsageChartProps> = ({ data }) => {
  if (data.every((item) => item.count === 0)) {
    return <div className="admin-chart-empty">No hay actividad del asistente para mostrar.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Eventos']}
        />
        <Bar dataKey="count" radius={[10, 10, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={getColor(entry.label)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AiUsageChart;
