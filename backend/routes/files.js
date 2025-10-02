const express = require('express');
const { upload, uploadFiles, getFile, deleteFile, getTaskFiles } = require('../controllers/fileController');

const router = express.Router();

/**
 * @swagger
 * /api/files/upload/{taskId}:
 *   post:
 *     summary: Upload files to a task
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 */
router.post('/upload/:taskId', upload.array('files', 5), uploadFiles);

/**
 * @swagger
 * /api/files/{taskId}:
 *   get:
 *     summary: Get all files for a task
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 */
router.get('/:taskId', getTaskFiles);

/**
 * @swagger
 * /api/files/{taskId}/{filename}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 */
router.get('/:taskId/:filename', getFile);

/**
 * @swagger
 * /api/files/{taskId}/{filename}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete('/:taskId/:filename', deleteFile);

module.exports = router;