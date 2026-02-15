import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, type PieLabelRenderProps } from 'recharts';
import type { CategoryConfig, CategoryKey } from '../types';
import { formatAmount } from '../utils/format';

interface PieChartCardProps {
  summary: Record<CategoryKey, number>;
  categories: CategoryConfig[];
}

export default function PieChartCard({ summary, categories }: PieChartCardProps) {
  const data = categories
    .filter((c) => summary[c.key] > 0)
    .map((c) => ({ name: c.key, value: summary[c.key], color: c.color }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">카테고리 비율</h3>
        <p className="text-center py-8 text-gray-400 text-sm">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">카테고리 비율</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label={(props: PieLabelRenderProps) => `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatAmount(value as number)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
