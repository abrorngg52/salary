import express from 'express';
import * as summaryController from '../controllers/summaryController.js';

const router = express.Router();

/**
 * GET /api/v1/summary/balance
 * Получение общего баланса (доходы - расходы)
 * Query params: dateFrom, dateTo (опционально)
 */
router.get('/balance', summaryController.getBalance);

/**
 * GET /api/v1/summary/by-category
 * Получение расходов, сгруппированных по категориям
 * Query params: dateFrom, dateTo (опционально)
 */
router.get('/by-category', summaryController.getByCategory);

/**
 * GET /api/v1/summary/by-month
 * Получение доходов и расходов, сгруппированных по месяцам
 * Query params: months (количество месяцев, по умолчанию 12)
 */
router.get('/by-month', summaryController.getByMonth);

export default router;