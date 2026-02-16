interface MonthPickerProps {
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <input
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2"
      style={{
        borderColor: '#E5E8EB',
        color: 'var(--text-secondary)'
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--toss-blue)')}
      onBlur={(e) => (e.target.style.borderColor = '#E5E8EB')}
    />
  );
}
