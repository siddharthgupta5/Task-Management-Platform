# API Documentation Deployment Guide

This guide explains how to deploy your Task Management Platform API documentation to GitHub Pages for public access.

## 🚀 Quick Start

Your API documentation will be automatically deployed to:
**https://siddharthgupta5.github.io/Task-Management-Platform/**

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **GitHub Pages Enabled**: Pages must be enabled in your repository settings
3. **GitHub Actions**: Actions must be enabled (usually enabled by default)

## 🔧 Setup Instructions

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/siddharthgupta5/Task-Management-Platform`
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. Click **Save**

### Step 2: Push Your Changes

The deployment workflow is already configured. Simply push your changes:

```bash
git add .
git commit -m "Deploy API documentation to GitHub Pages"
git push origin main
```

### Step 3: Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You'll see the "Deploy API Documentation" workflow running
3. Wait for it to complete (usually takes 2-3 minutes)
4. Once complete, your documentation will be live!

## 📁 File Structure

```
docs/
├── index.html          # Main documentation page
├── openapi.json        # OpenAPI 3.0 specification
├── _config.yml         # GitHub Pages configuration
├── _redirects          # URL redirects
└── README.md           # Documentation guide

.github/workflows/
└── deploy-docs.yml     # Automated deployment workflow
```

## 🔄 Automatic Updates

The documentation will automatically update when you:

- Push changes to the `docs/` folder
- Update the `backend/docs/openapi.json` file
- Modify the `API_DOCUMENTATION.md` file
- Push to the `main` branch

## 🎯 Features

### Interactive API Explorer
- Test API endpoints directly from the documentation
- Built-in JWT token authentication
- Request/response examples
- Schema validation

### Professional Design
- Custom header with branding
- Responsive design for mobile and desktop
- Direct links to GitHub repository and OpenAPI spec
- Clean, modern interface

### Developer-Friendly
- Deep linking to specific endpoints
- Downloadable OpenAPI specification
- Copy-paste ready code examples
- Comprehensive error handling documentation

## 🔗 URLs

- **Live Documentation**: https://siddharthgupta5.github.io/Task-Management-Platform/
- **OpenAPI Spec**: https://siddharthgupta5.github.io/Task-Management-Platform/openapi.json
- **GitHub Repository**: https://github.com/siddharthgupta5/Task-Management-Platform

## 🛠️ Customization

### Updating the OpenAPI Specification

1. Make changes to your API endpoints or Swagger annotations in the backend
2. Regenerate the OpenAPI spec (if using automated generation)
3. The workflow will automatically copy and deploy the updated spec

### Modifying the Documentation Page

Edit `docs/index.html` to:
- Change the header design
- Add custom branding
- Modify the Swagger UI configuration
- Add additional links or information

### Adding Custom Styling

The documentation uses custom CSS in the `<style>` section of `index.html`. You can:
- Change colors and fonts
- Modify the header design
- Add custom animations
- Implement dark mode

## 🐛 Troubleshooting

### Documentation Not Updating

1. Check the GitHub Actions tab for failed workflows
2. Ensure the `docs/` folder contains all required files
3. Verify GitHub Pages is enabled and set to "GitHub Actions"

### 404 Errors

1. Check that the repository name matches the URL
2. Ensure the `_config.yml` has the correct `baseurl`
3. Verify the workflow completed successfully

### Styling Issues

1. Check browser console for CSS errors
2. Ensure all external resources (Swagger UI) are loading
3. Verify the custom CSS syntax is correct

## 📞 Support

If you encounter any issues:

1. Check the GitHub Actions logs for detailed error messages
2. Verify all files are committed and pushed
3. Ensure GitHub Pages is properly configured
4. Check the repository settings for any restrictions

## 🎉 Success!

Once deployed, you can share your API documentation with:
- **Developers**: For integration and testing
- **Stakeholders**: For API overview and capabilities
- **Clients**: For understanding available endpoints
- **Team Members**: For development reference

Your API documentation is now publicly accessible and professionally presented!
