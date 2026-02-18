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
          <td className="py-1.5 px-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{expense.date}</td>
          <td className="py-1.5 px-2">
            <input
              value={editMerchant}
              onChange={(e) => setEditMerchant(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
            />
          </td>
          <td className="py-1.5 px-2">
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm w-24 text-right font-bold focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
            />
          </td>
          <td className="py-1.5 px-2">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as CategoryKey)}
              className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>{c.key}</option>
              ))}
            </select>
          </td>
          <td className="py-1.5 px-2 text-sm">
            <div className="flex gap-1.5">
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
      <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-semibold block mb-0.5" style={{ color: 'var(--text-tertiary)' }}>사용처</label>
              <input
                value={editMerchant}
                onChange={(e) => setEditMerchant(e.target.value)}
                className="border rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-0.5" style={{ color: 'var(--text-tertiary)' }}>금액</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="border rounded-lg px-2 py-1.5 text-sm w-full text-right font-bold focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-0.5" style={{ color: 'var(--text-tertiary)' }}>카테고리</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as CategoryKey)}
                className="border rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.key}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 rounded-lg font-semibold text-sm text-white transition-colors"
                style={{ backgroundColor: 'var(--toss-blue)' }}
              >
                저장
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors"
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
        <td className="py-1.5 px-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{expense.date}</td>
        <td className="py-1.5 px-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {expense.merchant}
          {expense.memo && (
            <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>({expense.memo})</span>
          )}
        </td>
        <td className="py-1.5 px-2 text-base text-right font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
          {formatAmount(expense.amount)}
        </td>
        <td className="py-1.5 px-2">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: catConfig?.color }}
          >
            {expense.category}
          </span>
        </td>
        <td className="py-1.5 px-2 text-sm">
          <div className="flex gap-1.5">
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
    <div className="p-2 rounded-lg transition-colors flex items-center gap-1.5" style={{ backgroundColor: 'white', border: '1px solid #F2F4F6' }}>
      {/* 날짜 */}
      <div className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', width: '38px', fontSize: '11px' }}>
        {expense.date.slice(5)}
      </div>

      {/* 사용처 + 카테고리 */}
      <div className="flex-1 min-w-0 flex items-center gap-1">
        <div className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
          {expense.merchant}
        </div>
        <span
          className="inline-block px-1.5 py-0.5 rounded-full text-white shrink-0"
          style={{ backgroundColor: catConfig?.color, fontSize: '10px', fontWeight: '600' }}
        >
          {expense.category}
        </span>
        {expense.memo && (
          <div className="text-xs truncate" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>({expense.memo})</div>
        )}
      </div>

      {/* 금액 */}
      <div className="text-sm font-bold font-mono shrink-0" style={{ color: 'var(--text-primary)', minWidth: '60px', textAlign: 'right', fontSize: '13px' }}>
        {formatAmount(expense.amount)}
      </div>

      {/* 버튼 - 아이콘 형태 */}
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-xs font-semibold transition-colors px-1"
          style={{ color: 'var(--toss-blue)', fontSize: '16px' }}
          title="수정"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="text-xs font-semibold transition-colors px-1"
          style={{ color: '#EF4444', fontSize: '16px' }}
          title="삭제"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
