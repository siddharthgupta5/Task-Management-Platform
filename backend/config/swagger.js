const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management Platform API',
      version: '1.0.0',
      description: 'A comprehensive task management platform with user authentication, task operations, comments, file uploads, and analytics.',
      contact: {
        name: 'API Support',
        email: 'support@taskmanagement.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['todo', 'in-progress', 'in-review', 'completed'] 
            },
            priority: { 
              type: 'string', 
              enum: ['low', 'medium', 'high', 'urgent'] 
            },
            dueDate: { type: 'string', format: 'date-time' },
            tags: { 
              type: 'array', 
              items: { type: 'string' } 
            },
            assignedTo: { $ref: '#/components/schemas/User' },
            createdBy: { $ref: '#/components/schemas/User' },
            estimatedHours: { type: 'number' },
            actualHours: { type: 'number' },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  filename: { type: 'string' },
                  originalName: { type: 'string' },
                  mimetype: { type: 'string' },
                  size: { type: 'number' },
                  uploadedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            content: { type: 'string' },
            task: { type: 'string' },
            author: { $ref: '#/components/schemas/User' },
            isEdited: { type: 'boolean' },
            editedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management'
      },
      {
        name: 'Tasks',
        description: 'Task management operations'
      },
      {
        name: 'Comments',
        description: 'Task comment operations'
      },
      {
        name: 'Files',
        description: 'File upload and management'
      },
      {
        name: 'Analytics',
        description: 'Statistics and reporting'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;