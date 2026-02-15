import { useMemo, useCallback } from 'react';
import type { Expense, CategoryConfig, CategoryKey } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { formatMonth, getLast6Months } from '../utils/format';

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const addExpense = useCallback(
    (expense: Expense) => {
      setExpenses((prev) => [expense, ...prev]);
    },
    [setExpenses]
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<Expense>) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    [setExpenses]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [setExpenses]
  );

  const getMonthlyExpenses = useCallback(
    (month: string) => {
      return expenses.filter((e) => formatMonth(e.date) === month);
    },
    [expenses]
  );

  const getMonthlySummary = useCallback(
    (month: string, categories: CategoryConfig[]) => {
      const monthExpenses = getMonthlyExpenses(month);
      const summary: Record<CategoryKey, number> = {} as Record<CategoryKey, number>;
      for (const cat of categories) {
        summary[cat.key] = 0;
      }
      for (const e of monthExpenses) {
        summary[e.category] = (summary[e.category] || 0) + e.amount;
      }
      return summary;
    },
    [getMonthlyExpenses]
  );

  const getBarChartData = useCallback(
    (currentMonth: string, categories: CategoryConfig[]) => {
      const months = getLast6Months(currentMonth);
      return months.map((m) => {
        const summary = getMonthlySummary(m, categories);
        const total = Object.values(summary).reduce((a, b) => a + b, 0);
        return { month: m, total, ...summary };
      });
    },
    [getMonthlySummary]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const importExpenses = useCallback(
    (newExpenses: Expense[]) => {
      setExpenses(newExpenses);
    },
    [setExpenses]
  );

  const clearExpenses = useCallback(() => {
    setExpenses([]);
  }, [setExpenses]);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthlyExpenses,
    getMonthlySummary,
    getBarChartData,
    totalExpenses,
    importExpenses,
    clearExpenses,
  };
}
