const Task = require('../models/Task');
const User = require('../models/User');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');

// @desc    Get task overview statistics
// @route   GET /api/analytics/overview
// @access  Private
const getTaskOverview = asyncHandler(async (req, res) => {
  const { userId, dateRange } = req.query;
  
  // Build base query
  const query = { isDeleted: false };
  if (userId) query.assignedTo = userId;
  
  // Date range filter
  if (dateRange) {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = null;
    }
    
    if (startDate) {
      query.createdAt = { $gte: startDate };
    }
  }

  // Get counts by status
  const statusStats = await Task.aggregate([
    { $match: query },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Get counts by priority
  const priorityStats = await Task.aggregate([
    { $match: query },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);

  // Get overdue tasks count
  const overdueCount = await Task.countDocuments({
    ...query,
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' }
  });

  // Get completion rate
  const totalTasks = await Task.countDocuments(query);
  const completedTasks = await Task.countDocuments({ ...query, status: 'completed' });
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0;

  res.json({
    success: true,
    data: {
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate * 100) / 100,
      overdueCount,
      statusStats: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      priorityStats: priorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    }
  });
});

// @desc    Get user performance metrics
// @route   GET /api/analytics/performance
// @access  Private
const getUserPerformance = asyncHandler(async (req, res) => {
  const { userId, period = 'month' } = req.query;
  
  // Date range for performance calculation
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  const query = {
    isDeleted: false,
    createdAt: { $gte: startDate }
  };
  
  if (userId) query.assignedTo = userId;

  // Get user performance data
  const userPerformance = await Task.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        overdueTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $ne: ['$status', 'completed'] }
                ]
              },
              1,
              0
            ]
          }
        },
        avgEstimatedHours: { $avg: '$estimatedHours' },
        avgActualHours: { $avg: '$actualHours' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 1,
        userName: '$user.name',
        userEmail: '$user.email',
        totalTasks: 1,
        completedTasks: 1,
        overdueTasks: 1,
        completionRate: {
          $cond: [
            { $eq: ['$totalTasks', 0] },
            0,
            { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] }
          ]
        },
        avgEstimatedHours: { $round: ['$avgEstimatedHours', 2] },
        avgActualHours: { $round: ['$avgActualHours', 2] }
      }
    },
    { $sort: { completionRate: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      period,
      userPerformance
    }
  });
});

// @desc    Get task trends over time
// @route   GET /api/analytics/trends
// @access  Private
const getTaskTrends = asyncHandler(async (req, res) => {
  const { period = 'month', groupBy = 'day' } = req.query;
  
  // Date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  // Group format based on groupBy parameter
  let dateGroupFormat;
  switch (groupBy) {
    case 'hour':
      dateGroupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      };
      break;
    case 'day':
      dateGroupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
      break;
    case 'week':
      dateGroupFormat = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      break;
    case 'month':
      dateGroupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
      break;
    default:
      dateGroupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
  }

  // Task creation trends
  const creationTrends = await Task.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: dateGroupFormat,
        tasksCreated: { $sum: 1 },
        tasksCompleted: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  // Task completion trends
  const completionTrends = await Task.aggregate([
    {
      $match: {
        isDeleted: false,
        completedAt: { $gte: startDate, $ne: null }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
          day: { $dayOfMonth: '$completedAt' }
        },
        completedTasks: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.json({
    success: true,
    data: {
      period,
      groupBy,
      creationTrends,
      completionTrends
    }
  });
});

// @desc    Export tasks data
// @route   GET /api/analytics/export
// @access  Private
const exportTasksData = asyncHandler(async (req, res) => {
  const { format = 'json', status, priority, assignedTo, startDate, endDate } = req.query;
  
  // Build query
  const query = { isDeleted: false };
  
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  if (format === 'csv') {
    // Convert to CSV format
    const csvHeaders = 'ID,Title,Description,Status,Priority,Due Date,Assigned To,Created By,Created At,Completed At\n';
    const csvData = tasks.map(task => 
      `${task._id},"${task.title}","${task.description}",${task.status},${task.priority},${task.dueDate},${task.assignedTo?.name || ''},${task.createdBy?.name || ''},${task.createdAt},${task.completedAt || ''}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks-export.csv"');
    res.send(csvHeaders + csvData);
  } else {
    // JSON format
    res.json({
      success: true,
      data: {
        exportedAt: new Date(),
        totalRecords: tasks.length,
        tasks
      }
    });
  }
});

module.exports = {
  getAnalyticsOverview: getTaskOverview,
  getUserPerformance,
  getTaskTrends,
  exportTasks: exportTasksData
};