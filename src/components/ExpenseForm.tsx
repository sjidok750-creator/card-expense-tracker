import { useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { categorize } from '../utils/categorize';
import { getToday } from '../utils/format';
import ReceiptScanner from './ReceiptScanner';

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
  const [showScanner, setShowScanner] = useState(false);

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
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 space-y-4">
        <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          지출 입력
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              사용처
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="예: 스타벅스 강남점"
              className="w-full h-12 border rounded-xl px-4 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              required
            />
            {merchant && autoCategory && !manualCategory && (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                자동 분류:{' '}
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: matchedConfig?.color }}
                >
                  {autoCategory}
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              금액 (원)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full h-12 border rounded-xl px-4 text-sm font-bold text-right focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB', color: 'var(--text-primary)' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              날짜
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 border rounded-xl px-4 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              카테고리 (수동 선택)
            </label>
            <select
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value as CategoryKey | '')}
              className="w-full h-12 border rounded-xl px-4 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E8EB' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
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
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            메모 (선택)
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="간단한 메모"
            className="w-full h-12 border rounded-xl px-4 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5E8EB' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
            onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-[2] h-14 text-white font-semibold rounded-xl text-base transition-colors"
            style={{ backgroundColor: 'var(--toss-blue)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2968CC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--toss-blue)')}
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex-1 h-14 font-semibold rounded-xl text-base border-2 transition-colors"
            style={{ borderColor: 'var(--toss-blue)', color: 'var(--toss-blue)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--toss-blue)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--toss-blue)';
            }}
          >
            📷 스캔
          </button>
        </div>
      </form>

      {showScanner && (
        <ReceiptScanner
          categories={categories}
          onAdd={onAdd}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
}
