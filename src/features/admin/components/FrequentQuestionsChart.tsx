import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FrequentQuestionItem } from '../types';

interface FrequentQuestionsChartProps {
  data: FrequentQuestionItem[];
}

const FrequentQuestionsChart: React.FC<FrequentQuestionsChartProps> = ({ data }) => {
  const topQuestions = data.slice(0, 6).map((item) => ({
    shortQuestion: item.question.length > 32 ? `${item.question.slice(0, 32)}...` : item.question,
    count: item.count,
  }));

  if (topQuestions.length === 0) {
    return <div className="admin-chart-empty">No hay preguntas frecuentes para este filtro.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topQuestions} layout="vertical" margin={{ left: 8, right: 8 }}>
        <CartesianGrid horizontal={false} stroke="#e8ebef" strokeDasharray="4 4" />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="shortQuestion"
          width={168}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #d9dde3' }}
          formatter={(value) => [`${value ?? 0}`, 'Consultas']}
        />
        <Bar dataKey="count" fill="#0f766e" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FrequentQuestionsChart;
