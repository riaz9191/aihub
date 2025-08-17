import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    ANALYZE: z.string().optional(),
    CI: z.string().optional(),
    SKIP_ENV_VALIDATION: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    ANALYZE: process.env.ANALYZE,
    CI: process.env.CI,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
