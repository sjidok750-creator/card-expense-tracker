import { useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { formatAmount } from '../utils/format';

interface ExpenseRowProps {
  expense: Expense;
  categories: CategoryConfig[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseRow({ expense, categories, onUpdate, onDelete }: ExpenseRowProps) {
  const [editing, setEditing] = useState(false);
  const [editMerchant, setEditMerchant] = useState(expense.merchant);
  const [editAmount, setEditAmount] = useState(String(expense.amount));
  const [editCategory, setEditCategory] = useState(expense.category);

  const catConfig = categories.find((c) => c.key === expense.category);

  function handleSave() {
    onUpdate(expense.id, {
      merchant: editMerchant.trim(),
      amount: Number(editAmount),
      category: editCategory,
      manualCategory: editCategory !== expense.category || expense.manualCategory,
    });
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`"${expense.merchant}" 지출을 삭제하시겠습니까?`)) {
      onDelete(expense.id);
    }
  }

  if (editing) {
    return (
      <tr className="border-b" style={{ borderColor: '#F2F4F6' }}>
        <td className="py-3 px-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{expense.date}</td>
        <td className="py-3 px-3">
          <input
            value={editMerchant}
            onChange={(e) => setEditMerchant(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5E8EB' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
            onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
          />
        </td>
        <td className="py-3 px-3">
          <input
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-28 text-right font-bold focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5E8EB' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
            onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
          />
        </td>
        <td className="py-3 px-3">
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as CategoryKey)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5E8EB' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
            onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.key}</option>
            ))}
          </select>
        </td>
        <td className="py-3 px-3 text-sm">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--toss-blue)' }}
            >
              저장
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              취소
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className="border-b transition-colors"
      style={{ borderColor: '#F2F4F6' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <td className="py-3 px-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{expense.date}</td>
      <td className="py-3 px-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {expense.merchant}
        {expense.memo && (
          <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>({expense.memo})</span>
        )}
      </td>
      <td className="py-3 px-3 text-lg text-right font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
        {formatAmount(expense.amount)}
      </td>
      <td className="py-3 px-3">
        <span
          className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold"
          style={{ backgroundColor: catConfig?.color }}
        >
          {expense.category}
        </span>
      </td>
      <td className="py-3 px-3 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--toss-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}
