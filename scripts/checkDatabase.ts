import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkDatabase() {
  try {
    console.log('Checking database connection...');

    // Check connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Check users
    const users = await prisma.user.findMany();
    console.log('Existing users:', users);

    // Check if our test users exist
    const domUser = await prisma.user.findUnique({
      where: { id: process.env.SMOKE_DOM_ID },
    });
    const subUser = await prisma.user.findUnique({
      where: { id: process.env.SMOKE_SUB_ID },
    });

    console.log('Test DOM user:', domUser);
    console.log('Test SUB user:', subUser);
  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

console.log('Starting database check...');
console.log('Test IDs:', {
  domId: process.env.SMOKE_DOM_ID,
  subId: process.env.SMOKE_SUB_ID,
});

checkDatabase().catch(console.error);
