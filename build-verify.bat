@echo off
echo 🏗️ MovieLand Build Verification
echo ================================

REM Check Node.js version
echo 📋 Checking Node.js version...
node --version

REM Check npm version  
echo 📋 Checking npm version...
npm --version

REM Clean previous builds
echo 🧹 Cleaning previous build...
if exist "build" rmdir /s /q "build"
if exist ".netlify" rmdir /s /q ".netlify"

REM Install dependencies
echo 📦 Installing dependencies...
npm ci

REM Check for common issues
echo 🔍 Checking for potential issues...

REM Check package.json syntax
echo   - Validating package.json...
npm pkg get >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✅ package.json is valid
) else (
    echo     ❌ package.json has syntax errors
)

REM Build the project
echo 🔨 Building the project...
npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 📊 Build output:
    if exist "build" dir build
) else (
    echo ❌ Build failed!
    exit /b 1
)

echo.
echo 🎉 Build verification completed successfully!
echo The project is ready for deployment.