#!/bin/bash

# Docker Test Script
# This script runs tests in a Docker container

set -e

echo "🐳 Starting Docker test environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build test image
echo "📦 Building test Docker image..."
docker build -f Dockerfile.dev -t nextjs-boilerplate-test .

# Stop existing container if running
if [ "$(docker ps -q -f name=nextjs-test)" ]; then
    echo "🛑 Stopping existing test container..."
    docker stop nextjs-test
fi

# Remove existing container if exists
if [ "$(docker ps -aq -f name=nextjs-test)" ]; then
    echo "🗑️ Removing existing test container..."
    docker rm nextjs-test
fi

# Run tests in container
echo "🧪 Running tests in Docker container..."
docker run --rm \
    --name nextjs-test \
    -v "$(pwd)":/app \
    -v /app/node_modules \
    --env-file .env \
    nextjs-boilerplate-test \
    npm run test

echo "✅ Tests completed!"

# Optionally run E2E tests
read -p "🎭 Run E2E tests? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🎭 Running E2E tests..."
    docker run --rm \
        --name nextjs-e2e-test \
        -v "$(pwd)":/app \
        -v /app/node_modules \
        --env-file .env \
        nextjs-boilerplate-test \
        npm run test:e2e
    echo "✅ E2E tests completed!"
fi