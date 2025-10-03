const express = require('express');
const { uploadFile, getTaskFiles, downloadFile, deleteFile } = require('../controllers/fileController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types but could be restricted for security
    cb(null, true);
  }
});

/**
 * @swagger
 * /api/files/upload/{taskId}:
 *   post:
 *     summary: Upload a file attachment to a task
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to attach the file to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (max 10MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalName:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                     size:
 *                       type: number
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid file or task ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Task not found
 *       413:
 *         description: File too large (max 10MB)
 */
router.post('/upload/:taskId', upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/files/task/{taskId}:
 *   get:
 *     summary: Get all files attached to a task
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to get files for
 *     responses:
 *       200:
 *         description: Files retrieved successfully
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         description: Server filename
 *                       originalName:
 *                         type: string
 *                         description: Original filename
 *                       mimetype:
 *                         type: string
 *                         description: File MIME type
 *                       size:
 *                         type: number
 *                         description: File size in bytes
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Upload timestamp
 *                       downloadUrl:
 *                         type: string
 *                         description: URL to download the file
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Task not found
 */
router.get('/task/:taskId', getTaskFiles);

/**
 * @swagger
 * /api/files/download/{taskId}/{filename}:
 *   get:
 *     summary: Download a file attachment from a task
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task the file belongs to
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename to download
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: File or task not found
 *       403:
 *         description: Forbidden - No access to this file
 */
router.get('/download/:taskId/:filename', downloadFile);

/**
 * @swagger
 * /api/files/{taskId}/{filename}:
 *   delete:
 *     summary: Delete a file attachment from a task
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task the file belongs to
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: File or task not found
 *       403:
 *         description: Forbidden - No access to this file
 */
router.delete('/:taskId/:filename', deleteFile);

module.exports = router;