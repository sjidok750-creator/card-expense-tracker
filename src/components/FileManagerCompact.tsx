import { useState } from 'react';
import type { Expense, CategoryConfig } from '../types';
import { exportToFile, importFromFile } from '../utils/fileOperations';
import { exportToExcel, shareExcel } from '../utils/excel';
import { formatAmount } from '../utils/format';

interface FileManagerCompactProps {
  expenses: Expense[];
  categories: CategoryConfig[];
  onImport: (expenses: Expense[], categories: CategoryConfig[]) => void;
  onClear: () => void;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 400,
};

const CORAL = '#E8694A';

function Badge({ children, onClick, danger = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...MONO,
        color: danger ? '#EF4444' : CORAL,
        backgroundColor: hovered ? '#E8E8E8' : '#F2F4F6',
        border: `1px solid ${danger ? (hovered ? '#EF4444' : 'transparent') : (hovered ? CORAL : 'transparent')}`,
        borderRadius: '6px',
        fontSize: '12px',
        padding: '2px 10px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

export default function FileManagerCompact({
  expenses,
  categories,
  onImport,
  onClear,
}: FileManagerCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function flash(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  const handleSave = () => {
    try {
      exportToFile(expenses, categories);
      flash('success', 'File saved successfully.');
    } catch {
      flash('error', 'Failed to save file.');
    }
  };

  const handleLoad = async () => {
    try {
      const data = await importFromFile();
      onImport(data.expenses, data.categories);
      flash('success', `Loaded ${data.expenses.length} records.`);
    } catch (error) {
      flash('error', error instanceof Error ? error.message : 'Failed to load file.');
    }
  };

  const handleExportExcel = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      exportToExcel(expenses, `expenses_${today}.xlsx`);
      flash('success', 'Excel downloaded.');
    } catch {
      flash('error', 'Excel export failed.');
    }
  };

  const handleShareExcel = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const success = await shareExcel(expenses, `expenses_${today}.xlsx`);
      if (success) flash('success', 'Excel shared.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (msg.includes('지원하지 않습니다')) {
        handleExportExcel();
      } else {
        flash('error', 'Share failed.');
      }
    }
  };

  const handleClear = () => {
    if (window.confirm('Delete all data? This cannot be undone.')) {
      onClear();
      flash('success', 'All data cleared.');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-2xl p-3 mt-3">
      {message && (
        <div
          className="mb-2 px-3 py-1.5 rounded-md text-xs"
          style={{
            ...MONO,
            backgroundColor: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            color: message.type === 'success' ? '#166534' : '#991B1B',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <Badge>File Mgmt</Badge>
        <div className="flex items-center gap-2">
          <Badge onClick={handleSave}>Save</Badge>
          <Badge onClick={handleLoad}>Load</Badge>
          <button
            onClick={() => setIsOpen((v) => !v)}
            style={{
              ...MONO,
              color: CORAL,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              padding: '2px 4px',
              opacity: 0.6,
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              display: 'inline-block',
            }}
          >
            ▼
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {isOpen && (
        <div className="mt-2 pt-2 border-t space-y-2" style={{ borderColor: '#F2F4F6' }}>
          <div className="flex flex-wrap gap-2">
            <Badge onClick={handleExportExcel}>Export Excel</Badge>
            <Badge onClick={handleShareExcel}>Share Excel</Badge>
            <Badge onClick={handleClear} danger>Clear All</Badge>
          </div>

          <div
            className="flex flex-wrap gap-x-5 gap-y-1 px-2 py-1.5 rounded-md"
            style={{ backgroundColor: '#F2F4F6' }}
          >
            <span style={{ ...MONO, fontSize: '11px', color: CORAL }}>
              Records: <strong>{expenses.length}</strong>
            </span>
            <span style={{ ...MONO, fontSize: '11px', color: CORAL }}>
              Cat: <strong>{categories.length}</strong>
            </span>
            <span style={{ ...MONO, fontSize: '11px', color: CORAL }}>
              Total: <strong>{formatAmount(total)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
