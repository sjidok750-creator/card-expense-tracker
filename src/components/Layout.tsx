import { useRef } from 'react';
import type { TabKey } from '../types';

interface LayoutProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: React.ReactNode;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'input', label: '입력/목록' },
  { key: 'dashboard', label: '대시보드' },
  { key: 'settings', label: '카테고리 설정' },
];

const tabOrder: TabKey[] = ['input', 'dashboard', 'settings'];

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  const touchStartX = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 60) return;
    const currentIndex = tabOrder.indexOf(activeTab);
    if (diff > 0 && currentIndex < tabOrder.length - 1) {
      onTabChange(tabOrder[currentIndex + 1]);
    } else if (diff < 0 && currentIndex > 0) {
      onTabChange(tabOrder[currentIndex - 1]);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <header className="bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>
            카드 지출 관리
          </h1>
          <nav className="flex gap-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`pb-3 text-base font-medium transition-all ${
                  activeTab === tab.key
                    ? 'font-bold border-b-2'
                    : 'font-medium'
                }`}
                style={{
                  color: activeTab === tab.key ? 'var(--toss-blue)' : 'var(--text-secondary)',
                  borderColor: activeTab === tab.key ? 'var(--toss-blue)' : 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main
        className="max-w-4xl mx-auto px-6 py-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </main>
    </div>
  );
}
