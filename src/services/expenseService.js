import { getExpenses as getExpensesFromStorage, setExpenses, generateId } from './storage';

/**
 * Получение всех расходов
 * @returns {Array} Массив расходов
 */
export const getExpenses = () => {
  try {
    const expenses = getExpensesFromStorage();
    return Array.isArray(expenses) ? expenses : [];
  } catch (error) {
    console.error('Ошибка получения расходов:', error);
    return [];
  }
};

/**
 * Получение расхода по ID
 * @param {string} id - ID расхода
 * @returns {Object|null} Объект расхода или null
 */
export const getExpenseById = (id) => {
  try {
    if (!id) return null;
    const expenses = getExpenses();
    return expenses.find(expense => expense?.id === id) || null;
  } catch (error) {
    console.error('Ошибка получения расхода по ID:', error);
    return null;
  }
};

/**
 * Добавление нового расхода
 * @param {Object} expenseData - Данные расхода (category, amount, date, comment)
 * @returns {Object|null} Созданный расход или null при ошибке
 */
export const addExpense = (expenseData) => {
  try {
    if (!expenseData) return null;

    const expenses = getExpenses();
    const newExpense = {
      id: generateId(),
      type: 'expense',
      category: expenseData.category || 'other',
      amount: parseFloat(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      comment: expenseData.comment?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    setExpenses(expenses);

    return newExpense;
  } catch (error) {
    console.error('Ошибка добавления расхода:', error);
    return null;
  }
};

/**
 * Обновление расхода
 * @param {string} id - ID расхода
 * @param {Object} expenseData - Новые данные расхода
 * @returns {Object|null} Обновлённый расход или null при ошибке
 */
export const updateExpense = (id, expenseData) => {
  try {
    if (!id || !expenseData) return null;

    const expenses = getExpenses();
    const index = expenses.findIndex(expense => expense?.id === id);

    if (index === -1) return null;

    const updatedExpense = {
      ...expenses[index],
      category: expenseData.category ?? expenses[index].category,
      amount: parseFloat(expenseData.amount) ?? expenses[index].amount,
      date: expenseData.date ?? expenses[index].date,
      comment: expenseData.comment?.trim() ?? expenses[index].comment,
      updatedAt: new Date().toISOString(),
    };

    expenses[index] = updatedExpense;
    setExpenses(expenses);

    return updatedExpense;
  } catch (error) {
    console.error('Ошибка обновления расхода:', error);
    return null;
  }
};

/**
 * Удаление расхода
 * @param {string} id - ID расхода
 * @returns {boolean} true если удалён, false при ошибке
 */
export const deleteExpense = (id) => {
  try {
    if (!id) return false;

    const expenses = getExpenses();
    const filteredExpenses = expenses.filter(expense => expense?.id !== id);

    if (filteredExpenses.length === expenses.length) {
      return false; // Расход не найден
    }

    setExpenses(filteredExpenses);
    return true;
  } catch (error) {
    console.error('Ошибка удаления расхода:', error);
    return false;
  }
};