import { getDb } from '../db/connection.js';

/**
 * Обёртка для выполнения SQL-запроса с промисом (all)
 */
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }).catch(reject);
  });
};

/**
 * Обёртка для выполнения SQL-запроса с промисом (get — одна строка)
 */
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }).catch(reject);
  });
};

/**
 * Получение общего баланса (сумма доходов - сумма расходов)
 * @param {Object} options - Опции фильтрации
 * @param {string} options.dateFrom - Дата от (включительно)
 * @param {string} options.dateTo - Дата до (включительно)
 * @returns {Promise<Object>} Объект с totalIncome, totalExpense, balance
 */
export const getBalance = async ({ dateFrom, dateTo } = {}) => {
  const conditions = [];
  const params = [];

  if (dateFrom) {
    conditions.push('date >= ?');
    params.push(dateFrom);
  }

  if (dateTo) {
    conditions.push('date <= ?');
    params.push(dateTo);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Сумма доходов
  const incomeRow = await dbGet(
    `SELECT COALESCE(SUM(amount), 0) as total FROM incomes ${whereClause}`,
    params
  );

  // Сумма расходов
  const expenseRow = await dbGet(
    `SELECT COALESCE(SUM(amount), 0) as total FROM expenses ${whereClause}`,
    params
  );

  const totalIncome = incomeRow?.total || 0;
  const totalExpense = expenseRow?.total || 0;
  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

/**
 * Получение расходов, сгруппированных по категориям
 * @param {Object} options - Опции фильтрации
 * @param {string} options.dateFrom - Дата от (включительно)
 * @param {string} options.dateTo - Дата до (включительно)
 * @returns {Promise<Array>} Массив объектов { category, total, count }
 */
export const getByCategory = async ({ dateFrom, dateTo } = {}) => {
  const conditions = [];
  const params = [];

  if (dateFrom) {
    conditions.push('date >= ?');
    params.push(dateFrom);
  }

  if (dateTo) {
    conditions.push('date <= ?');
    params.push(dateTo);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = await dbAll(
    `SELECT 
       category,
       SUM(amount) as total,
       COUNT(*) as count
     FROM expenses 
     ${whereClause}
     GROUP BY category
     ORDER BY total DESC`,
    params
  );

  return (rows || []).map(row => ({
    category: row.category,
    total: row.total,
    count: row.count,
  }));
};

/**
 * Получение доходов и расходов, сгруппированных по месяцам
 * @param {number} monthsCount - Количество последних месяцев (по умолчанию 12)
 * @returns {Promise<Array>} Массив объектов { month, income, expense }
 */
export const getByMonth = async (monthsCount = 12) => {
  // Вычисляем дату N месяцев назад
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1);
  const startDateStr = startDate.toISOString().split('T')[0];

  // Получаем доходы по месяцам
  const incomeRows = await dbAll(
    `SELECT 
       strftime('%Y-%m', date) as month,
       SUM(amount) as total
     FROM incomes
     WHERE date >= ?
     GROUP BY month
     ORDER BY month`,
    [startDateStr]
  );

  // Получаем расходы по месяцам
  const expenseRows = await dbAll(
    `SELECT 
       strftime('%Y-%m', date) as month,
       SUM(amount) as total
     FROM expenses
     WHERE date >= ?
     GROUP BY month
     ORDER BY month`,
    [startDateStr]
  );

  // Создаём карту месяцев
  const monthMap = new Map();

  // Заполняем все месяцы нулями
  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(monthKey, { month: monthKey, income: 0, expense: 0 });
  }

  // Заполняем доходы
  (incomeRows || []).forEach(row => {
    if (monthMap.has(row.month)) {
      monthMap.get(row.month).income = row.total;
    }
  });

  // Заполняем расходы
  (expenseRows || []).forEach(row => {
    if (monthMap.has(row.month)) {
      monthMap.get(row.month).expense = row.total;
    }
  });

  // Преобразуем карту в массив и сортируем по возрастанию
  return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
};