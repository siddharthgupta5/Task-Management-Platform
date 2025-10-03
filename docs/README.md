# API Documentation Deployment Guide

This document explains how to access and share the Task Management Platform API documentation.

## 🌐 Live Documentation Links

Your API documentation is already deployed and accessible at:

### Primary Documentation Site
- **Interactive API Docs**: https://siddharthgupta5.github.io/Task-Management-Platform/
- **OpenAPI Specification**: https://siddharthgupta5.github.io/Task-Management-Platform/openapi.json

### Alternative Sharing Options
- **Postman Collection**: Can be generated from OpenAPI spec
- **Raw GitHub**: https://raw.githubusercontent.com/siddharthgupta5/Task-Management-Platform/main/docs/openapi.json

## 📤 Quick Sharing Methods

### 1. **Share the Live URL** (Recommended)
Copy and share: `https://siddharthgupta5.github.io/Task-Management-Platform/`

### 2. **Generate Postman Collection**
1. Open Postman
2. Import → Link → Paste: `https://siddharthgupta5.github.io/Task-Management-Platform/openapi.json`
3. Share the generated collection

### 3. **Embed in Website**
```html
<iframe 
  src="https://siddharthgupta5.github.io/Task-Management-Platform/" 
  width="100%" 
  height="600px">
</iframe>
```

## Files

- `index.html` - The main HTML file that loads Swagger UI and displays the API documentation
- `openapi.json` - The OpenAPI 3.0 specification file containing all API endpoints and schemas
- `_config.yml` - GitHub Pages configuration

## GitHub Pages Setup

Your documentation is already configured! If you need to reconfigure:

1. Go to your GitHub repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Click "Save"

## Local Development

To test the documentation locally:

1. Start a local web server in this directory:
   ```bash
   python -m http.server 8000
   ```
   or
   ```bash
   npx serve .
   ```

2. Open your browser and navigate to `http://localhost:8000`

## Updating Documentation

Run the deployment script from the project root:
```bash
./deploy-docs.sh
```

Or manually:
1. Make changes to your API endpoints or Swagger annotations
2. Copy the updated `backend/docs/openapi.json` to `docs/openapi.json`
3. Commit and push the changes
4. GitHub Pages will automatically update in 5-10 minutes

## Features

- **Interactive API Explorer**: Test API endpoints directly from the documentation
- **Authentication Support**: Built-in JWT token authentication
- **Responsive Design**: Works on desktop and mobile devices
- **Deep Linking**: Share direct links to specific endpoints
- **Download Support**: Download the OpenAPI specification file