// Läuft als CommonJS, registriert ts-node zur Laufzeit
require('ts-node/register/transpile-only');

// ⚠️ Setze echte User-IDs aus deiner DB (z. B. via Prisma Studio oder SELECT):
const DOM_ID = process.env.SMOKE_DOM_ID || 'REPLACE_WITH_DOM_USER_ID';
const SUB_ID = process.env.SMOKE_SUB_ID || 'REPLACE_WITH_SUB_USER_ID';

(async () => {
  try {
    // ESM/TS Modul dynamisch importieren (wichtig bei "type":"module")
    const { connectionService } = await import('../src/services/connectionService.ts');

    console.log('1) createInvitation...');
    const inv = await connectionService.createInvitation(DOM_ID, 'sub@example.com', 1); // 1h gültig
    console.log('   invitation:', inv);

    console.log('2) validateInvitation...');
    const info = await connectionService.validateInvitation(inv.code);
    console.log('   validate:', info);

    console.log('3) createConnection...');
    const conn = await connectionService.createConnection(inv.code, SUB_ID);
    console.log('   connection:', conn);

    console.log('✓ Smoke test OK');
  } catch (e) {
    console.error('✗ Smoke test failed:', e?.status || '', e?.message || e);
    process.exit(1);
  }
})();
