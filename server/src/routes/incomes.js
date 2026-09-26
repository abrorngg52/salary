import express from 'express';
import * as incomeController from '../controllers/incomeController.js';
import { validateTransaction, validateId, validatePagination } from '../middleware/validate.js';

const router = express.Router();

/**
 * GET /api/v1/incomes
 * Получение списка всех доходов с пагинацией и фильтрами
 */
router.get('/', validatePagination, incomeController.getAll);

/**
 * GET /api/v1/incomes/:id
 * Получение дохода по ID
 */
router.get('/:id', validateId, incomeController.getById);

/**
 * POST /api/v1/incomes
 * Создание нового дохода
 */
router.post('/', validateTransaction('income'), incomeController.create);

/**
 * PUT /api/v1/incomes/:id
 * Обновление дохода
 */
router.put('/:id', validateId, validateTransaction('income'), incomeController.update);

/**
 * DELETE /api/v1/incomes/:id
 * Удаление дохода
 */
router.delete('/:id', validateId, incomeController.remove);

export default router;