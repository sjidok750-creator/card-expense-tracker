import type { CategoryConfig, Expense } from '../types';
import { formatAmount } from '../utils/format';
import { exportCSV } from '../utils/csv';
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

  function handleExport() {
    exportCSV(filtered, `지출내역_${month}.csv`);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">지출 목록</h2>
          <MonthPicker value={month} onChange={onMonthChange} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            합계: <span className="font-semibold text-gray-800">{formatAmount(total)}</span>
            ({filtered.length}건)
          </span>
          {filtered.length > 0 && (
            <button
              onClick={handleExport}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              CSV 내보내기
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-8 text-gray-400 text-sm">
          이 달의 지출 내역이 없습니다.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">날짜</th>
                <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">사용처</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">금액</th>
                <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">카테고리</th>
                <th className="py-2 px-2 text-xs font-medium text-gray-500 uppercase w-20"></th>
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
