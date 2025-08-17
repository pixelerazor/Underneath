import { createTransport, Transporter } from 'nodemailer';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    // SMTP-Konfiguration aus env
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Teste SMTP-Verbindung beim Start
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection established successfully');
    } catch (error) {
      logger.error('SMTP connection failed:', error);
      throw new Error('Failed to establish SMTP connection');
    }
  }

  async sendInvitationEmail(to: string, code: string, domName: string): Promise<void> {
    try {
      // HTML Email Template
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Underneath - Einladung</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #7c3aed; /* Primary color */
            }
            .content {
              padding: 20px 0;
            }
            .code {
              background-color: #f3f4f6;
              padding: 12px 24px;
              border-radius: 6px;
              font-family: monospace;
              font-size: 24px;
              letter-spacing: 2px;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #7c3aed;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Underneath</div>
            </div>
            <div class="content">
              <h1>Willkommen bei Underneath</h1>
              <p>Hallo,</p>
              <p><strong>${domName}</strong> lädt dich ein, eine Verbindung auf Underneath aufzubauen.</p>
              
              <p>Dein persönlicher Einladungscode:</p>
              <div class="code">${code}</div>
              
              <p>Dieser Code ist <strong>48 Stunden</strong> gültig. Verwende ihn, um die Einladung anzunehmen und die Verbindung herzustellen.</p>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/join" class="button">
                  Einladung annehmen
                </a>
              </p>
              
              <p>Aus Sicherheitsgründen teile diesen Code mit niemandem. Er ist nur für dich bestimmt.</p>
            </div>
            <div class="footer">
              <p>Dies ist eine automatisch generierte E-Mail. Bitte antworte nicht darauf.</p>
              <p>© ${new Date().getFullYear()} Underneath - Sichere Verbindungen</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Text-Version als Fallback
      const text = `
        Underneath - Einladung
        
        Hallo,
        
        ${domName} lädt dich ein, eine Verbindung auf Underneath aufzubauen.
        
        Dein persönlicher Einladungscode: ${code}
        
        Dieser Code ist 48 Stunden gültig. Verwende ihn, um die Einladung anzunehmen und die Verbindung herzustellen.
        
        Besuche ${process.env.FRONTEND_URL}/join um die Einladung anzunehmen.
        
        Aus Sicherheitsgründen teile diesen Code mit niemandem. Er ist nur für dich bestimmt.
        
        © ${new Date().getFullYear()} Underneath - Sichere Verbindungen
      `;

      // Sende Email
      await this.transporter.sendMail({
        from: `"Underneath" <${process.env.SMTP_USER}>`,
        to,
        subject: `Underneath - Einladung von ${domName}`,
        text,
        html,
      });

      logger.info(`Invitation email sent successfully to ${to}`);
    } catch (error) {
      logger.error('Failed to send invitation email:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}

// Singleton-Instanz
export const emailService = new EmailService();
