export function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

export function formatMonth(dateStr: string): string {
  // "YYYY-MM-DD" -> "YYYY-MM"
  return dateStr.slice(0, 7);
}

export function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getCurrentMonth(): string {
  return getToday().slice(0, 7);
}

export function getMonthLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return `${y}년 ${parseInt(m)}월`;
}

export function getLast6Months(currentMonth: string): string[] {
  const [y, m] = currentMonth.split('-').map(Number);
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(y, m - 1 - i, 1);
    const ym =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0');
    months.push(ym);
  }
  return months;
}
