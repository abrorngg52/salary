import { getIncomes } from './incomeService';
import { getExpenses } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { getMonthKey, getMonthLabel } from '../utils/formatters';

/**
 * Получение общего баланса (доходы - расходы)
 * @returns {Object} Объект с totalIncome, totalExpense, balance
 */
export const getBalance = () => {
  try {
    const incomes = getIncomes();
    const expenses = getExpenses();

    const totalIncome = (incomes || []).reduce((sum, income) => {
      return sum + (parseFloat(income?.amount) || 0);
    }, 0);

    const totalExpense = (expenses || []).reduce((sum, expense) => {
      return sum + (parseFloat(expense?.amount) || 0);
    }, 0);

    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
    };
  } catch (error) {
    console.error('Ошибка подсчёта баланса:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
  }
};

/**
 * Получение всех операций (доходы + расходы), отсортированных по дате
 * @returns {Array} Массив всех операций
 */
export const getAllTransactions = () => {
  try {
    const incomes = getIncomes() || [];
    const expenses = getExpenses() || [];

    const allTransactions = [
      ...incomes.map(income => ({ ...income, type: 'income' })),
      ...expenses.map(expense => ({ ...expense, type: 'expense' })),
    ];

    // Сортировка по дате (новые сначала)
    return allTransactions.sort((a, b) => {
      const dateA = new Date(a?.date || 0);
      const dateB = new Date(b?.date || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Ошибка получения всех операций:', error);
    return [];
  }
};

/**
 * Получение последних N операций
 * @param {number} limit - Количество операций
 * @returns {Array} Массив последних операций
 */
export const getRecentTransactions = (limit = 5) => {
  try {
    const allTransactions = getAllTransactions();
    return allTransactions.slice(0, limit);
  } catch (error) {
    console.error('Ошибка получения последних операций:', error);
    return [];
  }
};

/**
 * Получение данных для круговой диаграммы (распределение расходов по категориям)
 * @returns {Array} Массив объектов { name, value }
 */
export const getByCategory = () => {
  try {
    const expenses = getExpenses() || [];

    // Группировка по категориям
    const categoryMap = {};
    expenses.forEach(expense => {
      const categoryId = expense?.category || 'other';
      const amount = parseFloat(expense?.amount) || 0;
      
      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = 0;
      }
      categoryMap[categoryId] += amount;
    });

    // Преобразование в массив для графика
    const result = Object.entries(categoryMap).map(([categoryId, value]) => {
      // Поиск названия категории
      const categoryObj = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
      const name = categoryObj?.label || categoryId;
      
      return {
        name,
        value,
      };
    });

    // Сортировка по убыванию суммы
    return result.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Ошибка группировки по категориям:', error);
    return [];
  }
};

/**
 * Получение данных для столбчатого графика (доходы и расходы по месяцам)
 * @param {number} monthsCount - Количество последних месяцев
 * @returns {Array} Массив объектов { month, income, expense }
 */
export const getMonthlySummary = (monthsCount = 6) => {
  try {
    const incomes = getIncomes() || [];
    const expenses = getExpenses() || [];

    // Получаем последние N месяцев
    const now = new Date();
    const months = [];
    
    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = getMonthKey(date);
      const label = getMonthLabel(date.getMonth());
      
      months.push({
        key,
        label,
        income: 0,
        expense: 0,
      });
    }

    // Подсчёт доходов по месяцам
    incomes.forEach(income => {
      const monthKey = getMonthKey(income?.date);
      const monthData = months.find(m => m.key === monthKey);
      if (monthData) {
        monthData.income += parseFloat(income?.amount) || 0;
      }
    });

    // Подсчёт расходов по месяцам
    expenses.forEach(expense => {
      const monthKey = getMonthKey(expense?.date);
      const monthData = months.find(m => m.key === monthKey);
      if (monthData) {
        monthData.expense += parseFloat(expense?.amount) || 0;
      }
    });

    // Преобразование для графика
    return months.map(m => ({
      month: m.label,
      income: m.income,
      expense: m.expense,
    }));
  } catch (error) {
    console.error('Ошибка подсчёта по месяцам:', error);
    return [];
  }
};

/**
 * Получение операции по ID (доход или расход)
 * @param {string} id - ID операции
 * @returns {Object|null} Объект операции или null
 */
export const getTransactionById = (id) => {
  try {
    if (!id) return null;

    const incomes = getIncomes() || [];
    const expenses = getExpenses() || [];

    const income = incomes.find(i => i?.id === id);
    if (income) {
      return { ...income, type: 'income' };
    }

    const expense = expenses.find(e => e?.id === id);
    if (expense) {
      return { ...expense, type: 'expense' };
    }

    return null;
  } catch (error) {
    console.error('Ошибка получения операции по ID:', error);
    return null;
  }
};