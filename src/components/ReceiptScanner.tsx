import { useRef, useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { categorize } from '../utils/categorize';
import { getToday } from '../utils/format';

interface ScanResult {
  merchant: string | null;
  amount: number | null;
  date: string | null;
  memo: string | null;
  error?: string;
}

interface ReceiptScannerProps {
  categories: CategoryConfig[];
  onAdd: (expense: Expense) => void;
  onClose: () => void;
}

export default function ReceiptScanner({ categories, onAdd, onClose }: ReceiptScannerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [showChoice, setShowChoice] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // 검토 폼 상태
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getToday());
  const [manualCategory, setManualCategory] = useState<CategoryKey | ''>('');
  const [memo, setMemo] = useState('');

  const autoCategory = merchant ? categorize(merchant, categories) : null;
  const finalCategory = manualCategory || autoCategory || '기타';
  const matchedConfig = categories.find((c) => c.key === finalCategory);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShowChoice(false);
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScanResult(null);

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setMediaType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      const base64 = result.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mediaType }),
      });

      if (!res.ok) throw new Error('분석 실패');

      const data = await res.json() as ScanResult;

      if (data.error) {
        setError(data.error);
        return;
      }

      setScanResult(data);
      setMerchant(data.merchant ?? '');
      setAmount(data.amount != null ? String(data.amount) : '');
      setDate(data.date ?? getToday());
      setMemo(data.memo ?? '');
      setManualCategory('');
    } catch {
      setError('영수증 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm() {
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
    onClose();
  }

  function resetImage() {
    setImageUrl(null);
    setImageBase64(null);
    setError(null);
    setScanResult(null);
    setShowChoice(true);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  }

  const inputStyle = {
    borderColor: '#E5E8EB',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 max-h-[92vh] overflow-y-auto space-y-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            영수증 스캔
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Step 1: 촬영 or 앨범 선택 */}
        {!imageUrl && showChoice && (
          <div className="space-y-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-4 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <span className="text-3xl">📷</span>
              <div className="text-left">
                <p className="text-sm font-bold">카메라로 촬영</p>
                <p className="text-xs text-gray-400">지금 영수증을 찍어요</p>
              </div>
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-4 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <span className="text-3xl">🖼️</span>
              <div className="text-left">
                <p className="text-sm font-bold">앨범에서 선택</p>
                <p className="text-xs text-gray-400">저장된 사진을 불러와요</p>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: 미리보기 + 분석 */}
        {imageUrl && !scanResult && (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt="영수증"
              className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
            />

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={resetImage}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                다시 선택
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-[2] h-12 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: loading ? '#93c5fd' : 'var(--toss-blue)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    분석 중...
                  </span>
                ) : (
                  '분석하기'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 검토 및 확인 */}
        {scanResult && (
          <div className="space-y-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="영수증"
                className="w-full max-h-28 object-contain rounded-xl border border-gray-200"
              />
            )}

            <p className="text-xs font-semibold text-green-700 bg-green-50 rounded-xl px-3 py-2">
              ✓ 분석 완료 — 내용을 확인하고 수정하세요
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  사용처
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
                />
                {merchant && autoCategory && !manualCategory && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
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
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  금액 (원)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm font-bold text-right focus:outline-none focus:ring-2"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  카테고리
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as CategoryKey | '')}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
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

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  메모 (선택)
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={!merchant.trim() || !amount || Number(amount) <= 0}
                className="flex-[2] h-12 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{
                  backgroundColor:
                    !merchant.trim() || !amount || Number(amount) <= 0
                      ? '#93c5fd'
                      : 'var(--toss-blue)',
                }}
              >
                추가
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
