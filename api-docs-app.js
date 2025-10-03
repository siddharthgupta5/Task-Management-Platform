const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Load the OpenAPI specification
const openApiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs', 'openapi.json'), 'utf8'));

// Update server URLs for production
openApiSpec.servers = [
  {
    url: 'https://your-api-domain.vercel.app',
    description: 'Production API Server'
  },
  {
    url: 'http://localhost:5000',
    description: 'Development server'
  }
];

// Swagger UI options
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .info .title { color: #3b82f6 }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0 }
  `,
  customSiteTitle: 'Task Management API Documentation'
};

// Serve API documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(openApiSpec, swaggerOptions));

// Root route redirects to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Documentation Server is running',
    timestamp: new Date().toISOString() 
  });
});

// Serve the raw OpenAPI spec
app.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'This is the API documentation server. Visit /api-docs for the documentation.' 
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'Something went wrong with the documentation server.' 
  });
});

// Export for Vercel
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API Documentation server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/api-docs to view the documentation`);
  });
}
