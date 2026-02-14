import { getPrismaClient } from '@/lib/prisma';

export async function checkDatabaseHealth() {
  const prisma = getPrismaClient();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown DB error';
    console.error('DB health check failed for SQL: SELECT 1', error);
    return { ok: false as const, error: message };
  }
}
