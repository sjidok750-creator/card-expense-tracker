import { useRef, useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { categorize } from '../utils/categorize';
import { getToday } from '../utils/format';
import { compressImage } from '../utils/fileOperations';
import ReceiptScanner from './ReceiptScanner';

interface ExpenseFormProps {
  categories: CategoryConfig[];
  onAdd: (expense: Expense) => void;
  apiKey: string;
}

export default function ExpenseForm({ categories, onAdd, apiKey }: ExpenseFormProps) {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getToday());
  const [manualCategory, setManualCategory] = useState<CategoryKey | ''>('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanImage, setScanImage] = useState<{ base64: string; url: string; mediaType: string } | null>(null);
  const scanFileRef = useRef<HTMLInputElement>(null);

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
    };

    onAdd(expense);
    setMerchant('');
    setAmount('');
    setManualCategory('');
  }

  function handleScanFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    compressImage(file)
      .then((compressed) => {
        setScanImage(compressed);
        setShowScanner(true);
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  function handleScannerClose() {
    setShowScanner(false);
    setScanImage(null);
    if (scanFileRef.current) scanFileRef.current.value = '';
  }

  const inputClass = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2';
  const inputBorder = '#E5E8EB';
  const labelStyle: React.CSSProperties = {
    color: '#E8694A',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 400,
  };

  return (
    <>
      <input
        ref={scanFileRef}
        type="file"
        accept="image/*"
        onChange={handleScanFileChange}
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {/* Merchant */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={labelStyle}>
              Merchant
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Starbucks Gangnam"
              className={inputClass}
              style={{ borderColor: inputBorder }}
              onFocus={(e) => (e.target.style.borderColor = '#E8694A')}
              onBlur={(e) => (e.target.style.borderColor = inputBorder)}
              required
            />
            {merchant && autoCategory && !manualCategory && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Auto:{' '}
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: matchedConfig?.color }}
                >
                  {autoCategory}
                </span>
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium mb-1" style={labelStyle}>
              Amount (₩)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="1"
              className={`${inputClass} font-bold text-right`}
              style={{ borderColor: inputBorder, color: 'var(--text-primary)' }}
              onFocus={(e) => (e.target.style.borderColor = '#E8694A')}
              onBlur={(e) => (e.target.style.borderColor = inputBorder)}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium mb-1" style={labelStyle}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              style={{ borderColor: inputBorder, boxSizing: 'border-box', maxWidth: '100%' }}
              onFocus={(e) => (e.target.style.borderColor = '#E8694A')}
              onBlur={(e) => (e.target.style.borderColor = inputBorder)}
            />
          </div>

          {/* Category */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={labelStyle}>
              Category
            </label>
            <select
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value as CategoryKey | '')}
              className={inputClass}
              style={{ borderColor: inputBorder }}
              onFocus={(e) => (e.target.style.borderColor = '#E8694A')}
              onBlur={(e) => (e.target.style.borderColor = inputBorder)}
            >
              <option value="">Auto-classify</option>
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.key}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <button
            type="submit"
            className="flex-1 h-10 text-white font-semibold rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: '#E8694A',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 400,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C9573A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E8694A')}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => scanFileRef.current?.click()}
            className="flex-1 h-10 font-semibold rounded-lg text-sm border-2 transition-colors"
            style={{
              borderColor: '#E8694A',
              color: '#E8694A',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 400,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8694A';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#E8694A';
            }}
          >
            📷 Scan
          </button>
        </div>
      </form>

      {showScanner && scanImage && (
        <ReceiptScanner
          categories={categories}
          onAdd={onAdd}
          onClose={handleScannerClose}
          initialImage={scanImage}
          apiKey={apiKey}
        />
      )}
    </>
  );
}
