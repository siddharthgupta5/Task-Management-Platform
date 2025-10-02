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
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique identifier for the user',
              example: '60d5ecb54b24a1001f5e4b2a'
            },
            name: { 
              type: 'string',
              description: 'Full name of the user',
              example: 'John Doe'
            },
            email: { 
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
              example: 'john.doe@example.com'
            },
            role: { 
              type: 'string', 
              enum: ['user', 'admin'],
              description: 'User role in the system',
              example: 'user'
            },
            isActive: { 
              type: 'boolean',
              description: 'Whether the user account is active',
              example: true
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Last account update timestamp'
            }
          },
          required: ['name', 'email']
        },
        Task: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique identifier for the task',
              example: '60d5ecb54b24a1001f5e4b2b'
            },
            title: { 
              type: 'string',
              description: 'Task title',
              example: 'Implement user authentication'
            },
            description: { 
              type: 'string',
              description: 'Detailed task description',
              example: 'Implement JWT-based user authentication with login and registration endpoints'
            },
            status: { 
              type: 'string', 
              enum: ['todo', 'in-progress', 'in-review', 'completed'],
              description: 'Current task status',
              example: 'in-progress'
            },
            priority: { 
              type: 'string', 
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Task priority level',
              example: 'high'
            },
            dueDate: { 
              type: 'string', 
              format: 'date-time',
              description: 'Task due date',
              example: '2025-10-15T10:00:00.000Z'
            },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Tags associated with the task',
              example: ['authentication', 'backend', 'security']
            },
            assignedTo: { 
              $ref: '#/components/schemas/User',
              description: 'User assigned to this task'
            },
            createdBy: { 
              $ref: '#/components/schemas/User',
              description: 'User who created this task'
            },
            estimatedHours: { 
              type: 'number',
              minimum: 0,
              description: 'Estimated hours to complete the task',
              example: 8
            },
            actualHours: { 
              type: 'number',
              minimum: 0,
              description: 'Actual hours spent on the task',
              example: 10
            },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  filename: { 
                    type: 'string',
                    description: 'Server filename',
                    example: 'files-1759416477081-949665151.pdf'
                  },
                  originalName: { 
                    type: 'string',
                    description: 'Original filename',
                    example: 'requirements.pdf'
                  },
                  mimetype: { 
                    type: 'string',
                    description: 'File MIME type',
                    example: 'application/pdf'
                  },
                  size: { 
                    type: 'number',
                    description: 'File size in bytes',
                    example: 1024000
                  },
                  uploadedAt: { 
                    type: 'string', 
                    format: 'date-time',
                    description: 'Upload timestamp'
                  }
                }
              },
              description: 'Files attached to the task'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Task creation timestamp'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Last task update timestamp'
            }
          },
          required: ['title', 'description', 'dueDate', 'assignedTo', 'createdBy']
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique identifier for the comment',
              example: '60d5ecb54b24a1001f5e4b2c'
            },
            content: { 
              type: 'string',
              description: 'Comment content/text',
              example: 'This task is progressing well. Need to add input validation.'
            },
            task: { 
              type: 'string',
              description: 'ID of the task this comment belongs to',
              example: '60d5ecb54b24a1001f5e4b2b'
            },
            author: { 
              $ref: '#/components/schemas/User',
              description: 'User who wrote the comment'
            },
            isEdited: { 
              type: 'boolean',
              description: 'Whether the comment has been edited',
              example: false
            },
            editedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Timestamp when comment was last edited'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Comment creation timestamp'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Last comment update timestamp'
            }
          },
          required: ['content', 'task', 'author']
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: true,
              description: 'Indicates if the request was successful'
            },
            message: { 
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data (varies by endpoint)'
            }
          },
          required: ['success']
        },
        Error: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: false,
              description: 'Indicates the request failed'
            },
            message: { 
              type: 'string',
              description: 'Error message',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { 
                    type: 'string',
                    description: 'Error message',
                    example: 'Title must be between 3 and 200 characters'
                  },
                  param: { 
                    type: 'string',
                    description: 'Parameter that caused the error',
                    example: 'title'
                  },
                  location: { 
                    type: 'string',
                    description: 'Location of the error',
                    example: 'body'
                  }
                }
              },
              description: 'Detailed validation errors'
            }
          },
          required: ['success', 'message']
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Access denied. No token provided.'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Validation failed',
                errors: [
                  {
                    msg: 'Title must be between 3 and 200 characters',
                    param: 'title',
                    location: 'body'
                  }
                ]
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Internal server error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management operations including CRUD operations and bulk operations'
      },
      {
        name: 'Comments',
        description: 'Task comment operations for collaboration and communication'
      },
      {
        name: 'Files',
        description: 'File upload, download, and management for task attachments'
      },
      {
        name: 'Analytics',
        description: 'Statistics, reporting, and data export functionality'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;