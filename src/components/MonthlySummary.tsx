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
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          카테고리별 합계
        </h3>
        <p className="text-center py-8 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          데이터가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        카테고리별 합계
      </h3>
      <div className="space-y-3">
        {sorted.map((cat) => {
          const amount = summary[cat.key];
          const pct = ((amount / total) * 100).toFixed(1);
          return (
            <div key={cat.key} className="flex items-center gap-3">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm font-semibold w-20" style={{ color: 'var(--text-secondary)' }}>
                {cat.key}
              </span>
              <div className="flex-1 rounded-full h-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="text-base font-bold font-mono w-28 text-right" style={{ color: 'var(--text-primary)' }}>
                {formatAmount(amount)}
              </span>
              <span className="text-sm font-medium w-12 text-right" style={{ color: 'var(--text-tertiary)' }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-4 flex justify-between items-center" style={{ borderTop: '1px solid var(--bg-secondary)' }}>
        <span className="text-base font-bold" style={{ color: 'var(--text-secondary)' }}>총 합계</span>
        <span className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
          {formatAmount(total)}
        </span>
      </div>
    </div>
  );
}
