import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { validateTransaction, validateId, validatePagination } from '../middleware/validate.js';

const router = express.Router();

/**
 * GET /api/v1/expenses
 * Получение списка всех расходов с пагинацией и фильтрами
 */
router.get('/', validatePagination, expenseController.getAll);

/**
 * GET /api/v1/expenses/:id
 * Получение расхода по ID
 */
router.get('/:id', validateId, expenseController.getById);

/**
 * POST /api/v1/expenses
 * Создание нового расхода
 */
router.post('/', validateTransaction('expense'), expenseController.create);

/**
 * PUT /api/v1/expenses/:id
 * Обновление расхода
 */
router.put('/:id', validateId, validateTransaction('expense'), expenseController.update);

/**
 * DELETE /api/v1/expenses/:id
 * Удаление расхода
 */
router.delete('/:id', validateId, expenseController.remove);

export default router;