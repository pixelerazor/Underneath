import { ConnectionService } from '../src/services/connectionService';

const connectionService = new ConnectionService();

async function smokeTest() {
  const domId = process.env.SMOKE_DOM_ID;
  const subId = process.env.SMOKE_SUB_ID;

  if (!domId || !subId) {
    console.error('Missing required environment variables SMOKE_DOM_ID or SMOKE_SUB_ID');
    process.exit(1);
  }

  try {
    // Erst eine Einladung erstellen
    console.log('Creating invitation...');
    const invitation = await connectionService.createInvitation(domId, 'smoke@test.com');
    console.log('Invitation created:', invitation);

    // Dann die Connection mit dem Code erstellen
    console.log('Creating connection...');
    const connection = await connectionService.createConnection(invitation.code, subId);

    console.log('✓ Smoke test passed:', {
      invitation: invitation,
      connection: connection,
    });
    process.exit(0);
  } catch (error) {
    console.error('✗ Smoke test failed: ', error);
    process.exit(1);
  }
}

console.log('Starting smoke test...');
smokeTest().catch((error) => {
  console.error('Unhandled error in smoke test:', error);
  process.exit(1);
});
