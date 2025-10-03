# API Documentation

This folder contains the static Swagger UI documentation for the Task Management Platform API, deployed via GitHub Pages.

## Files

- `index.html` - The main HTML file that loads Swagger UI and displays the API documentation
- `openapi.json` - The OpenAPI 3.0 specification file containing all API endpoints and schemas

## GitHub Pages Setup

1. Go to your GitHub repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Click "Save"

Your API documentation will be available at: `https://[your-username].github.io/[repository-name]/`

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

The `openapi.json` file is automatically generated from your backend API. To update the documentation:

1. Make changes to your API endpoints or Swagger annotations
2. Regenerate the OpenAPI spec (if using automated generation)
3. Copy the updated `openapi.json` to this docs folder
4. Commit and push the changes

The GitHub Pages site will automatically update with the new documentation.

## Features

- **Interactive API Explorer**: Test API endpoints directly from the documentation
- **Authentication Support**: Built-in JWT token authentication
- **Responsive Design**: Works on desktop and mobile devices
- **Deep Linking**: Share direct links to specific endpoints
- **Download Support**: Download the OpenAPI specification file