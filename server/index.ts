import { db } from '@/db'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import createMiddleware from 'next-intl/middleware'
import { routing } from '../src/i18n/routing'

export const app = new Hono().basePath('/api')

app.use(logger())


app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Vercel!',
  })
})

app.get('/health', async (c) => {
  try {
    // Check database connection
    await db.execute('SELECT 1')

    // Check Redis connection (if configured)
    // await redis.ping()

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown',
      services: {
        database: 'healthy',
        // redis: "healthy",
      },
    }

    return c.json(healthData, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)

    const healthData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
    }

    return c.json(healthData, { status: 503 })
  }
})
