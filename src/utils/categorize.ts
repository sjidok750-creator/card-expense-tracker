import type { CategoryConfig, CategoryKey } from '../types';

export function categorize(
  merchant: string,
  categories: CategoryConfig[]
): CategoryKey {
  const lower = merchant.toLowerCase();
  for (const cat of categories) {
    if (cat.key === '기타') continue;
    for (const keyword of cat.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return cat.key;
      }
    }
  }
  return '기타';
}
