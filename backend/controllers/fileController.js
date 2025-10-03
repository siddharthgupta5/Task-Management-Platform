const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, Word docs, Excel files, and text files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per upload
  },
  fileFilter: fileFilter
});

// @desc    Upload files to task
// @route   POST /api/files/upload/:taskId
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Verify task exists
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Add file information to task
  const uploadedFile = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date()
  };

  task.attachments.push(uploadedFile);
  await task.save();

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: uploadedFile
  });
});

// @desc    Get/Download file
// @route   GET /api/files/:taskId/:filename
// @access  Private
const downloadFile = asyncHandler(async (req, res) => {
  const { taskId, filename } = req.params;

  // Verify task exists and user has access
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Check if file exists in task attachments
  const fileAttachment = task.attachments.find(att => att.filename === filename);
  if (!fileAttachment) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  const filePath = path.join('uploads', filename);
  
  try {
    await fs.access(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${fileAttachment.originalName}"`);
    res.setHeader('Content-Type', fileAttachment.mimetype);
    
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'File not found on server'
    });
  }
});

// @desc    Delete file
// @route   DELETE /api/files/:taskId/:filename
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const { taskId, filename } = req.params;

  // Verify task exists
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Check if file exists in task attachments
  const fileIndex = task.attachments.findIndex(att => att.filename === filename);
  if (fileIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  // Remove file from task attachments
  const removedFile = task.attachments[fileIndex];
  task.attachments.splice(fileIndex, 1);
  await task.save();

  // Delete physical file
  const filePath = path.join('uploads', filename);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting physical file:', error);
    // Continue even if physical file deletion fails
  }

  res.json({
    success: true,
    message: 'File deleted successfully',
    data: {
      deletedFile: removedFile
    }
  });
});

// @desc    Get all files for a task
// @route   GET /api/files/:taskId
// @access  Private
const getTaskFiles = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Verify task exists
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  res.json({
    success: true,
    data: {
      files: task.attachments
    }
  });
});

module.exports = {
  upload,
  uploadFile,
  downloadFile,
  deleteFile,
  getTaskFiles
};