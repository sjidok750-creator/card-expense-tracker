import type { Expense, CategoryConfig } from '../types';

export interface AppData {
  expenses: Expense[];
  categories: CategoryConfig[];
  version: string;
  exportDate: string;
}

export function exportToFile(expenses: Expense[], categories: CategoryConfig[]): void {
  const data: AppData = {
    expenses,
    categories,
    version: '1.0.0',
    exportDate: new Date().toISOString(),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `card-expenses-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromFile(): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('파일이 선택되지 않았습니다.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as AppData;

          // 데이터 유효성 검사
          if (!data.expenses || !Array.isArray(data.expenses)) {
            throw new Error('잘못된 파일 형식입니다.');
          }

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsText(file);
    };

    input.click();
  });
}
