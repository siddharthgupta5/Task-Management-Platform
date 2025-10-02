const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title, description, status, priority, dueDate, tags, assignedTo, estimatedHours } = req.body;

  // Verify assigned user exists
  const assignedUser = await User.findById(assignedTo);
  if (!assignedUser) {
    return res.status(400).json({
      success: false,
      message: 'Assigned user not found'
    });
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    tags,
    assignedTo,
    estimatedHours,
    createdBy: req.user._id
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task: populatedTask }
  });
});

// @desc    Get all tasks with filtering, searching, sorting, pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    assignedTo,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    dueDate,
    overdue
  } = req.query;

  // Build query
  const query = { isDeleted: false };

  // Filters
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  if (tags) query.tags = { $in: tags.split(',') };
  
  // Due date filter
  if (dueDate) {
    const date = new Date(dueDate);
    query.dueDate = {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    };
  }

  // Overdue filter
  if (overdue === 'true') {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: 'completed' };
  }

  // Search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Pagination
  const skip = (page - 1) * limit;

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: false })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  res.json({
    success: true,
    data: { task }
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const task = await Task.findOne({ _id: req.params.id, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const { title, description, status, priority, dueDate, tags, assignedTo, estimatedHours, actualHours } = req.body;

  // Verify assigned user exists if assignedTo is being updated
  if (assignedTo && assignedTo !== task.assignedTo.toString()) {
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user not found'
      });
    }
  }

  // Update fields
  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (dueDate) task.dueDate = dueDate;
  if (tags) task.tags = tags;
  if (assignedTo) task.assignedTo = assignedTo;
  if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
  if (actualHours !== undefined) task.actualHours = actualHours;

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: { task: updatedTask }
  });
});

// @desc    Delete task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  await task.softDelete();

  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// @desc    Bulk create tasks
// @route   POST /api/tasks/bulk
// @access  Private
const bulkCreateTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Tasks array is required'
    });
  }

  // Validate and prepare tasks
  const tasksToCreate = tasks.map(task => ({
    ...task,
    createdBy: req.user._id
  }));

  // Verify all assigned users exist
  const assignedUserIds = [...new Set(tasksToCreate.map(t => t.assignedTo))];
  const existingUsers = await User.find({ _id: { $in: assignedUserIds } });
  
  if (existingUsers.length !== assignedUserIds.length) {
    return res.status(400).json({
      success: false,
      message: 'One or more assigned users not found'
    });
  }

  const createdTasks = await Task.insertMany(tasksToCreate);
  const populatedTasks = await Task.find({ _id: { $in: createdTasks.map(t => t._id) } })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: `${createdTasks.length} tasks created successfully`,
    data: { tasks: populatedTasks }
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  bulkCreateTasks
};