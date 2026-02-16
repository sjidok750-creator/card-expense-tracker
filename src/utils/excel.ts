import * as XLSX from 'xlsx';
import type { Expense } from '../types';

/**
 * 지출 데이터를 Excel 워크북으로 변환
 * @param expenses - 내보낼 지출 데이터 배열
 * @returns XLSX 워크북 객체
 */
function createWorkbook(expenses: Expense[]): XLSX.WorkBook {
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

  return wb;
}

/**
 * 지출 데이터를 Excel 파일로 내보내기
 * @param expenses - 내보낼 지출 데이터 배열
 * @param filename - 저장할 파일명 (예: "지출내역_2025-02.xlsx")
 */
export function exportToExcel(expenses: Expense[], filename: string): void {
  const wb = createWorkbook(expenses);
  XLSX.writeFile(wb, filename);
}

/**
 * 지출 데이터를 Excel Blob으로 변환 (공유 기능용)
 * @param expenses - 내보낼 지출 데이터 배열
 * @returns Excel 파일 Blob
 */
export function exportToExcelBlob(expenses: Expense[]): Blob {
  const wb = createWorkbook(expenses);
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Excel 파일을 공유 (모바일 Web Share API 사용)
 * @param expenses - 내보낼 지출 데이터 배열
 * @param filename - 저장할 파일명 (예: "지출내역_2025-02.xlsx")
 * @returns Promise<boolean> 공유 성공 여부
 */
export async function shareExcel(expenses: Expense[], filename: string): Promise<boolean> {
  try {
    // Web Share API 지원 확인
    if (!navigator.share || !navigator.canShare) {
      throw new Error('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }

    // Excel Blob 생성
    const blob = exportToExcelBlob(expenses);
    const file = new File([blob], filename, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // 공유 가능 여부 확인
    if (!navigator.canShare({ files: [file] })) {
      throw new Error('이 파일은 공유할 수 없습니다.');
    }

    // 공유 시트 열기
    await navigator.share({
      title: '지출 내역',
      text: `지출 내역 (${expenses.length}건)`,
      files: [file]
    });

    return true;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      // 사용자가 공유를 취소한 경우
      return false;
    }
    throw error;
  }
}
