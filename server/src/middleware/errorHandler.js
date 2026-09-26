/**
 * Централизованный обработчик ошибок Express
 * @param {Error} err - Объект ошибки
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Логируем ошибку для отладки
  console.error('Ошибка:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Определяем статус-код и сообщение
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Внутренняя ошибка сервера';

  // Обработка ошибок валидации
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Обработка ошибок JSON-парсинга
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Некорректный JSON в теле запроса';
  }

  // Отправляем ответ в едином формате
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message: message,
    },
  });
};

/**
 * Обработчик для несуществующих маршрутов (404)
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Следующий middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Маршрут не найден: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};