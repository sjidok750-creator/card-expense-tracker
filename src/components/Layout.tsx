import type { TabKey } from '../types';

interface LayoutProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: React.ReactNode;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'input', label: 'Input/List' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'settings', label: 'Settings' },
];

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <header className="bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1
            className="mb-2 text-center"
            style={{
              color: '#E8694A',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            Corporate Card Disbursement Record
          </h1>
          <nav className="flex gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="flex-1 py-1 rounded-md transition-all"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#191F28',
                  whiteSpace: 'nowrap',
                  backgroundColor: activeTab === tab.key ? '#E8E8E8' : '#F2F4F6',
                  border: activeTab === tab.key ? '1.5px solid #E8694A' : '1.5px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
