import { emailService } from '../src/services/emailService';

(async () => {
  try {
    await emailService.sendInvitationEmail('b.schauff@gmail.com', 'ABC-123-XYZ', 'DomName');
    console.log('✓ Testmail verschickt');
  } catch (e) {
    console.error('✗ Versand fehlgeschlagen:', e);
    process.exit(1);
  }
})();
