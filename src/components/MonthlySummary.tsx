import type { CategoryConfig, CategoryKey } from '../types';
import { formatAmount } from '../utils/format';

interface MonthlySummaryProps {
  summary: Record<CategoryKey, number>;
  categories: CategoryConfig[];
}

export default function MonthlySummary({ summary, categories }: MonthlySummaryProps) {
  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  const sorted = categories
    .filter((c) => summary[c.key] > 0)
    .sort((a, b) => summary[b.key] - summary[a.key]);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">카테고리별 합계</h3>
        <p className="text-center py-4 text-gray-400 text-sm">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">카테고리별 합계</h3>
      <div className="space-y-2">
        {sorted.map((cat) => {
          const amount = summary[cat.key];
          const pct = ((amount / total) * 100).toFixed(1);
          return (
            <div key={cat.key} className="flex items-center gap-3">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm text-gray-700 w-20">{cat.key}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="text-sm font-mono text-gray-800 w-28 text-right">
                {formatAmount(amount)}
              </span>
              <span className="text-xs text-gray-500 w-12 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-800">총 합계</span>
        <span className="text-sm font-semibold font-mono text-gray-800">{formatAmount(total)}</span>
      </div>
    </div>
  );
}
