import { PrismaClient } from '@prisma/client';

// Definiere die Enums lokal, da sie nicht direkt aus @prisma/client exportiert werden
enum UserRole {
  ADMIN = 'ADMIN',
  DOM = 'DOM',
  SUB = 'SUB',
  OBSERVER = 'OBSERVER',
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// Singleton Prisma-Client erstellen
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function setup() {
  console.log('Setting up test environment...');

  try {
    // Cleanup first
    console.log('Cleaning up old test data...');
    await prisma.connection.deleteMany({
      where: {
        OR: [{ domId: process.env.SMOKE_DOM_ID }, { subId: process.env.SMOKE_SUB_ID }],
      },
    });

    await prisma.invitation.deleteMany({
      where: { domId: process.env.SMOKE_DOM_ID },
    });

    // Create or update test users
    console.log('Creating test users...');
    const domUser = await prisma.user.upsert({
      where: { id: process.env.SMOKE_DOM_ID },
      create: {
        id: process.env.SMOKE_DOM_ID!,
        email: 'smoke.dom@test.com',
        passwordHash: 'dummy_hash_for_testing',
        role: 'DOM' as const,
        status: 'ACTIVE' as const,
      },
      update: {
        role: 'DOM' as const,
        status: 'ACTIVE' as const,
      },
    });
    console.log('DOM user created:', domUser);

    const subUser = await prisma.user.upsert({
      where: { id: process.env.SMOKE_SUB_ID },
      create: {
        id: process.env.SMOKE_SUB_ID!,
        email: 'smoke.sub@test.com',
        passwordHash: 'dummy_hash_for_testing',
        role: 'SUB' as const,
        status: 'ACTIVE' as const,
      },
      update: {
        role: 'SUB' as const,
        status: 'ACTIVE' as const,
      },
    });
    console.log('SUB user created:', subUser);

    // Verify users were created
    const verifyDom = await prisma.user.findUnique({ where: { id: domUser.id } });
    const verifySub = await prisma.user.findUnique({ where: { id: subUser.id } });

    if (!verifyDom || !verifySub) {
      throw new Error('Failed to verify user creation');
    }

    console.log('Test users verified:', {
      dom: { id: verifyDom.id, email: verifyDom.email, role: verifyDom.role },
      sub: { id: verifySub.id, email: verifySub.email, role: verifySub.role },
    });

    return { domUser: verifyDom, subUser: verifySub };
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}

async function runTest(domUser: any, subUser: any) {
  try {
    // Import the connectionService here to ensure prisma is initialized
    const { connectionService } = await import('../backend/src/services/connectionService.js');

    // Create invitation
    console.log('Creating invitation...');
    const invitation = await connectionService.createInvitation(domUser.id, 'smoke@test.com');
    console.log('Invitation created:', invitation);

    // Create connection
    console.log('Creating connection...');
    const connection = await connectionService.createConnection(invitation.code, subUser.id);
    console.log('Connection created:', connection);

    return { invitation, connection };
  } catch (error) {
    console.error('Test execution failed:', error);
    throw error;
  }
}

async function smokeTest() {
  if (!process.env.SMOKE_DOM_ID || !process.env.SMOKE_SUB_ID) {
    console.error('Missing required environment variables SMOKE_DOM_ID or SMOKE_SUB_ID');
    process.exit(1);
  }

  try {
    // Setup phase
    const { domUser, subUser } = await setup();

    // Test phase
    const result = await runTest(domUser, subUser);

    console.log('✓ Smoke test passed:', {
      users: {
        dom: { id: domUser.id, email: domUser.email },
        sub: { id: subUser.id, email: subUser.email },
      },
      invitation: result.invitation,
      connection: result.connection,
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Smoke test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Start the test
console.log('Starting smoke test...');
console.log('Environment:', {
  domId: process.env.SMOKE_DOM_ID,
  subId: process.env.SMOKE_SUB_ID,
  nodeEnv: process.env.NODE_ENV,
});

smokeTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    prisma.$disconnect().then(() => process.exit(1));
  });
