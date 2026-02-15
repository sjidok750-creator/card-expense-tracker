import type { CategoryConfig, CategoryKey } from '../types';
import MonthPicker from './MonthPicker';
import MonthlySummary from './MonthlySummary';
import PieChartCard from './PieChartCard';
import BarChartCard from './BarChartCard';

interface DashboardProps {
  month: string;
  onMonthChange: (m: string) => void;
  summary: Record<CategoryKey, number>;
  barChartData: Array<{ month: string; total: number } & Record<CategoryKey, number>>;
  categories: CategoryConfig[];
}

export default function Dashboard({
  month,
  onMonthChange,
  summary,
  barChartData,
  categories,
}: DashboardProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">대시보드</h2>
        <MonthPicker value={month} onChange={onMonthChange} />
      </div>
      <MonthlySummary summary={summary} categories={categories} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PieChartCard summary={summary} categories={categories} />
        <BarChartCard data={barChartData} categories={categories} />
      </div>
    </div>
  );
}
