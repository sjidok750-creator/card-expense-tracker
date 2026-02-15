export type CategoryKey =
  | '식비'
  | '카페'
  | '교통'
  | '자동차'
  | '쇼핑'
  | '편의점'
  | '의료'
  | '문화/여가'
  | '통신'
  | '기타';

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  category: CategoryKey;
  manualCategory: boolean;
  memo?: string;
}

export interface CategoryConfig {
  key: CategoryKey;
  color: string;
  keywords: string[];
}

export type TabKey = 'input' | 'dashboard' | 'settings';
