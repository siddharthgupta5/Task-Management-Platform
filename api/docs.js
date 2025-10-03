const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Load the OpenAPI specification
const openApiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.json'), 'utf8'));

// Update server URLs for production
openApiSpec.servers = [
  {
    url: 'https://task-management-platform-huufpzk5m-siddharths-projects-d3735bdd.vercel.app/api',
    description: 'Production API Server (Vercel)'
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

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    
    // Health check
    if (pathname === '/api/health') {
      return res.json({ 
        status: 'OK', 
        message: 'API Documentation Server is running',
        timestamp: new Date().toISOString() 
      });
    }
    
    // Raw OpenAPI spec
    if (pathname === '/api/openapi.json') {
      return res.json(openApiSpec);
    }
    
    // Swagger UI assets
    if (pathname.startsWith('/api/docs')) {
      // For Swagger UI, we need to handle it differently in serverless
      const swaggerUiAssetHandler = swaggerUi.serveFiles(openApiSpec, swaggerOptions);
      const swaggerUiIndexTemplate = swaggerUi.generateHTML(openApiSpec, swaggerOptions);
      
      if (pathname === '/api/docs' || pathname === '/api/docs/') {
        res.setHeader('Content-Type', 'text/html');
        return res.send(swaggerUiIndexTemplate);
      }
      
      // Handle swagger UI static assets
      return swaggerUiAssetHandler(req, res, () => {
        res.status(404).json({ error: 'Not Found' });
      });
    }
    
    // Root redirect
    if (pathname === '/' || pathname === '/api') {
      res.setHeader('Location', '/api/docs');
      return res.status(302).end();
    }
    
    // 404 handler
    return res.status(404).json({ 
      error: 'Not Found', 
      message: 'This is the API documentation server. Visit /api/docs for the documentation.' 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Something went wrong with the documentation server.' 
    });
  }
};
