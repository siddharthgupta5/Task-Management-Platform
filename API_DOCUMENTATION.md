# Task Management Platform - API Documentation

## Overview

The Task Management Platform API provides a comprehensive set of RESTful endpoints for managing tasks, users, comments, file attachments, and analytics. This document serves as a complete reference for developers integrating with the API.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

The API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting Started

1. Register a new user or login to get a JWT token
2. Include the token in subsequent requests
3. Tokens expire after 7 days by default

## Interactive Documentation

Visit the interactive Swagger documentation at:
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

## API Endpoints Summary

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get current user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |

### Task Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | Get tasks with filtering | Yes |
| POST | `/tasks` | Create a new task | Yes |
| GET | `/tasks/:id` | Get task by ID | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| POST | `/tasks/bulk` | Create multiple tasks | Yes |

### Comment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/comments/task/:taskId` | Get task comments | Yes |
| POST | `/comments` | Add comment to task | Yes |
| PUT | `/comments/:id` | Update comment | Yes |
| DELETE | `/comments/:id` | Delete comment | Yes |

### File Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/files/upload/:taskId` | Upload file to task | Yes |
| GET | `/files/task/:taskId` | Get task files | Yes |
| GET | `/files/download/:taskId/:filename` | Download file | Yes |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/overview` | Get analytics overview | Yes |
| GET | `/analytics/trends` | Get task trends | Yes |
| GET | `/analytics/performance` | Get user performance | Yes |
| POST | `/analytics/export` | Export tasks data | Yes |

## Request/Response Examples

### User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60d5ecb54b24a1001f5e4b2a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application",
    "dueDate": "2025-10-15T10:00:00.000Z",
    "priority": "high",
    "status": "todo",
    "assignedTo": "60d5ecb54b24a1001f5e4b2a",
    "estimatedHours": 8,
    "tags": ["authentication", "backend"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "60d5ecb54b24a1001f5e4b2b",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-10-15T10:00:00.000Z",
    "tags": ["authentication", "backend"],
    "assignedTo": {
      "_id": "60d5ecb54b24a1001f5e4b2a",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "estimatedHours": 8,
    "createdAt": "2025-10-02T08:30:00.000Z"
  }
}
```

### Get Tasks with Filtering

```bash
curl -X GET "http://localhost:5000/api/tasks?status=in-progress&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

### File Upload

```bash
curl -X POST http://localhost:5000/api/files/upload/60d5ecb54b24a1001f5e4b2b \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/document.pdf"
```

### Analytics Overview

```bash
curl -X GET "http://localhost:5000/api/analytics/overview?dateRange=month" \
  -H "Authorization: Bearer <your_token>"
```

## Query Parameters

### Task Filtering Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Integer | Page number for pagination | `page=1` |
| `limit` | Integer | Number of items per page | `limit=10` |
| `status` | String | Filter by task status | `status=in-progress` |
| `priority` | String | Filter by priority | `priority=high` |
| `search` | String | Search in title/description | `search=authentication` |
| `assignedTo` | String | Filter by assigned user ID | `assignedTo=60d5ecb...` |
| `dueDate` | String | Filter by due date | `dueDate=2025-10-15` |
| `tags` | String | Filter by tags (comma-separated) | `tags=backend,auth` |

### Analytics Parameters

| Parameter | Type | Description | Values |
|-----------|------|-------------|--------|
| `dateRange` | String | Time period for data | `week`, `month`, `quarter`, `year` |
| `period` | String | Analysis period | `week`, `month`, `quarter`, `year` |
| `granularity` | String | Data granularity | `daily`, `weekly`, `monthly` |
| `userId` | String | Filter by user ID | User ObjectId |

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "msg": "Detailed error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 413 | Payload Too Large - File size exceeds limit |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload endpoints**: 10 requests per 15 minutes

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1633024800
```

## File Upload Specifications

### Supported File Types

- Documents: PDF, DOC, DOCX, TXT
- Images: JPG, JPEG, PNG, GIF
- Spreadsheets: XLS, XLSX, CSV
- Archives: ZIP, RAR
- Other: Any file type (configurable)

### File Size Limits

- Maximum file size: 10MB
- Maximum files per task: 50
- Supported formats: All (can be restricted via configuration)

### Upload Response Format

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "files-1759416477081-949665151.pdf",
    "originalName": "document.pdf",
    "mimetype": "application/pdf",
    "size": 1024000,
    "uploadedAt": "2025-10-02T08:30:00.000Z"
  }
}
```

## Data Export Formats

### JSON Export

```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ecb54b24a1001f5e4b2b",
      "title": "Task Title",
      "description": "Task Description",
      "status": "completed",
      "priority": "high",
      "assignedTo": {...},
      "createdBy": {...},
      "createdAt": "2025-09-01T00:00:00.000Z",
      "completedAt": "2025-09-15T00:00:00.000Z"
    }
  ],
  "totalRecords": 150
}
```

### CSV Export

```csv
ID,Title,Description,Status,Priority,Assigned To,Created By,Due Date,Created At,Completed At
60d5ecb54b24a1001f5e4b2b,Task Title,Task Description,completed,high,John Doe,Jane Smith,2025-10-15,2025-09-01,2025-09-15
```

## Webhooks (Future Feature)

The API will support webhooks for real-time notifications:

### Webhook Events

- `task.created`
- `task.updated`
- `task.completed`
- `task.overdue`
- `comment.added`
- `file.uploaded`

### Webhook Payload Example

```json
{
  "event": "task.completed",
  "timestamp": "2025-10-02T08:30:00.000Z",
  "data": {
    "task": {...},
    "user": {...},
    "changes": {...}
  }
}
```


## Testing the API

### Using curl

See examples above for curl commands.

### Using Postman

1. Import the Postman collection (available at `/api-docs/postman`)
2. Set up environment variables for base URL and token
3. Run the collection tests


## Versioning

The API follows semantic versioning:

- **Current Version**: v1.0.0
- **Version Header**: `API-Version: 1.0`
- **Backward Compatibility**: Maintained for major versions

## Support and Resources

- **API Documentation**: `/api-docs`
- **Health Check**: `/health`
- **API Status**: `/status`
- **GitHub Repository**: <https://github.com/siddharthgupta5/Task-Management-Platform.git>


## Changelog

### Version 1.0.0 (Current)
- Initial API release
- User authentication
- Task CRUD operations
- Comment system
- File uploads
- Analytics and reporting
- Data export functionality

---

*Last updated: October 2, 2025*