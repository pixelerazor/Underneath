// backend/src/services/emailService.ts
import { createTransport, Transporter } from 'nodemailer';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/errors';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: Transporter;
  private readonly config: EmailConfig;

  constructor() {
    // Validiere erforderliche Umgebungsvariablen
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Fehlende SMTP-Konfiguration: ${missingVars.join(', ')}`);
    }

    this.config = {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
      }
    };

    this.transporter = createTransport(this.config);
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('SMTP-Verbindung erfolgreich verifiziert');
    } catch (error) {
      logger.error('SMTP-Verbindungsfehler:', error);
      throw new CustomError('SMTP_ERROR', 'E-Mail-Service nicht verfügbar');
    }
  }

  async sendInvitationEmail(to: string, code: string, domName: string): Promise<void> {
    try {
      const html = this.getInvitationTemplate(code, domName);
      const text = this.getInvitationText(code, domName);

      await this.transporter.sendMail({
        from: `"Underneath" <${this.config.auth.user}>`,
        to,
        subject: `Underneath - Einladung von ${domName}`,
        text,
        html,
      });

      logger.info(`Einladungs-E-Mail erfolgreich gesendet an ${to}`);
    } catch (error) {
      logger.error('Fehler beim E-Mail-Versand:', error);
      throw new CustomError('EMAIL_SEND_ERROR', 'E-Mail konnte nicht gesendet werden');
    }
  }

  private getInvitationTemplate(code: string, domName: string): string {
    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Underneath - Einladung</title>
        <style>
          /* Dark Mode optimierte Styles */
          :root {
            color-scheme: dark;
          }
          body {
            background-color: #1a1a1a;
            color: #e5e5e5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #2a2a2a;
            border-radius: 8px;
          }
          .code {
            background-color: #3a3a3a;
            color: #7c3aed;
            padding: 12px 24px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 24px;
            letter-spacing: 2px;
            text-align: center;
            margin: 20px 0;
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
          <h1>Willkommen bei Underneath</h1>
          <p>Hallo,</p>
          <p><strong>${domName}</strong> lädt dich ein, eine Verbindung aufzubauen.</p>
          
          <p>Dein persönlicher Einladungscode:</p>
          <div class="code">${code}</div>
          
          <p>Dieser Code ist <strong>48 Stunden</strong> gültig.</p>
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/join" class="button">
              Einladung annehmen
            </a>
          </p>
          
          <p><strong>Sicherheitshinweis:</strong> Teile diesen Code mit niemandem.</p>
        </div>
      </body>
      </html>`;
  }

  private getInvitationText(code: string, domName: string): string {
    return `
      Underneath - Einladung
      
      Hallo,
      
      ${domName} lädt dich ein, eine Verbindung auf Underneath aufzubauen.
      
      Dein persönlicher Einladungscode: ${code}
      
      Dieser Code ist 48 Stunden gültig.
      
      Besuche ${process.env.FRONTEND_URL}/join um die Einladung anzunehmen.
      
      Sicherheitshinweis: Teile diesen Code mit niemandem.
    `.trim();
  }
}

export const emailService = new EmailService();