#!/bin/bash

# Docker Development Script
# This script sets up and runs the development environment using Docker

set -e

echo "🐳 Starting Docker development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build development image if it doesn't exist
if [[ "$(docker images -q nextjs-boilerplate-dev 2> /dev/null)" == "" ]]; then
    echo "📦 Building development Docker image..."
    docker build -f Dockerfile.dev -t nextjs-boilerplate-dev .
fi

# Stop existing container if running
if [ "$(docker ps -q -f name=nextjs-dev)" ]; then
    echo "🛑 Stopping existing development container..."
    docker stop nextjs-dev
fi

# Remove existing container if exists
if [ "$(docker ps -aq -f name=nextjs-dev)" ]; then
    echo "🗑️ Removing existing development container..."
    docker rm nextjs-dev
fi

# Run development container
echo "🚀 Starting development container..."
docker run -d \
    --name nextjs-dev \
    -p 3000:3000 \
    -p 6006:6006 \
    -v "$(pwd)":/app \
    -v /app/node_modules \
    -v /app/.next \
    --env-file .env \
    nextjs-boilerplate-dev

echo "✅ Development environment is running!"
echo "🌐 Application: http://localhost:3000"
echo "📚 Storybook: http://localhost:6006"
echo ""
echo "📋 Useful commands:"
echo "  docker logs nextjs-dev -f    # View logs"
echo "  docker exec -it nextjs-dev sh # Access container shell"
echo "  docker stop nextjs-dev       # Stop container"