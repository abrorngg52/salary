import * as expenseService from '../services/expenseService.js';

/**
 * Получение списка всех расходов с пагинацией и фильтрами
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit, category, dateFrom, dateTo, isRecurring } = req.query;

    const result = await expenseService.getAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      category,
      dateFrom,
      dateTo,
      isRecurring: isRecurring !== undefined ? isRecurring === 'true' : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение расхода по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await expenseService.getById(id);

    if (!expense) {
      const error = new Error(`Расход с ID ${id} не найден`);
      error.statusCode = 404;
      throw error;
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

/**
 * Создание нового расхода
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const create = async (req, res, next) => {
  try {
    const { amount, date, category, comment, isRecurring } = req.body;

    const newExpense = await expenseService.create({
      amount,
      date,
      category,
      comment,
      isRecurring,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление расхода
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, date, category, comment, isRecurring } = req.body;

    const updatedExpense = await expenseService.update(id, {
      amount,
      date,
      category,
      comment,
      isRecurring,
    });

    if (!updatedExpense) {
      const error = new Error(`Расход с ID ${id} не найден`);
      error.statusCode = 404;
      throw error;
    }

    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление расхода
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await expenseService.remove(id);

    if (!deleted) {
      const error = new Error(`Расход с ID ${id} не найден`);
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, message: 'Расход успешно удалён' });
  } catch (error) {
    next(error);
  }
};