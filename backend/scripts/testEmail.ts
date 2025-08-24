import { config } from 'dotenv';
config(); // Load .env file

import { emailService } from '../src/services/emailService';

(async () => {
  try {
    console.log('🧪 Teste E-Mail-Service mit Mailpit...');
    await emailService.sendInvitationEmail('test@example.com', 'TST-123-456', 'TestDOM');
    console.log('✅ Test-E-Mail erfolgreich an Mailpit gesendet!');
    console.log('🌐 Öffne http://localhost:8025 um die E-Mail zu sehen');
  } catch (e) {
    console.error('❌ E-Mail-Versand fehlgeschlagen:', e);
    process.exit(1);
  }
})();
