import * as api from './api.js';

/**
 * Получение общего баланса (доходы, расходы, разница)
 * @param {string} startDate - Начальная дата фильтра (опционально, формат YYYY-MM-DD)
 * @param {string} endDate - Конечная дата фильтра (опционально, формат YYYY-MM-DD)
 * @returns {Promise} Объект { totalIncome, totalExpense, balance }
 */
export const getBalance = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return await api.get('/summary', params);
};

/**
 * Получение сумм по категориям для круговой диаграммы
 * @param {string} type - Тип операции ('income' или 'expense')
 * @param {string} startDate - Начальная дата фильтра (опционально)
 * @param {string} endDate - Конечная дата фильтра (опционально)
 * @returns {Promise} Массив объектов [{ categoryId, categoryLabel, total }]
 */
export const getByCategory = async (type = 'expense', startDate, endDate) => {
  const params = { type };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return await api.get('/summary/by-category', params);
};

/**
 * Получение помесячной сводки доходов и расходов
 * @param {number} monthsCount - Количество последних месяцев (по умолчанию 6)
 * @returns {Promise} Массив объектов [{ year, month, income, expense }]
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  return await api.get('/summary/by-month', { months: monthsCount });
};