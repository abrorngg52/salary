import { getIncomes as getIncomesFromStorage, setIncomes, generateId } from './storage';

/**
 * Получение всех доходов
 * @returns {Array} Массив доходов
 */
export const getIncomes = () => {
  try {
    const incomes = getIncomesFromStorage();
    return Array.isArray(incomes) ? incomes : [];
  } catch (error) {
    console.error('Ошибка получения доходов:', error);
    return [];
  }
};

/**
 * Получение дохода по ID
 * @param {string} id - ID дохода
 * @returns {Object|null} Объект дохода или null
 */
export const getIncomeById = (id) => {
  try {
    if (!id) return null;
    const incomes = getIncomes();
    return incomes.find(income => income?.id === id) || null;
  } catch (error) {
    console.error('Ошибка получения дохода по ID:', error);
    return null;
  }
};

/**
 * Добавление нового дохода
 * @param {Object} incomeData - Данные дохода (category, amount, date, comment)
 * @returns {Object|null} Созданный доход или null при ошибке
 */
export const addIncome = (incomeData) => {
  try {
    if (!incomeData) return null;

    const incomes = getIncomes();
    const newIncome = {
      id: generateId(),
      type: 'income',
      category: incomeData.category || 'other',
      amount: parseFloat(incomeData.amount) || 0,
      date: incomeData.date || new Date().toISOString().split('T')[0],
      comment: incomeData.comment?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    incomes.push(newIncome);
    setIncomes(incomes);

    return newIncome;
  } catch (error) {
    console.error('Ошибка добавления дохода:', error);
    return null;
  }
};

/**
 * Обновление дохода
 * @param {string} id - ID дохода
 * @param {Object} incomeData - Новые данные дохода
 * @returns {Object|null} Обновлённый доход или null при ошибке
 */
export const updateIncome = (id, incomeData) => {
  try {
    if (!id || !incomeData) return null;

    const incomes = getIncomes();
    const index = incomes.findIndex(income => income?.id === id);

    if (index === -1) return null;

    const updatedIncome = {
      ...incomes[index],
      category: incomeData.category ?? incomes[index].category,
      amount: parseFloat(incomeData.amount) ?? incomes[index].amount,
      date: incomeData.date ?? incomes[index].date,
      comment: incomeData.comment?.trim() ?? incomes[index].comment,
      updatedAt: new Date().toISOString(),
    };

    incomes[index] = updatedIncome;
    setIncomes(incomes);

    return updatedIncome;
  } catch (error) {
    console.error('Ошибка обновления дохода:', error);
    return null;
  }
};

/**
 * Удаление дохода
 * @param {string} id - ID дохода
 * @returns {boolean} true если удалён, false при ошибке
 */
export const deleteIncome = (id) => {
  try {
    if (!id) return false;

    const incomes = getIncomes();
    const filteredIncomes = incomes.filter(income => income?.id !== id);

    if (filteredIncomes.length === incomes.length) {
      return false; // Доход не найден
    }

    setIncomes(filteredIncomes);
    return true;
  } catch (error) {
    console.error('Ошибка удаления дохода:', error);
    return false;
  }
};