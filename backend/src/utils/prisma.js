const { PrismaClient } = require('@prisma/client')

// Create a global variable to store the Prisma instance
const globalForPrisma = globalThis

// Initialize Prisma Client
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Connection test function
const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('🐘 PostgreSQL Connected via Prisma')
    console.log('📊 Database: Supabase PostgreSQL')
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    process.exit(1)
  }
}

// Graceful shutdown
const disconnectDB = async () => {
  await prisma.$disconnect()
  console.log('🔌 Database disconnected')
}

module.exports = { prisma, connectDB, disconnectDB }