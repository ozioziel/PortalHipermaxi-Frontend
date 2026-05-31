import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { InteractionsByDatePoint } from '../types';

interface InteractionsByDateChartProps {
  data: InteractionsByDatePoint[];
}

const InteractionsByDateChart: React.FC<InteractionsByDateChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="admin-chart-empty">No hay datos en el rango seleccionado.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Interacciones']}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 3, fill: '#2563eb' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InteractionsByDateChart;
