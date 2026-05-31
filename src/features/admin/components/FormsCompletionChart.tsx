import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FormStats } from '../types';

interface FormsCompletionChartProps {
  data: FormStats[];
}

const FormsCompletionChart: React.FC<FormsCompletionChartProps> = ({ data }) => {
  if (data.every((item) => item.started === 0 && item.completed === 0)) {
    return <div className="admin-chart-empty">No hubo formularios en este período.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #d9dde3' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="started" name="Iniciados" fill="#d97706" radius={[6, 6, 0, 0]} />
        <Bar dataKey="completed" name="Completados" fill="#0f766e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FormsCompletionChart;
