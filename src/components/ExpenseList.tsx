import type { CategoryConfig, Expense } from '../types';
import { formatAmount } from '../utils/format';
import { exportToExcel } from '../utils/excel';
import ExpenseRow from './ExpenseRow';

interface ExpenseListProps {
  expenses: Expense[];
  month: string;
  onMonthChange: (m: string) => void;
  categories: CategoryConfig[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 400,
};

function shiftMonth(value: string, delta: number): string {
  const [y, m] = value.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
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

  const [y, mo] = month.split('-');
  const displayMonth = `${y.slice(2)}/${mo}`;

  function handleExportExcel() {
    exportToExcel(filtered, `expense_${month}.xlsx`);
  }

  const navBtn: React.CSSProperties = {
    ...MONO,
    color: '#E8694A',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0 4px',
    lineHeight: 1,
  };

  const monthBadge: React.CSSProperties = {
    ...MONO,
    color: '#E8694A',
    backgroundColor: '#F2F4F6',
    borderRadius: '6px',
    padding: '2px 10px',
    fontSize: '13px',
    letterSpacing: '0.03em',
  };

  const totalBadge: React.CSSProperties = {
    ...MONO,
    color: '#E8694A',
    backgroundColor: '#F2F4F6',
    borderRadius: '6px',
    padding: '2px 10px',
    fontSize: '12px',
  };

  return (
    <div className="bg-white rounded-2xl p-3 mt-3">
      {/* Header row: month nav + total */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <button style={navBtn} onClick={() => onMonthChange(shiftMonth(month, -1))}>‹</button>
          <span style={monthBadge}>{displayMonth}</span>
          <button style={navBtn} onClick={() => onMonthChange(shiftMonth(month, 1))}>›</button>
        </div>
        <span style={totalBadge}>
          {formatAmount(total)} · {filtered.length} items
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-6 text-xs" style={{ ...MONO, color: '#E8694A', opacity: 0.5 }}>
          No records for this month.
        </p>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#F2F4F6' }}>
                  {['Date', 'Merchant', 'Amt', 'Cat'].map((h, i) => (
                    <th
                      key={h}
                      className={`py-1 px-2 text-xs font-semibold uppercase${i === 2 ? ' text-right' : ' text-left'}`}
                      style={{ ...MONO, color: '#E8694A', opacity: 0.6 }}
                    >
                      {h}
                    </th>
                  ))}
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
                    mode="table"
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: card */}
          <div className="md:hidden space-y-1">
            {filtered.map((e) => (
              <ExpenseRow
                key={e.id}
                expense={e}
                categories={categories}
                onUpdate={onUpdate}
                onDelete={onDelete}
                mode="card"
              />
            ))}
          </div>

          {/* Excel export at bottom */}
          <div className="mt-3 pt-2 border-t flex justify-end" style={{ borderColor: '#F2F4F6' }}>
            <button
              onClick={handleExportExcel}
              className="px-4 py-1 rounded-md text-xs transition-colors"
              style={{
                ...MONO,
                color: '#E8694A',
                backgroundColor: '#F2F4F6',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid #E8694A')}
              onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid transparent')}
            >
              Export Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
