@echo off
REM Docker Development Script for Windows
REM This script sets up and runs the development environment using Docker

echo 🐳 Starting Docker development environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Build development image if it doesn't exist
docker images -q nextjs-boilerplate-dev >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Building development Docker image...
    docker build -f Dockerfile.dev -t nextjs-boilerplate-dev .
)

REM Stop existing container if running
for /f %%i in ('docker ps -q -f name=nextjs-dev 2^>nul') do (
    echo 🛑 Stopping existing development container...
    docker stop nextjs-dev
)

REM Remove existing container if exists
for /f %%i in ('docker ps -aq -f name=nextjs-dev 2^>nul') do (
    echo 🗑️ Removing existing development container...
    docker rm nextjs-dev
)

REM Run development container
echo 🚀 Starting development container...
docker run -d ^
    --name nextjs-dev ^
    -p 3000:3000 ^
    -p 6006:6006 ^
    -v "%cd%":/app ^
    -v /app/node_modules ^
    -v /app/.next ^
    --env-file .env ^
    nextjs-boilerplate-dev

echo ✅ Development environment is running!
echo 🌐 Application: http://localhost:3000
echo 📚 Storybook: http://localhost:6006
echo.
echo 📋 Useful commands:
echo   docker logs nextjs-dev -f    # View logs
echo   docker exec -it nextjs-dev sh # Access container shell
echo   docker stop nextjs-dev       # Stop container