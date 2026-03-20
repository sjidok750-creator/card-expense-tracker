import type { Expense, CategoryConfig } from '../types';

const MAX_IMAGE_PX = 1920;
const JPEG_QUALITY = 0.85;

export interface CompressedImage {
  base64: string;
  url: string;
  mediaType: 'image/jpeg';
}

export function compressImage(file: File): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale = Math.min(1, MAX_IMAGE_PX / Math.max(w, h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas를 사용할 수 없습니다.'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);

      const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
      const base64 = dataUrl.split(',')[1];
      const url = URL.createObjectURL(file); // keep original for preview
      resolve({ base64, url, mediaType: 'image/jpeg' });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지를 불러올 수 없습니다. 지원하지 않는 형식일 수 있습니다.'));
    };

    img.src = objectUrl;
  });
}

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
