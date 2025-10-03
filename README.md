# Task Management Platform

A full-stack task management application built with React.js frontend and Node.js/Express backend, featuring user authentication, task operations, real-time comments, file uploads, and comprehensive analytics.

##  Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Task Management**: Create, read, update, delete tasks with status tracking
- **Task Assignment**: Assign tasks to team members
- **Priority & Status Management**: Set task priorities (low, medium, high, urgent) and status (todo, in-progress, in-review, completed)
- **Due Date Tracking**: Set and track task due dates with overdue detection
- **Comments System**: Add, view, and manage task comments
- **File Attachments**: Upload and download files associated with tasks
- **Tags System**: Organize tasks with custom tags
- **Time Tracking**: Estimated vs actual hours tracking

### Advanced Features
- **Analytics Dashboard**: Comprehensive task statistics and performance metrics
- **User Performance Tracking**: Monitor individual user productivity
- **Data Export**: Export tasks data in JSON and CSV formats
- **Real-time Updates**: Dynamic UI updates without page refresh
- **Responsive Design**: Mobile-friendly interface
- **Search & Filtering**: Advanced task search and filtering capabilities
- **Pagination**: Efficient data loading for large datasets

##  Architecture

### Technology Stack

#### Frontend
- **React.js 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **React Hook Form**: Form validation and management
- **Recharts**: Data visualization for analytics
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API communication
- **Date-fns**: Date manipulation and formatting

#### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token for authentication
- **Multer**: File upload handling
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Swagger**: API documentation
- **Morgan**: HTTP request logger

### Architecture Decisions

#### 1. **Modular Structure**
- **Separation of Concerns**: Clear separation between frontend and backend
- **Component-based Frontend**: Reusable React components
- **MVC Pattern**: Model-View-Controller pattern in backend
- **Service Layer**: Abstracted business logic in services

#### 2. **Database Design**
- **MongoDB**: Chosen for flexibility and JSON-like document structure
- **Mongoose ODM**: Provides schema validation and relationship management
- **Referenced Relationships**: User references in tasks and comments for data consistency

#### 3. **Authentication Strategy**
- **JWT Tokens**: Stateless authentication for scalability
- **Secure Storage**: Tokens stored in localStorage with proper validation
- **Protected Routes**: Route-level authentication guards

#### 4. **State Management**
- **React Context**: Global state for authentication and notifications
- **Local State**: Component-level state for UI interactions
- **Custom Hooks**: Reusable logic abstraction

#### 5. **Error Handling**
- **Centralized Error Middleware**: Consistent error responses
- **Client-side Error Boundaries**: Graceful error handling in React
- **Toast Notifications**: User-friendly error and success messages

##  Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

##  Environment Variables

Create the following environment files:

### Backend Environment (`.env` in `/backend` directory)

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanagement
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/taskmanagement

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Task Management <noreply@taskmanagement.com>

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# API Configuration
API_URL=http://localhost:5000
```

### Frontend Environment (`.env` in `/frontend` directory)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Application Configuration
REACT_APP_NAME=Task Management Platform
REACT_APP_VERSION=1.0.0

```

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/siddharthgupta5/Task-Management-Platform.git>
cd task-management-platform
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Edit .env with your configuration values

# Create uploads directory
mkdir uploads

# Start MongoDB (if running locally)
# On Windows: Start MongoDB service
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
# Edit .env with your configuration values

# Start the development server
npm start
```

The frontend application will start on `http://localhost:3000`

### 4. Verify Installation

1. **Backend Health Check**: Visit `http://localhost:5000/health`
2. **API Documentation**: Visit `http://localhost:5000/api-docs`
3. **Frontend Application**: Visit `http://localhost:3000`

##  Development Workflow

### Running the Application

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd frontend
npm start
```


### File Upload Configuration

Ensure the `uploads` directory exists in the backend folder:
```bash
cd backend
mkdir -p uploads
touch uploads/.gitkeep
```


##  API Documentation

The API documentation is automatically generated using Swagger and is available at:
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

### API Endpoints Overview

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Tasks
- `GET /api/tasks` - Get tasks with filtering
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Comments
- `GET /api/comments/task/:taskId` - Get task comments
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

#### Files
- `POST /api/files/upload/:taskId` - Upload file
- `GET /api/files/task/:taskId` - Get task files
- `GET /api/files/download/:taskId/:filename` - Download file

#### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/trends` - Get task trends
- `GET /api/analytics/performance` - Get user performance
- `POST /api/analytics/export` - Export tasks data


##  Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally or check your MongoDB URI.

#### 2. JWT Token Issues
```
Error: jwt malformed
```
**Solution**: Clear localStorage and login again. Check JWT_SECRET configuration.

#### 3. File Upload Issues
```
Error: ENOENT: no such file or directory
```
**Solution**: Ensure the uploads directory exists in the backend folder.

#### 4. CORS Errors
```
Access-Control-Allow-Origin error
```
**Solution**: Check FRONTEND_URL in backend .env matches your frontend URL.

#### 5. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill the process using the port or change the PORT in .env.



##  Assumptions Made

### Technical Assumptions
1. **Single Tenant Application**: Designed for single organization use
2. **MongoDB Availability**: Assumes MongoDB is available (local or cloud)
3. **File Storage**: Local file storage (can be extended to cloud storage)
4. **Session Management**: Stateless JWT-based authentication
5. **Real-time Updates**: Polling-based updates (can be extended to WebSocket)

### Business Logic Assumptions
1. **Task Assignment**: Tasks can be assigned to registered users only
2. **File Size Limits**: Maximum 10MB per file upload
3. **User Roles**: Simple user/admin role system
4. **Task Status Flow**: Linear progression through status stages
5. **Comment System**: Nested comments not implemented (single level)

### Security Assumptions
1. **HTTPS**: Production deployment uses HTTPS
2. **Environment Security**: Environment variables are properly secured
3. **Client Trust**: Basic client-side validation (server-side validation is primary)
4. **File Safety**: Uploaded files are scanned separately for malware

### Performance Assumptions
1. **User Base**: Designed for small to medium teams (< 1000 users)
2. **Concurrent Users**: Handles moderate concurrent usage
3. **Data Volume**: Optimized for typical task management data volumes
4. **Network**: Assumes reliable internet connectivity


- Documentation: [API Docs](https://task-management-platform-three.vercel.app/)


