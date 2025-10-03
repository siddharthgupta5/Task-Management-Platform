#!/bin/bash

# Generate Standalone API Documentation Package
# This creates a self-contained documentation that can be deployed anywhere

echo "📦 Creating standalone API documentation package..."

# Create distribution directory
DIST_DIR="api-docs-dist"
rm -rf $DIST_DIR
mkdir -p $DIST_DIR

# Copy documentation files
echo "📋 Copying documentation files..."
cp -r docs/* $DIST_DIR/
cp README.md $DIST_DIR/README.md 2>/dev/null || echo "# API Documentation" > $DIST_DIR/README.md

# Ensure we have the latest OpenAPI spec
if [ -f "backend/docs/openapi.json" ]; then
    echo "📄 Copying latest OpenAPI spec..."
    cp backend/docs/openapi.json $DIST_DIR/openapi.json
fi

# Create a deployment README
cat > $DIST_DIR/DEPLOYMENT.md << 'EOF'
# API Documentation - Deployment Guide

This package contains a complete, self-contained API documentation site.

## Quick Deploy Options

### 1. Netlify Drop (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag and drop this entire folder
3. Get instant URL (e.g., https://amazing-name-123456.netlify.app)

### 2. Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow prompts for instant deployment

### 3. Surge.sh (Simple)
1. Install Surge: `npm i -g surge`
2. Run: `surge` in this directory
3. Choose a domain name

### 4. Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Run: `firebase init hosting`
3. Deploy with: `firebase deploy`

### 5. GitHub Pages (Alternative)
1. Create new repository
2. Upload these files
3. Enable Pages in repository settings

### 6. Any Static Host
Upload these files to any web hosting service:
- AWS S3 + CloudFront
- Digital Ocean Spaces
- Cloudflare Pages
- Railway
- Render

## Local Testing
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## Files Included
- `index.html` - Main documentation page
- `openapi.json` - API specification
- `*.css`, `*.js` - Styling and functionality

## Customization
Edit `index.html` to customize branding, colors, or add your logo.
EOF

# Create a simple deployment script for each platform
cat > $DIST_DIR/deploy-netlify.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying to Netlify Drop..."
echo "1. Go to: https://app.netlify.com/drop"
echo "2. Drag this entire folder to the drop zone"
echo "3. Get your instant URL!"
open https://app.netlify.com/drop 2>/dev/null || echo "Open https://app.netlify.com/drop in your browser"
EOF

cat > $DIST_DIR/deploy-vercel.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying to Vercel..."
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi
vercel --prod
EOF

cat > $DIST_DIR/deploy-surge.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying to Surge..."
if ! command -v surge &> /dev/null; then
    echo "Installing Surge CLI..."
    npm install -g surge
fi
surge
EOF

# Make scripts executable
chmod +x $DIST_DIR/deploy-*.sh

# Create a simple index redirect if needed
if [ ! -f "$DIST_DIR/index.html" ]; then
    cp docs/index.html $DIST_DIR/index.html
fi

# Create ZIP package for easy sharing
echo "📦 Creating ZIP package..."
zip -r "task-management-api-docs.zip" $DIST_DIR/

echo "✅ Documentation package created!"
echo ""
echo "📁 Standalone package: $DIST_DIR/"
echo "📦 ZIP package: task-management-api-docs.zip"
echo ""
echo "🚀 Quick Deploy Options:"
echo "1. Netlify Drop: Run ./api-docs-dist/deploy-netlify.sh"
echo "2. Vercel: Run ./api-docs-dist/deploy-vercel.sh"  
echo "3. Surge: Run ./api-docs-dist/deploy-surge.sh"
echo ""
echo "📱 Or share the ZIP file with anyone for instant deployment!"
