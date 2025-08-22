import { PrismaClient, Connection, Invitation, UserRole } from '@prisma/client';

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function setup() {
  console.log('Setting up test environment...');

  try {
    await prisma.connection.deleteMany({
      where: {
        OR: [{ domId: process.env.SMOKE_DOM_ID }, { subId: process.env.SMOKE_SUB_ID }],
      },
    });

    await prisma.invitation.deleteMany({
      where: { domId: process.env.SMOKE_DOM_ID },
    });

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
    const verifyDom = await prisma.user.findUnique({ where: { id: domUser.id } });
    const verifySub = await prisma.user.findUnique({ where: { id: subUser.id } });

    if (!verifyDom || !verifySub) {
      throw new Error('Failed to verify user creation');
    }

    return { domUser: verifyDom, subUser: verifySub };
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}

async function runTest(domUser: any, subUser: any) {
  try {
    const connectionService = new ConnectionService(prisma);
    const connection = await connectionService.createConnection(domUser.id, subUser.id);
    return { connection };
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
    const { domUser, subUser } = await setup();
    const result = await runTest(domUser, subUser);

    console.log('✓ Smoke test passed:', {
      users: {
        dom: { id: domUser.id, email: domUser.email },
        sub: { id: subUser.id, email: subUser.email }
      },
      connection: result.connection
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Smoke test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

console.log('Starting smoke test...');
console.log('Environment:', {
  domId: process.env.SMOKE_DOM_ID,
  subId: process.env.SMOKE_SUB_ID,
  nodeEnv: process.env.NODE_ENV,
});

class ConnectionService {
  constructor(private prisma: PrismaClient) {}

  async checkExistingConnection(domId: string, subId: string): Promise<boolean> {
    const connection = await this.prisma.connection.findFirst({
      where: {
        AND: [
          { domId },
          { subId },
          { status: 'ACTIVE' },
        ],
      },
    });
    return !!connection;
  }

  async createConnection(domId: string, subId: string): Promise<Connection> {
    try {
      const exists = await this.checkExistingConnection(domId, subId);
      if (exists) {
        throw new Error('Eine Verbindung zwischen diesen Nutzern existiert bereits');
      }

      const [dom, sub] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: domId }}),
        this.prisma.user.findUnique({ where: { id: subId }})
      ]);

      if (!dom || dom.role !== UserRole.DOM) {
        throw new Error('Der erste Nutzer muss ein DOM sein');
      }
      if (!sub || sub.role !== UserRole.SUB) {
        throw new Error('Der zweite Nutzer muss ein SUB sein');
      }

      return await this.prisma.connection.create({
        data: {
          domId,
          subId,
          status: 'ACTIVE',
        },
      });
    } catch (error) {
      console.error('Fehler beim Erstellen der Verbindung:', error);
      throw error;
    }
  }

  async terminateConnection(connectionId: string, userId: string): Promise<Connection> {
    try {
      const connection = await this.prisma.connection.findUnique({
        where: { id: connectionId },
      });

      if (!connection) {
        throw new Error('Verbindung nicht gefunden');
      }

      if (connection.domId !== userId) {
        throw new Error('Nur der DOM kann eine Verbindung beenden');
      }

      return await this.prisma.connection.update({
        where: { id: connectionId },
        data: {
          status: 'TERMINATED',
          endedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Fehler beim Beenden der Verbindung:', error);
      throw error;
    }
  }
}

smokeTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    prisma.$disconnect().then(() => process.exit(1));
  });

