import { INCOME_CATEGORY_IDS, EXPENSE_CATEGORY_IDS } from '../utils/categories.js';

/**
 * Регулярное выражение для проверки формата даты YYYY-MM-DD
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Проверка валидности даты
 * @param {string} dateStr - Строка даты
 * @returns {boolean} true если дата валидна
 */
const isValidDate = (dateStr) => {
  if (!DATE_REGEX.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  // Проверяем, что дата не "прыгает" (например, 2024-02-30 -> 2024-03-01)
  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

/**
 * Middleware для валидации операции (доход или расход)
 * @param {string} type - Тип операции: 'income' или 'expense'
 * @returns {Function} Express middleware
 */
export const validateTransaction = (type) => {
  return (req, res, next) => {
    const { amount, date, category, comment, is_recurring } = req.body;
    const errors = [];

    // Валидация amount
    if (amount === undefined || amount === null) {
      errors.push('Поле "amount" обязательно');
    } else if (typeof amount !== 'number' && isNaN(parseFloat(amount))) {
      errors.push('Поле "amount" должно быть числом');
    } else if (parseFloat(amount) <= 0) {
      errors.push('Поле "amount" должно быть больше 0');
    }

    // Валидация date
    if (!date) {
      errors.push('Поле "date" обязательно');
    } else if (!isValidDate(date)) {
      errors.push('Поле "date" должно быть в формате YYYY-MM-DD');
    }

    // Валидация category
    if (!category) {
      errors.push('Поле "category" обязательно');
    } else {
      const validCategories = type === 'income' ? INCOME_CATEGORY_IDS : EXPENSE_CATEGORY_IDS;
      if (!validCategories.includes(category)) {
        errors.push(`Недопустимая категория для ${type}: ${category}`);
      }
    }

    // Валидация comment (опционально)
    if (comment !== undefined && comment !== null && typeof comment !== 'string') {
      errors.push('Поле "comment" должно быть строкой');
    }

    // Валидация is_recurring (только для расходов, опционально)
    if (type === 'expense' && is_recurring !== undefined) {
      if (typeof is_recurring !== 'boolean' && is_recurring !== 0 && is_recurring !== 1) {
        errors.push('Поле "is_recurring" должно быть boolean или 0/1');
      }
    }

    // Если есть ошибки — возвращаем 400
    if (errors.length > 0) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Ошибка валидации',
          details: errors,
        },
      });
    }

    // Нормализуем данные перед передачей дальше
    req.body = {
      amount: parseFloat(amount),
      date,
      category,
      comment: comment?.trim() || '',
      ...(type === 'expense' && { is_recurring: is_recurring ? 1 : 0 }),
    };

    next();
  };
};

/**
 * Middleware для валидации ID в параметрах маршрута
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Некорректный ID',
      },
    });
  }

  next();
};

/**
 * Middleware для валидации query-параметров пагинации
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Параметр "page" должен быть положительным числом',
        },
      });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Параметр "limit" должен быть числом от 1 до 100',
        },
      });
    }
  }

  next();
};