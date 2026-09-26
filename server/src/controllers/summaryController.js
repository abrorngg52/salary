import * as summaryService from '../services/summaryService.js';

/**
 * Получение общего баланса (доходы - расходы)
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getBalance = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const balance = await summaryService.getBalance({
      dateFrom,
      dateTo,
    });

    res.json(balance);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение расходов, сгруппированных по категориям
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getByCategory = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const categories = await summaryService.getByCategory({
      dateFrom,
      dateTo,
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение доходов и расходов, сгруппированных по месяцам
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const getByMonth = async (req, res, next) => {
  try {
    const { months } = req.query;

    // Количество месяцев (по умолчанию 12, максимум 24)
    const monthsCount = months ? Math.min(24, Math.max(1, parseInt(months, 10))) : 12;

    const monthlyData = await summaryService.getByMonth(monthsCount);

    res.json(monthlyData);
  } catch (error) {
    next(error);
  }
};