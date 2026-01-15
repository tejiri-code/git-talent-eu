import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const isAccelerate = process.env.DATABASE_URL?.startsWith('prisma://') || process.env.DATABASE_URL?.startsWith('prisma+postgres://');


export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient(
        isAccelerate
            ? { accelerateUrl: process.env.DATABASE_URL, log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'] }
            : { datasourceUrl: process.env.DATABASE_URL, log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'] }
    );

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
