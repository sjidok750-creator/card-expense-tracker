import type { Expense } from '../types';
import { formatAmount } from './format';

export function exportCSV(expenses: Expense[], filename: string): void {
  const BOM = '\uFEFF';
  const header = '날짜,사용처,금액,카테고리,메모';
  const rows = expenses.map(
    (e) =>
      `${e.date},"${e.merchant}",${formatAmount(e.amount)},${e.category},"${e.memo || ''}"`
  );
  const csv = BOM + [header, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
