const express = require('express');
const { 
  getAnalyticsOverview, 
  getTaskTrends, 
  getUserPerformance, 
  exportTasks 
} = require('../controllers/analyticsController');

const router = express.Router();

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview with task statistics
 *     description: Provides a comprehensive overview of task statistics including total tasks, completion rates, status distribution, priority distribution, and overdue tasks
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Time period for analytics data
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by specific user ID (optional)
 *     responses:
 *       200:
 *         description: Analytics overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: number
 *                       example: 150
 *                       description: Total number of tasks
 *                     completedTasks:
 *                       type: number
 *                       example: 120
 *                       description: Number of completed tasks
 *                     completionRate:
 *                       type: number
 *                       example: 80.5
 *                       description: Completion percentage
 *                     overdueCount:
 *                       type: number
 *                       example: 5
 *                       description: Number of overdue tasks
 *                     statusStats:
 *                       type: object
 *                       properties:
 *                         todo:
 *                           type: number
 *                         in-progress:
 *                           type: number
 *                         in-review:
 *                           type: number
 *                         completed:
 *                           type: number
 *                       example:
 *                         todo: 20
 *                         in-progress: 15
 *                         in-review: 8
 *                         completed: 120
 *                     priorityStats:
 *                       type: object
 *                       properties:
 *                         low:
 *                           type: number
 *                         medium:
 *                           type: number
 *                         high:
 *                           type: number
 *                         urgent:
 *                           type: number
 *                       example:
 *                         low: 50
 *                         medium: 70
 *                         high: 25
 *                         urgent: 5
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/overview', getAnalyticsOverview);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get task creation and completion trends over time
 *     description: Provides data for trend analysis showing task creation and completion patterns over specified time periods
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Time period for trend analysis
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: daily
 *         description: Data granularity for trend points
 *     responses:
 *       200:
 *         description: Task trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     creationTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           tasksCreated:
 *                             type: number
 *                           tasksCompleted:
 *                             type: number
 *                       example:
 *                         - date: "2025-09-01"
 *                           tasksCreated: 12
 *                           tasksCompleted: 8
 *                         - date: "2025-09-02"
 *                           tasksCreated: 15
 *                           tasksCompleted: 10
 *                     completionTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           completionRate:
 *                             type: number
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/trends', getTaskTrends);

/**
 * @swagger
 * /api/analytics/performance:
 *   get:
 *     summary: Get user performance metrics and statistics
 *     description: Provides detailed performance metrics for users including task completion rates, average completion times, and productivity statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Time period for performance analysis
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by specific user ID (optional)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [completionRate, totalTasks, avgCompletionTime]
 *           default: completionRate
 *         description: Sort users by performance metric
 *     responses:
 *       200:
 *         description: User performance data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userPerformance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: User ID
 *                           userName:
 *                             type: string
 *                             description: User name
 *                           userEmail:
 *                             type: string
 *                             description: User email
 *                           totalTasks:
 *                             type: number
 *                             description: Total tasks assigned
 *                           completedTasks:
 *                             type: number
 *                             description: Tasks completed
 *                           completionRate:
 *                             type: number
 *                             description: Completion percentage
 *                           overdueTasks:
 *                             type: number
 *                             description: Number of overdue tasks
 *                           avgEstimatedHours:
 *                             type: number
 *                             description: Average estimated hours per task
 *                           avgActualHours:
 *                             type: number
 *                             description: Average actual hours spent
 *                           efficiencyRatio:
 *                             type: number
 *                             description: Estimated vs actual hours ratio
 *                       example:
 *                         - _id: "60d5ecb54b24a1001f5e4b2a"
 *                           userName: "John Doe"
 *                           userEmail: "john@example.com"
 *                           totalTasks: 25
 *                           completedTasks: 20
 *                           completionRate: 80.0
 *                           overdueTasks: 2
 *                           avgEstimatedHours: 8.5
 *                           avgActualHours: 9.2
 *                           efficiencyRatio: 0.92
 *                     teamStats:
 *                       type: object
 *                       properties:
 *                         averageCompletionRate:
 *                           type: number
 *                         topPerformer:
 *                           type: string
 *                         totalTeamTasks:
 *                           type: number
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/performance', getUserPerformance);

/**
 * @swagger
 * /api/analytics/export:
 *   post:
 *     summary: Export tasks data in various formats
 *     description: Export task data with filtering options in JSON or CSV format for external analysis or reporting
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [json, csv]
 *                 default: json
 *                 description: Export format
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date for data range
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date for data range
 *               filters:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [todo, in-progress, in-review, completed]
 *                   priority:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [low, medium, high, urgent]
 *                   assignedTo:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                 description: Optional filters for export data
 *               includeComments:
 *                 type: boolean
 *                 default: false
 *                 description: Include comments in export
 *               includeAttachments:
 *                 type: boolean
 *                 default: false
 *                 description: Include attachment info in export
 *     responses:
 *       200:
 *         description: Export data generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: Array of task data (for JSON format)
 *                 downloadUrl:
 *                   type: string
 *                   description: URL to download the export file (for CSV format)
 *                 totalRecords:
 *                   type: number
 *                   description: Total number of exported records
 *           text/csv:
 *             schema:
 *               type: string
 *               description: CSV formatted task data
 *       400:
 *         description: Bad request - Invalid parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error during export generation
 */
router.post('/export', exportTasks);

module.exports = router;