import * as incomeService from '../services/incomeService.js';

/**
 * Получение списка всех доходов с пагинацией и фильтрами
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit, category, dateFrom, dateTo } = req.query;

    const result = await incomeService.getAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      category,
      dateFrom,
      dateTo,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение дохода по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const income = await incomeService.getById(id);

    if (!income) {
      const error = new Error(`Доход с ID ${id} не найден`);
      error.statusCode = 404;
      throw error;
    }

    res.json(income);
  } catch (error) {
    next(error);
  }
};

/**
 * Создание нового дохода
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const create = async (req, res, next) => {
  try {
    const { amount, date, category, comment } = req.body;

    const newIncome = await incomeService.create({
      amount,
      date,
      category,
      comment,
    });

    res.status(201).json(newIncome);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление дохода
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, date, category, comment } = req.body;

    const updatedIncome = await incomeService.update(id, {
      amount,
      date,
      category,
      comment,
    });

    if (!updatedIncome) {
      const error = new Error(`Доход с ID ${id} не найден`);
      error.statusCode = 404;
      throw error;
    }

    res.json(updatedIncome);
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление дохода
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await incomeService.remove(id);

    if (!deleted) {
      const error = new Error(`Доход с ID ${id} не найден`);
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, message: 'Доход успешно удалён' });
  } catch (error) {
    next(error);
  }
};