const Comment = require('../models/Comment');
const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

// @desc    Add comment to task
// @route   POST /api/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { content, taskId } = req.body;

  // Verify task exists
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const comment = await Comment.create({
    content,
    task: taskId,
    author: req.user._id
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate('author', 'name email')
    .populate('task', 'title');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: { comment: populatedComment }
  });
});

// @desc    Get all comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
const getTaskComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  // Verify task exists
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const skip = (page - 1) * limit;

  const comments = await Comment.findActive()
    .where({ task: taskId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Comment.countDocuments({ task: taskId, isDeleted: false });

  res.json({
    success: true,
    data: {
      comments,
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

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { content } = req.body;

  const comment = await Comment.findOne({ 
    _id: req.params.id, 
    isDeleted: false 
  });

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user is the author
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment'
    });
  }

  comment.content = content;
  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('author', 'name email')
    .populate('task', 'title');

  res.json({
    success: true,
    message: 'Comment updated successfully',
    data: { comment: populatedComment }
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ 
    _id: req.params.id, 
    isDeleted: false 
  });

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user is the author or admin
  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  await comment.softDelete();

  res.json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

module.exports = {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment
};