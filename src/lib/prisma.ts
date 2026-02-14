import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export function resolveDatabaseUrl() {
  const resolved = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || '';

  let url = resolved.trim();

  if (url.startsWith('psql ')) {
    url = url.slice(5).trim();
  }

  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }

  return url;
}

function createPrismaClient(url: string) {
  try {
    return new PrismaClient({
      log: ['error'],
      datasources: { db: { url } }
    });
  } catch (error) {
    console.error('Prisma client initialization failed', error);
    throw new Error('PrismaClient is not available. Check that @prisma/client is generated and bundled.');
  }
}

const singletonUrl = resolveDatabaseUrl();

export const prisma = global.prisma ?? (singletonUrl ? createPrismaClient(singletonUrl) : undefined);

if (process.env.NODE_ENV !== 'production' && prisma) {
  global.prisma = prisma;
}

export function getPrismaClient() {
  const url = resolveDatabaseUrl();

  if (!url) {
    throw new Error('DATABASE_URL is missing');
  }

  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient(url);
  }

  if (!global.prisma) {
    global.prisma = createPrismaClient(url);
  }

  if (!global.prisma) {
    throw new Error('PrismaClient is not available. Check that @prisma/client is generated and bundled.');
  }

  return global.prisma;
}
