#!/bin/bash

# Deploy API Documentation to GitHub Pages
# This script updates the documentation and pushes to GitHub Pages

echo "🚀 Deploying Task Management Platform API Documentation..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Generate fresh OpenAPI spec from backend
echo "📝 Generating fresh OpenAPI specification..."
cd backend
npm run generate-docs 2>/dev/null || echo "⚠️  Note: Auto-generation not available, using existing docs"
cd ..

# Copy the latest OpenAPI spec to docs folder
if [ -f "backend/docs/openapi.json" ]; then
    echo "📋 Copying OpenAPI spec to docs folder..."
    cp backend/docs/openapi.json docs/openapi.json
else
    echo "⚠️  Using existing OpenAPI spec in docs folder"
fi

# Add all documentation files to git
echo "📦 Adding documentation files to git..."
git add docs/
git add *.md
git add deploy-docs.sh

# Commit changes
echo "💾 Committing documentation changes..."
git commit -m "📖 Update API documentation - $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "🔄 Pushing to GitHub..."
git push origin main

echo "✅ Documentation deployed successfully!"
echo ""
echo "🌐 Your API documentation is now available at:"
echo "   https://siddharthgupta5.github.io/Task-Management-Platform"
echo ""
echo "📱 Direct links:"
echo "   • Interactive API Docs: https://siddharthgupta5.github.io/Task-Management-Platform/"
echo "   • OpenAPI JSON: https://siddharthgupta5.github.io/Task-Management-Platform/openapi.json"
echo ""
echo "⏰ Note: GitHub Pages may take 5-10 minutes to update after push"
