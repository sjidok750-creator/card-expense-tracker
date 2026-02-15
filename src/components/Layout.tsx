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

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-bold py-3 text-gray-800">
            카드 지출 관리
          </h1>
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
