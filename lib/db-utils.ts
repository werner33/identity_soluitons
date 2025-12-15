import { Prisma } from '@prisma/client';
import { db } from './db';

/**
 * Database error types for better error handling
 */
export enum DatabaseErrorCode {
  UNIQUE_CONSTRAINT = 'P2002',
  FOREIGN_KEY_CONSTRAINT = 'P2003',
  RECORD_NOT_FOUND = 'P2025',
  CONNECTION_ERROR = 'P1001',
  AUTHENTICATION_FAILED = 'P1002',
  DATABASE_NOT_FOUND = 'P1003',
  TIMEOUT = 'P1008',
  MIGRATION_FAILED = 'P3006',
}

/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
  code: string;
  meta?: Record<string, unknown>;

  constructor(message: string, code: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.meta = meta;
  }
}

/**
 * Parse Prisma errors into user-friendly messages
 */
export function parsePrismaError(error: unknown): DatabaseError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case DatabaseErrorCode.UNIQUE_CONSTRAINT:
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        return new DatabaseError(
          `A record with this ${field} already exists.`,
          error.code,
          error.meta
        );

      case DatabaseErrorCode.RECORD_NOT_FOUND:
        return new DatabaseError(
          'The requested record was not found.',
          error.code,
          error.meta
        );

      case DatabaseErrorCode.FOREIGN_KEY_CONSTRAINT:
        return new DatabaseError(
          'Cannot complete operation due to related records.',
          error.code,
          error.meta
        );

      default:
        return new DatabaseError(
          'A database error occurred.',
          error.code,
          error.meta
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new DatabaseError(
      'Invalid data provided to the database.',
      'VALIDATION_ERROR'
    );
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError(
      'Failed to connect to the database.',
      'CONNECTION_ERROR'
    );
  }

  if (error instanceof Error) {
    return new DatabaseError(error.message, 'UNKNOWN_ERROR');
  }

  return new DatabaseError('An unknown error occurred.', 'UNKNOWN_ERROR');
}

/**
 * Wrapper for database operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<{ data?: T; error?: DatabaseError }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    return { error: parsePrismaError(error) };
  }
}

/**
 * Transaction wrapper with automatic rollback on error
 */
export async function executeTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<{ data?: T; error?: DatabaseError }> {
  try {
    const data = await db.$transaction(callback);
    return { data };
  } catch (error) {
    return { error: parsePrismaError(error) };
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  totalInvestors: number;
  recentInvestors: number;
  databaseSize?: string;
}> {
  const totalInvestors = await db.investor.count();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentInvestors = await db.investor.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  try {
    const sizeResult = await db.$queryRaw<
      Array<{ pg_size_pretty: string }>
    >`SELECT pg_size_pretty(pg_database_size(current_database()))`;

    return {
      totalInvestors,
      recentInvestors,
      databaseSize: sizeResult[0]?.pg_size_pretty,
    };
  } catch {
    return {
      totalInvestors,
      recentInvestors,
    };
  }
}

/**
 * Test database connection and return detailed status
 */
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: {
    version: string;
    connected: boolean;
    responseTime: number;
  };
}> {
  const startTime = Date.now();

  try {
    const result = await db.$queryRaw<Array<{ version: string }>>`
      SELECT version() as version
    `;

    const responseTime = Date.now() - startTime;

    return {
      success: true,
      message: 'Database connection successful',
      details: {
        version: result[0]?.version || 'Unknown',
        connected: true,
        responseTime,
      },
    };
  } catch (error) {
    const dbError = parsePrismaError(error);
    return {
      success: false,
      message: dbError.message,
    };
  }
}

/**
 * Batch insert with error handling
 * Useful for seeding or bulk operations
 */
export async function batchInsert<T>(
  model: keyof typeof db,
  data: T[]
): Promise<{ count: number; error?: DatabaseError }> {
  try {
    // @ts-expect-error - Dynamic model access
    const result = await db[model].createMany({
      data,
      skipDuplicates: true,
    });
    return { count: result.count };
  } catch (error) {
    return { count: 0, error: parsePrismaError(error) };
  }
}

/**
 * Safely delete records older than specified days
 */
export async function deleteOldRecords(
  model: keyof typeof db,
  days: number,
  dateField: string = 'createdAt'
): Promise<{ count: number; error?: DatabaseError }> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // @ts-expect-error - Dynamic model and field access
    const result = await db[model].deleteMany({
      where: {
        [dateField]: {
          lt: cutoffDate,
        },
      },
    });

    return { count: result.count };
  } catch (error) {
    return { count: 0, error: parsePrismaError(error) };
  }
}

/**
 * Paginated query helper
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginate<T>(
  model: keyof typeof db,
  params: PaginationParams,
  where?: Record<string, unknown>,
  orderBy?: Record<string, unknown>
): Promise<PaginatedResult<T>> {
  const { page, pageSize } = params;
  const skip = (page - 1) * pageSize;

  const [data, totalCount] = await Promise.all([
    // @ts-expect-error - Dynamic model access
    db[model].findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    // @ts-expect-error - Dynamic model access
    db[model].count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
