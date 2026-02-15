import { useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { categorize } from '../utils/categorize';
import { getToday } from '../utils/format';

interface ExpenseFormProps {
  categories: CategoryConfig[];
  onAdd: (expense: Expense) => void;
}

export default function ExpenseForm({ categories, onAdd }: ExpenseFormProps) {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getToday());
  const [manualCategory, setManualCategory] = useState<CategoryKey | ''>('');
  const [memo, setMemo] = useState('');

  const autoCategory = merchant ? categorize(merchant, categories) : null;
  const finalCategory = manualCategory || autoCategory || '기타';

  const matchedConfig = categories.find((c) => c.key === finalCategory);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!merchant.trim() || !amount || Number(amount) <= 0) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      merchant: merchant.trim(),
      amount: Number(amount),
      date,
      category: finalCategory,
      manualCategory: manualCategory !== '',
      memo: memo.trim() || undefined,
    };

    onAdd(expense);
    setMerchant('');
    setAmount('');
    setManualCategory('');
    setMemo('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">지출 입력</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사용처</label>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="예: 스타벅스 강남점"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {merchant && autoCategory && !manualCategory && (
            <p className="mt-1 text-xs text-gray-500">
              자동 분류:{' '}
              <span
                className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: matchedConfig?.color }}
              >
                {autoCategory}
              </span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">금액 (원)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 (수동 선택)</label>
          <select
            value={manualCategory}
            onChange={(e) => setManualCategory(e.target.value as CategoryKey | '')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">자동 분류</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.key}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="간단한 메모"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
      >
        추가
      </button>
    </form>
  );
}
