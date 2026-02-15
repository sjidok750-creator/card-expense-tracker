import { useState } from 'react';
import type { CategoryConfig } from '../types';

interface CategoryManagerProps {
  categories: CategoryConfig[];
  onUpdate: (categories: CategoryConfig[]) => void;
  onReset: () => void;
}

export default function CategoryManager({ categories, onUpdate, onReset }: CategoryManagerProps) {
  const [newKeywords, setNewKeywords] = useState<Record<string, string>>({});

  function addKeyword(catKey: string) {
    const kw = (newKeywords[catKey] || '').trim();
    if (!kw) return;

    const updated = categories.map((c) =>
      c.key === catKey && !c.keywords.includes(kw)
        ? { ...c, keywords: [...c.keywords, kw] }
        : c
    );
    onUpdate(updated);
    setNewKeywords((prev) => ({ ...prev, [catKey]: '' }));
  }

  function removeKeyword(catKey: string, keyword: string) {
    const updated = categories.map((c) =>
      c.key === catKey
        ? { ...c, keywords: c.keywords.filter((k) => k !== keyword) }
        : c
    );
    onUpdate(updated);
  }

  function handleReset() {
    if (window.confirm('카테고리 키워드를 기본값으로 초기화하시겠습니까?')) {
      onReset();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">카테고리 키워드 관리</h2>
        <button
          onClick={handleReset}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          기본값으로 초기화
        </button>
      </div>

      {categories.map((cat) => (
        <div
          key={cat.key}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <h3 className="font-medium text-gray-800">{cat.key}</h3>
            <span className="text-xs text-gray-400">({cat.keywords.length}개)</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {cat.keywords.length === 0 && (
              <span className="text-xs text-gray-400">키워드 없음</span>
            )}
            {cat.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {kw}
                <button
                  onClick={() => removeKeyword(cat.key, kw)}
                  className="text-gray-400 hover:text-red-500 font-bold ml-0.5"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {cat.key !== '기타' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeywords[cat.key] || ''}
                onChange={(e) =>
                  setNewKeywords((prev) => ({ ...prev, [cat.key]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword(cat.key);
                  }
                }}
                placeholder="새 키워드 입력"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => addKeyword(cat.key)}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                추가
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
