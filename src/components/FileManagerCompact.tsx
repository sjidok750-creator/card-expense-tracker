import { useState } from 'react';
import type { Expense, CategoryConfig } from '../types';
import { exportToFile, importFromFile } from '../utils/fileOperations';
import { exportToExcel } from '../utils/excel';

interface FileManagerCompactProps {
  expenses: Expense[];
  categories: CategoryConfig[];
  onImport: (expenses: Expense[], categories: CategoryConfig[]) => void;
  onClear: () => void;
}

export default function FileManagerCompact({
  expenses,
  categories,
  onImport,
  onClear,
}: FileManagerCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    try {
      exportToFile(expenses, categories);
      setMessage({ type: 'success', text: '파일이 성공적으로 저장되었습니다.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '파일 저장에 실패했습니다.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = async () => {
    try {
      const data = await importFromFile();
      onImport(data.expenses, data.categories);
      setMessage({
        type: 'success',
        text: `파일을 불러왔습니다. (${data.expenses.length}개의 내역)`
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '파일 불러오기에 실패했습니다.';
      setMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleClear = () => {
    if (window.confirm('모든 데이터를 삭제하고 새로 시작하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      onClear();
      setMessage({ type: 'success', text: '모든 데이터가 삭제되었습니다.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleExportAllExcel = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      exportToExcel(expenses, `전체지출내역_${today}.xlsx`);
      setMessage({ type: 'success', text: 'Excel 파일이 다운로드되었습니다.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Excel 내보내기에 실패했습니다.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 mt-6">
      {message && (
        <div
          className={`mb-4 p-3 rounded-xl font-semibold text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📁</span>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            파일 관리
          </h2>
        </div>
        <span
          className="text-2xl transition-transform"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-tertiary)'
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: 'var(--toss-blue)',
                color: 'white'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2968CC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--toss-blue)')}
            >
              💾 백업 저장
            </button>

            <button
              onClick={handleImport}
              className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: '#10B981',
                color: 'white'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
            >
              📂 불러오기
            </button>

            <button
              onClick={handleExportAllExcel}
              className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: '#8B5CF6',
                color: 'white'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7C3AED')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8B5CF6')}
            >
              📊 Excel 내보내기
            </button>

            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: '#EF4444',
                color: 'white'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
            >
              🗑️ 전체 삭제
            </button>
          </div>

          <div
            className="p-4 rounded-xl text-sm"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span className="font-semibold">
                지출: <span style={{ color: 'var(--text-primary)' }}>{expenses.length}건</span>
              </span>
              <span className="font-semibold">
                카테고리: <span style={{ color: 'var(--text-primary)' }}>{categories.length}개</span>
              </span>
              <span className="font-semibold">
                총액: <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}원
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
