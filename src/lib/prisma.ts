type PrismaClientLike = {
  news: {
    findMany: (args: unknown) => Promise<any[]>;
    findFirst: (args: unknown) => Promise<any | null>;
    create: (args: unknown) => Promise<any>;
    update: (args: unknown) => Promise<any>;
    delete: (args: unknown) => Promise<any>;
  };
  article: PrismaClientLike['news'];
  product: PrismaClientLike['news'];
  lead: PrismaClientLike['news'];
};

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClientLike | undefined;
}

export function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || '';
}

function createPrismaClient() {
  try {
    const required = eval('require')('@prisma/client') as { PrismaClient?: new (...args: any[]) => PrismaClientLike };
    if (!required.PrismaClient) return null;
    return new required.PrismaClient({ log: ['error'] });
  } catch {
    return null;
  }
}

export function getPrismaClient() {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl) {
    console.error('DATABASE_URL is missing (checked DATABASE_URL, POSTGRES_URL, NEON_DATABASE_URL)');
    return null;
  }

  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }

  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient();
  }

  if (!global.__prisma) {
    global.__prisma = createPrismaClient() || undefined;
  }

  return global.__prisma || null;
}
