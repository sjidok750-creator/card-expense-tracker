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
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
