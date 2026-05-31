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
  if (label.includes('Errores')) return '#dc2626';
  if (label.includes('Fallback')) return '#d97706';
  if (label.includes('WhatsApp')) return '#059669';
  if (label.includes('Correo')) return '#2563eb';
  if (label.includes('Llamada')) return '#475569';
  return '#0f766e';
};

const AiUsageChart: React.FC<AiUsageChartProps> = ({ data }) => {
  if (data.every((item) => item.count === 0)) {
    return <div className="admin-chart-empty">No hay actividad del asistente para mostrar.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Eventos']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={getColor(entry.label)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AiUsageChart;
