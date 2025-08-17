#!/usr/bin/env node

/**
 * Setup Script
 *
 * This script helps set up the development environment
 * Run with: node scripts/setup.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up Next.js Starter Template...\n')

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from .env.example...')
  try {
    fs.copyFileSync('.env.example', '.env')
    console.log('✅ .env file created successfully!')
  } catch (error) {
    console.log('⚠️  Please manually copy .env.example to .env')
  }
} else {
  console.log('✅ .env file already exists')
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...')
  try {
    execSync('npm install', { stdio: 'inherit' })
    console.log('✅ Dependencies installed successfully!')
  } catch (error) {
    console.log('❌ Failed to install dependencies. Please run npm install manually.')
  }
} else {
  console.log('✅ Dependencies already installed')
}

// Check database connection
console.log('\n🗄️  Database Setup:')
console.log('1. Make sure your DATABASE_URL is set in .env')
console.log('2. Run: npm run db:generate')
console.log('3. Run: npm run db:migrate')
console.log('4. Optional: npm run db:seed')

console.log('\n🎉 Setup complete! You can now run:')
console.log('  npm run dev          # Start development server')
console.log('  npm run storybook    # Start Storybook')
console.log('  npm run test         # Run tests')
console.log('  npm run docker:dev   # Start with Docker')

console.log('\n📚 For more commands, check package.json scripts section')
console.log('🌐 Visit: http://localhost:3000 after running npm run dev')
