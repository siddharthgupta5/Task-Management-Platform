#!/usr/bin/env node

/**
 * Local testing script for API documentation
 * Run this script to test the documentation locally before deployment
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DOCS_DIR = __dirname;

// Simple HTTP server for testing
const server = http.createServer((req, res) => {
    let filePath = path.join(DOCS_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(DOCS_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        // Set content type
        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.json': 'application/json',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif'
        };
        
        const contentType = contentTypes[ext] || 'text/plain';
        res.setHeader('Content-Type', contentType);
        
        // Serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal server error');
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    });
});

// Check if required files exist
const requiredFiles = ['index.html', 'openapi.json'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(DOCS_DIR, file)));

if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    console.error('Please ensure all required files are present in the docs directory.');
    process.exit(1);
}

// Start the server
server.listen(PORT, () => {
    console.log('🚀 Local API Documentation Server Started');
    console.log('📖 Documentation URL: http://localhost:' + PORT);
    console.log('📄 OpenAPI Spec URL: http://localhost:' + PORT + '/openapi.json');
    console.log('');
    console.log('✅ Required files found:');
    requiredFiles.forEach(file => {
        console.log('   ✓ ' + file);
    });
    console.log('');
    console.log('🔍 Testing checklist:');
    console.log('   1. Open http://localhost:' + PORT + ' in your browser');
    console.log('   2. Verify the Swagger UI loads correctly');
    console.log('   3. Check that the OpenAPI spec is valid');
    console.log('   4. Test the interactive API explorer');
    console.log('   5. Verify all endpoints are documented');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
