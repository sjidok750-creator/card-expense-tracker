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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <header className="bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1
            className="text-2xl mb-6 text-center"
            style={{
              color: '#E8694A',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 400,
            }}
          >
            Corporate Card Disbursement Record
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
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
