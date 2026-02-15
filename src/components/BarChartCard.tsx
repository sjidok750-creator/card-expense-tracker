import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { CategoryConfig, CategoryKey } from '../types';
import { formatAmount, getMonthLabel } from '../utils/format';

interface BarChartCardProps {
  data: Array<{ month: string; total: number } & Record<CategoryKey, number>>;
  categories: CategoryConfig[];
}

export default function BarChartCard({ data, categories }: BarChartCardProps) {
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">월별 추이 (6개월)</h3>
        <p className="text-center py-8 text-gray-400 text-sm">데이터가 없습니다.</p>
      </div>
    );
  }

  const activeCats = categories.filter((c) =>
    data.some((d) => (d as Record<string, number>)[c.key] > 0)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">월별 추이 (6개월)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={(m: string) => getMonthLabel(m).replace(/^\d+년 /, '')}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}만`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) => [formatAmount(value as number), name as string]}
            labelFormatter={(label) => getMonthLabel(label as string)}
          />
          {activeCats.map((cat) => (
            <Bar
              key={cat.key}
              dataKey={cat.key}
              stackId="a"
              fill={cat.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
