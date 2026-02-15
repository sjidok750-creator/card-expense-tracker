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
      <tr className="border-b border-gray-100">
        <td className="py-2 px-2 text-sm">{expense.date}</td>
        <td className="py-2 px-2">
          <input
            value={editMerchant}
            onChange={(e) => setEditMerchant(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
          />
        </td>
        <td className="py-2 px-2">
          <input
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
          />
        </td>
        <td className="py-2 px-2">
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as CategoryKey)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.key}</option>
            ))}
          </select>
        </td>
        <td className="py-2 px-2 text-sm">
          <div className="flex gap-1">
            <button onClick={handleSave} className="text-blue-600 hover:text-blue-800 text-xs font-medium">저장</button>
            <button onClick={() => setEditing(false)} className="text-gray-500 hover:text-gray-700 text-xs font-medium">취소</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-2 px-2 text-sm text-gray-600">{expense.date}</td>
      <td className="py-2 px-2 text-sm font-medium text-gray-800">
        {expense.merchant}
        {expense.memo && (
          <span className="ml-2 text-xs text-gray-400">({expense.memo})</span>
        )}
      </td>
      <td className="py-2 px-2 text-sm text-right font-mono">{formatAmount(expense.amount)}</td>
      <td className="py-2 px-2">
        <span
          className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-medium"
          style={{ backgroundColor: catConfig?.color }}
        >
          {expense.category}
        </span>
      </td>
      <td className="py-2 px-2 text-sm">
        <div className="flex gap-1">
          <button onClick={() => setEditing(true)} className="text-gray-500 hover:text-blue-600 text-xs">수정</button>
          <button onClick={handleDelete} className="text-gray-500 hover:text-red-600 text-xs">삭제</button>
        </div>
      </td>
    </tr>
  );
}
