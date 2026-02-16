import * as XLSX from 'xlsx';
import type { Expense } from '../types';

/**
 * 지출 데이터를 Excel 파일로 내보내기
 * @param expenses - 내보낼 지출 데이터 배열
 * @param filename - 저장할 파일명 (예: "지출내역_2025-02.xlsx")
 */
export function exportToExcel(expenses: Expense[], filename: string): void {
  // 1. 데이터를 Excel 형식으로 변환
  const data = expenses.map(exp => ({
    날짜: exp.date,
    사용처: exp.merchant,
    금액: exp.amount,
    카테고리: exp.category,
    메모: exp.memo || ''
  }));

  // 2. 워크시트 생성
  const ws = XLSX.utils.json_to_sheet(data);

  // 3. 열 너비 자동 조정
  const colWidths = [
    { wch: 12 }, // 날짜
    { wch: 20 }, // 사용처
    { wch: 12 }, // 금액
    { wch: 12 }, // 카테고리
    { wch: 30 }  // 메모
  ];
  ws['!cols'] = colWidths;

  // 4. 워크북 생성
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '지출내역');

  // 5. 다운로드
  XLSX.writeFile(wb, filename);
}
