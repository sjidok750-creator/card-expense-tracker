import { useState } from 'react';
import type { CategoryConfig, CategoryKey, Expense } from '../types';
import { formatAmount } from '../utils/format';

interface ExpenseRowProps {
  expense: Expense;
  categories: CategoryConfig[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
  mode?: 'table' | 'card';
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 400,
};

const CORAL = '#E8694A';

export default function ExpenseRow({ expense, categories, onUpdate, onDelete, mode = 'table' }: ExpenseRowProps) {
  const [editing, setEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editMerchant, setEditMerchant] = useState(expense.merchant);
  const [editAmount, setEditAmount] = useState(String(expense.amount));
  const [editCategory, setEditCategory] = useState(expense.category);

  const catConfig = categories.find((c) => c.key === expense.category);

  function handleSave() {
    onUpdate(expense.id, {
      merchant: editMerchant.trim(),
      amount: Number(editAmount),
      category: editCategory,
      manualCategory: editCategory !== expense.category || expense.manualCategory,
    });
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${expense.merchant}"?`)) {
      onDelete(expense.id);
    }
    setShowActions(false);
  }

  function handleRowClick() {
    if (!editing) setShowActions((v) => !v);
  }

  const actionBtn = (label: string, onClick: () => void, danger = false): React.ReactElement => (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        ...MONO,
        color: danger ? '#EF4444' : CORAL,
        backgroundColor: '#F2F4F6',
        border: `1px solid ${danger ? '#EF4444' : CORAL}`,
        borderRadius: '5px',
        fontSize: '11px',
        padding: '1px 8px',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E5E8EB',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '12px',
    outline: 'none',
    width: '100%',
    ...MONO,
  };

  const labelStyle: React.CSSProperties = {
    ...MONO,
    fontSize: '10px',
    color: CORAL,
    opacity: 0.7,
    display: 'block',
    marginBottom: '2px',
  };

  // ── Edit mode ──────────────────────────────────────────────
  if (editing) {
    if (mode === 'table') {
      return (
        <tr className="border-b" style={{ borderColor: '#F2F4F6' }}>
          <td className="py-1 px-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{expense.date}</td>
          <td className="py-1 px-2">
            <input value={editMerchant} onChange={(e) => setEditMerchant(e.target.value)} style={inputStyle} />
          </td>
          <td className="py-1 px-2">
            <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}
              style={{ ...inputStyle, textAlign: 'right', width: '90px' }} />
          </td>
          <td className="py-1 px-2">
            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value as CategoryKey)}
              style={{ ...inputStyle, width: 'auto' }}>
              {categories.map((c) => <option key={c.key} value={c.key}>{c.key}</option>)}
            </select>
          </td>
          <td className="py-1 px-2">
            <div className="flex gap-1.5">
              {actionBtn('Save', handleSave)}
              {actionBtn('Cancel', () => setEditing(false))}
            </div>
          </td>
        </tr>
      );
    }

    // Card edit
    return (
      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="space-y-1.5">
          <div><label style={labelStyle}>Merchant</label>
            <input value={editMerchant} onChange={(e) => setEditMerchant(e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Amt</label>
            <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}
              style={{ ...inputStyle, textAlign: 'right' }} /></div>
          <div><label style={labelStyle}>Cat</label>
            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value as CategoryKey)} style={inputStyle}>
              {categories.map((c) => <option key={c.key} value={c.key}>{c.key}</option>)}
            </select></div>
          <div className="flex gap-2 pt-1">
            {actionBtn('Save', handleSave)}
            {actionBtn('Cancel', () => setEditing(false))}
          </div>
        </div>
      </div>
    );
  }

  // ── View mode ──────────────────────────────────────────────
  if (mode === 'table') {
    return (
      <>
        <tr
          className="border-b transition-colors cursor-pointer"
          style={{ borderColor: '#F2F4F6' }}
          onClick={handleRowClick}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <td className="py-1 px-2 text-xs" style={{ ...MONO, color: 'var(--text-secondary)' }}>{expense.date}</td>
          <td className="py-1 px-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {expense.merchant}
            {expense.memo && (
              <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>({expense.memo})</span>
            )}
          </td>
          <td className="py-1 px-2 text-right" style={{ ...MONO, color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
            {formatAmount(expense.amount)}
          </td>
          <td className="py-1 px-2">
            <span className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: catConfig?.color }}>
              {expense.category}
            </span>
          </td>
          <td className="py-1 px-2">
            {showActions && (
              <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                {actionBtn('Edit', () => { setEditing(true); setShowActions(false); })}
                {actionBtn('Del', handleDelete, true)}
              </div>
            )}
          </td>
        </tr>
      </>
    );
  }

  // Card view
  return (
    <div
      className="px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
      style={{ backgroundColor: 'white', border: '1px solid #F2F4F6' }}
      onClick={handleRowClick}
    >
      <div className="flex items-center gap-1.5">
        <div style={{ ...MONO, color: 'var(--text-tertiary)', width: '38px', fontSize: '11px' }}>
          {expense.date.slice(5)}
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-1">
          <div className="font-bold truncate" style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
            {expense.merchant}
          </div>
          <span className="inline-block px-1.5 py-0.5 rounded-full text-white shrink-0"
            style={{ backgroundColor: catConfig?.color, fontSize: '10px', fontWeight: 600 }}>
            {expense.category}
          </span>
          {expense.memo && (
            <div className="text-xs truncate" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
              ({expense.memo})
            </div>
          )}
        </div>
        <div style={{ ...MONO, color: 'var(--text-primary)', minWidth: '60px', textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
          {formatAmount(expense.amount)}
        </div>
      </div>
      {showActions && (
        <div className="flex gap-2 mt-1.5 pt-1.5 border-t" style={{ borderColor: '#F2F4F6' }}
          onClick={(e) => e.stopPropagation()}>
          {actionBtn('Edit', () => { setEditing(true); setShowActions(false); })}
          {actionBtn('Del', handleDelete, true)}
        </div>
      )}
    </div>
  );
}
