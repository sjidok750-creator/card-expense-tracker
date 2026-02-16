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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          카테고리 키워드 관리
        </h2>
        <button
          onClick={handleReset}
          className="text-sm font-semibold transition-colors"
          style={{ color: '#EF4444' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#EF4444')}
        >
          기본값으로 초기화
        </button>
      </div>

      {categories.map((cat) => (
        <div
          key={cat.key}
          className="bg-white rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {cat.key}
            </h3>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              ({cat.keywords.length}개)
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {cat.keywords.length === 0 && (
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                키워드 없음
              </span>
            )}
            {cat.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
              >
                {kw}
                <button
                  onClick={() => removeKeyword(cat.key, kw)}
                  className="hover:text-red-500 font-bold transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
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
                className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E8EB' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
              />
              <button
                onClick={() => addKeyword(cat.key)}
                className="px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'var(--toss-blue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2968CC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--toss-blue)')}
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
