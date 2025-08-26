#!/bin/bash

echo "🏗️  MovieLand Build Verification"
echo "================================"

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version

# Check npm version  
echo "📋 Checking npm version..."
npm --version

# Clean previous builds
echo "🧹 Cleaning previous build..."
rm -rf build/ || true
rm -rf .netlify/ || true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Check for common issues
echo "🔍 Checking for potential issues..."

# Check package.json syntax
echo "  - Validating package.json..."
npm pkg get > /dev/null && echo "    ✅ package.json is valid" || echo "    ❌ package.json has syntax errors"

# Check for conflicting dependencies
echo "  - Checking dependencies..."
npm ls --depth=0 2>/dev/null && echo "    ✅ No dependency conflicts" || echo "    ⚠️  Dependency issues detected"

# Build the project
echo "🔨 Building the project..."
if npm run build; then
    echo "✅ Build successful!"
    echo "📊 Build output:"
    ls -la build/ 2>/dev/null || ls build\\ 2>/dev/null || echo "Build directory not found"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎉 Build verification completed successfully!"
echo "The project is ready for deployment."