import type { CategoryConfig, Expense } from '../types';
import { formatAmount } from '../utils/format';
import { exportCSV } from '../utils/csv';
import { exportToExcel } from '../utils/excel';
import ExpenseRow from './ExpenseRow';
import MonthPicker from './MonthPicker';

interface ExpenseListProps {
  expenses: Expense[];
  month: string;
  onMonthChange: (m: string) => void;
  categories: CategoryConfig[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({
  expenses,
  month,
  onMonthChange,
  categories,
  onUpdate,
  onDelete,
}: ExpenseListProps) {
  const filtered = expenses
    .filter((e) => e.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  function handleExportCSV() {
    exportCSV(filtered, `지출내역_${month}.csv`);
  }

  function handleExportExcel() {
    exportToExcel(filtered, `지출내역_${month}.xlsx`);
  }

  return (
    <div className="bg-white rounded-2xl p-6 mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            지출 목록
          </h2>
          <MonthPicker value={month} onChange={onMonthChange} />
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            합계: <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatAmount(total)}</span>
            {' '}({filtered.length}건)
          </span>
          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E8EB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
              >
                CSV 내보내기
              </button>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 text-white rounded-xl font-semibold text-sm transition-colors"
                style={{ backgroundColor: 'var(--toss-blue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2968CC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--toss-blue)')}
              >
                📊 Excel 내보내기
              </button>
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          이 달의 지출 내역이 없습니다.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#F2F4F6' }}>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>날짜</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>사용처</th>
                <th className="text-right py-3 px-3 text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>금액</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>카테고리</th>
                <th className="py-3 px-3 text-xs font-semibold uppercase w-20" style={{ color: 'var(--text-tertiary)' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <ExpenseRow
                  key={e.id}
                  expense={e}
                  categories={categories}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
