import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

export const connectDB = async() => {
    try {
        await prisma.$connect();
        console.log('postgreSQL connected successfully')
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'connection to postgreSQL failed!')
    }
}