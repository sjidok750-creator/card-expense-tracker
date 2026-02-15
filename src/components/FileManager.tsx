import { useState } from 'react';
import type { Expense, CategoryConfig } from '../types';
import { exportToFile, importFromFile } from '../utils/fileOperations';

interface FileManagerProps {
  expenses: Expense[];
  categories: CategoryConfig[];
  onImport: (expenses: Expense[], categories: CategoryConfig[]) => void;
  onClear: () => void;
}

export default function FileManager({
  expenses,
  categories,
  onImport,
  onClear,
}: FileManagerProps) {
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">파일 관리</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-gray-700">데이터 백업</h3>
          <p className="text-sm text-gray-600 mb-2">
            현재 저장된 모든 내역과 카테고리를 파일로 저장합니다.
          </p>
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            💾 파일로 저장하기
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700">데이터 불러오기</h3>
          <p className="text-sm text-gray-600 mb-2">
            이전에 저장한 파일을 불러옵니다. 현재 데이터는 덮어씌워집니다.
          </p>
          <button
            onClick={handleImport}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📂 파일 불러오기
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700">새 파일</h3>
          <p className="text-sm text-gray-600 mb-2">
            모든 데이터를 삭제하고 새로 시작합니다. 삭제 전에 꼭 백업하세요!
          </p>
          <button
            onClick={handleClear}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ 모든 데이터 삭제
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700">현재 상태</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 총 내역: {expenses.length}개</p>
            <p>• 총 카테고리: {categories.length}개</p>
            <p>• 총 금액: {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}원</p>
          </div>
        </div>
      </div>
    </div>
  );
}
