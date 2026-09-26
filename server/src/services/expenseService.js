import crypto from 'crypto';
import { getDb } from '../db/connection.js';

/**
 * Маппинг строки из БД (snake_case) в объект (camelCase)
 * @param {Object} row - Строка из базы данных
 * @returns {Object} Объект в camelCase
 */
const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment,
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

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
 * Обёртка для выполнения SQL-запроса с промисом (run — вставка/обновление/удаление)
 */
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    }).catch(reject);
  });
};

/**
 * Получение всех расходов с пагинацией и фильтрами
 * @param {Object} options - Опции запроса
 * @param {number} options.page - Номер страницы (по умолчанию 1)
 * @param {number} options.limit - Количество записей на странице (по умолчанию 20)
 * @param {string} options.category - Фильтр по категории
 * @param {string} options.dateFrom - Фильтр: дата от (включительно)
 * @param {string} options.dateTo - Фильтр: дата до (включительно)
 * @param {boolean} options.isRecurring - Фильтр по признаку регулярности
 * @returns {Promise<Object>} Объект с data, total, page, limit, totalPages
 */
export const getAll = async ({ page = 1, limit = 20, category, dateFrom, dateTo, isRecurring } = {}) => {
  const conditions = [];
  const params = [];

  // Фильтр по категории
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  // Фильтр по дате от
  if (dateFrom) {
    conditions.push('date >= ?');
    params.push(dateFrom);
  }

  // Фильтр по дате до
  if (dateTo) {
    conditions.push('date <= ?');
    params.push(dateTo);
  }

  // Фильтр по признаку регулярности
  if (isRecurring !== undefined && isRecurring !== null) {
    conditions.push('is_recurring = ?');
    params.push(isRecurring ? 1 : 0);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Получаем общее количество записей
  const countRow = await dbGet(`SELECT COUNT(*) as total FROM expenses ${whereClause}`, params);
  const total = countRow?.total || 0;

  // Вычисляем смещение
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  // Получаем данные с пагинацией
  const rows = await dbAll(
    `SELECT * FROM expenses ${whereClause} ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return {
    data: (rows || []).map(mapRow),
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

/**
 * Получение расхода по ID
 * @param {string} id - ID расхода
 * @returns {Promise<Object|null>} Объект расхода или null
 */
export const getById = async (id) => {
  const row = await dbGet('SELECT * FROM expenses WHERE id = ?', [id]);
  return mapRow(row);
};

/**
 * Создание нового расхода
 * @param {Object} data - Данные расхода
 * @param {number} data.amount - Сумма
 * @param {string} data.date - Дата (YYYY-MM-DD)
 * @param {string} data.category - Категория
 * @param {string} data.comment - Комментарий
 * @param {boolean} data.isRecurring - Признак регулярного расхода
 * @returns {Promise<Object>} Созданный расход
 */
export const create = async ({ amount, date, category, comment = '', isRecurring = false }) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const isRecurringInt = isRecurring ? 1 : 0;

  await dbRun(
    `INSERT INTO expenses (id, amount, date, category, comment, is_recurring, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, amount, date, category, comment, isRecurringInt, now, now]
  );

  return { 
    id, 
    amount, 
    date, 
    category, 
    comment, 
    isRecurring: Boolean(isRecurringInt), 
    createdAt: now, 
    updatedAt: now 
  };
};

/**
 * Обновление расхода
 * @param {string} id - ID расхода
 * @param {Object} data - Новые данные
 * @returns {Promise<Object|null>} Обновлённый расход или null если не найден
 */
export const update = async (id, { amount, date, category, comment, isRecurring }) => {
  // Проверяем существование
  const existing = await getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updatedAmount = amount ?? existing.amount;
  const updatedDate = date ?? existing.date;
  const updatedCategory = category ?? existing.category;
  const updatedComment = comment ?? existing.comment;
  const updatedIsRecurring = isRecurring !== undefined ? (isRecurring ? 1 : 0) : (existing.isRecurring ? 1 : 0);

  await dbRun(
    `UPDATE expenses SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = ? WHERE id = ?`,
    [updatedAmount, updatedDate, updatedCategory, updatedComment, updatedIsRecurring, now, id]
  );

  return {
    id,
    amount: updatedAmount,
    date: updatedDate,
    category: updatedCategory,
    comment: updatedComment,
    isRecurring: Boolean(updatedIsRecurring),
    createdAt: existing.createdAt,
    updatedAt: now,
  };
};

/**
 * Удаление расхода
 * @param {string} id - ID расхода
 * @returns {Promise<boolean>} true если удалён, false если не найден
 */
export const remove = async (id) => {
  const result = await dbRun('DELETE FROM expenses WHERE id = ?', [id]);
  return result.changes > 0;
};