import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma Client Singleton for Next.js
 *
 * This pattern prevents multiple instances of Prisma Client in development
 * due to hot reloading. In production, it creates a single instance.
 *
 * Prisma v7 configuration: https://pris.ly/d/prisma7-client-config
 */

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // Production: Use connection pooling with adapter
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
    log:
      process.env.PRISMA_LOG === 'true'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
} else {
  // Development: Use cached instance with direct connection
  if (!global.cachedPrisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    global.cachedPrisma = new PrismaClient({
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

/**
 * Graceful shutdown handler for Prisma Client
 * Call this when your application is shutting down
 */
export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Health check for database connection
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Get database connection info
 * Useful for debugging and monitoring
 */
export async function getDatabaseInfo(): Promise<{
  connected: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const result = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version()
    `;
    return {
      connected: true,
      version: result[0]?.version || 'Unknown',
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
