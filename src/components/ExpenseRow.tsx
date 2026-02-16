import { useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { formatAmount } from '../utils/format';

interface ExpenseRowProps {
  expense: Expense;
  categories: CategoryConfig[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
  mode?: 'table' | 'card';
}

export default function ExpenseRow({ expense, categories, onUpdate, onDelete, mode = 'table' }: ExpenseRowProps) {
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

  // 편집 모드
  if (editing) {
    if (mode === 'table') {
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

    // Card mode editing
    return (
      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-tertiary)' }}>사용처</label>
              <input
                value={editMerchant}
                onChange={(e) => setEditMerchant(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-tertiary)' }}>금액</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full text-right font-bold focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-tertiary)' }}>카테고리</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as CategoryKey)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.key}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors"
                style={{ backgroundColor: 'var(--toss-blue)' }}
              >
                저장
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                style={{ backgroundColor: '#E5E8EB', color: 'var(--text-secondary)' }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
    );
  }

  // 일반 모드
  if (mode === 'table') {
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

  // Card mode
  return (
    <div className="p-4 rounded-xl transition-colors" style={{ backgroundColor: 'white', border: '1px solid #F2F4F6' }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{expense.date}</div>
            <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{expense.merchant}</div>
            {expense.memo && (
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>({expense.memo})</div>
            )}
          </div>
          <div className="text-right ml-3">
            <div className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {formatAmount(expense.amount)}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid #F2F4F6' }}>
          <span
            className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: catConfig?.color }}
          >
            {expense.category}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-semibold transition-colors"
              style={{ color: 'var(--toss-blue)' }}
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="text-sm font-semibold transition-colors"
              style={{ color: '#EF4444' }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
  );
}
