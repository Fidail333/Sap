import { getPrismaClient } from '@/lib/prisma';

type RawPrismaClient = {
  $executeRawUnsafe: (query: string) => Promise<number>;
  $queryRawUnsafe: <T = unknown>(query: string) => Promise<T>;
};

const SCHEMA_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS "News" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS "Article" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`
];

let initPromise: Promise<void> | null = null;

async function runSchemaInit(prisma: RawPrismaClient) {
  for (const sql of SCHEMA_SQL) {
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (error) {
      console.error('DB schema initialization failed', { sql, error });
      throw error;
    }
  }
}

export async function ensureDatabaseSchema() {
  const prisma = getPrismaClient() as RawPrismaClient;

  if (!initPromise) {
    initPromise = runSchemaInit(prisma).catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;
}

export async function checkDatabaseHealth() {
  const prisma = getPrismaClient() as RawPrismaClient;

  try {
    await ensureDatabaseSchema();
    await prisma.$queryRawUnsafe('SELECT 1 as ok');
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown DB error';
    console.error('DB health check failed for SQL: SELECT 1 as ok', error);
    return { ok: false as const, error: message };
  }
}

export function getSchemaSql() {
  return SCHEMA_SQL;
}
