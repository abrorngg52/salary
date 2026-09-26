import express from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from './config/index.js';
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Создаём Express-приложение
const app = express();

// Middleware для обработки CORS
app.use(cors(CORS_OPTIONS));

// Middleware для парсинга JSON в теле запроса
app.use(express.json());

// Middleware для парсинга URL-encoded данных (опционально)
app.use(express.urlencoded({ extended: true }));

// Подключаем роуты с префиксом /api/v1
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// Корневой маршрут для проверки работоспособности сервера
app.get('/', (req, res) => {
  res.json({
    message: 'Salary Tracker API работает',
    version: '1.0.0',
    endpoints: {
      incomes: '/api/v1/incomes',
      expenses: '/api/v1/expenses',
      summary: '/api/v1/summary',
    },
  });
});

// Обработчик для несуществующих маршрутов (404)
app.use(notFoundHandler);

// Централизованный обработчик ошибок (должен быть последним)
app.use(errorHandler);

export default app;