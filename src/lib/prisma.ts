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
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient();
  }

  if (!global.__prisma) {
    global.__prisma = createPrismaClient() || undefined;
  }

  return global.__prisma || null;
}
