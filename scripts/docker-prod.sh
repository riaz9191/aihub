#!/bin/bash

# Docker Production Script
# This script builds and runs the production environment using Docker

set -e

echo "🐳 Starting Docker production environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build production image
echo "📦 Building production Docker image..."
docker build -t nextjs-boilerplate .

# Stop existing container if running
if [ "$(docker ps -q -f name=nextjs-prod)" ]; then
    echo "🛑 Stopping existing production container..."
    docker stop nextjs-prod
fi

# Remove existing container if exists
if [ "$(docker ps -aq -f name=nextjs-prod)" ]; then
    echo "🗑️ Removing existing production container..."
    docker rm nextjs-prod
fi

# Run production container
echo "🚀 Starting production container..."
docker run -d \
    --name nextjs-prod \
    -p 3000:3000 \
    --env-file .env \
    --restart unless-stopped \
    nextjs-boilerplate

echo "✅ Production environment is running!"
echo "🌐 Application: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  docker logs nextjs-prod -f    # View logs"
echo "  docker exec -it nextjs-prod sh # Access container shell"
echo "  docker stop nextjs-prod       # Stop container"
echo "  docker restart nextjs-prod    # Restart container"