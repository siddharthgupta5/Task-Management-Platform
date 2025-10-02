const express = require('express');
const { 
  getTaskOverview, 
  getUserPerformance, 
  getTaskTrends, 
  exportTasksData 
} = require('../controllers/analyticsController');

const router = express.Router();

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get task overview statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *     responses:
 *       200:
 *         description: Overview statistics retrieved successfully
 */
router.get('/overview', getTaskOverview);

/**
 * @swagger
 * /api/analytics/performance:
 *   get:
 *     summary: Get user performance metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter]
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 */
router.get('/performance', getUserPerformance);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get task trends over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *     responses:
 *       200:
 *         description: Task trends retrieved successfully
 */
router.get('/trends', getTaskTrends);

/**
 * @swagger
 * /api/analytics/export:
 *   get:
 *     summary: Export tasks data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Tasks data exported successfully
 */
router.get('/export', exportTasksData);

module.exports = router;