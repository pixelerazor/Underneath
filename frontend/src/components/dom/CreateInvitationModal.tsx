import { useState } from 'react';
import { Copy, Mail, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { invitationService } from '@/services/invitationService';
import { useConnectionStore } from '@/store/useConnectionStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateInvitationModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateInvitationModal = ({ open, onClose }: CreateInvitationModalProps) => {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    setLoading(true);
    try {
      const invitation = await invitationService.createInvitation(
        email.trim() || '', // Email wird beim Erstellen berücksichtigt
        undefined // Keine custom message
      );

      if (invitation && invitation.code) {
        setInviteCode(invitation.code);
        // Update den Store mit dem neuen Code
        const store = useConnectionStore.getState();
        store.setInvitationCode(
          invitation.code,
          new Date(invitation.expiresAt)
        );
        
        // Erfolgs-Message abhängig davon, ob E-Mail erfolgreich versendet wurde
        if (email.trim()) {
          if (invitation.emailSent) {
            toast.success('Einladungscode erstellt und E-Mail versendet!', {
              description: `Einladung wurde erfolgreich an ${email} gesendet.`
            });
          } else {
            toast.warning('Einladungscode erstellt, E-Mail-Versand fehlgeschlagen', {
              description: `Code: ${invitation.code}. Bitte teile ihn manuell mit deinem Sub.`
            });
          }
        } else {
          toast.success('Einladungscode erstellt!', {
            description: 'Teile den Code manuell mit deinem Sub.'
          });
        }
      }
    } catch (error) {
      toast.error('Fehler beim Erstellen des Einladungscodes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (inviteCode) {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sub einladen</DialogTitle>
          <DialogDescription>
            Erstelle einen Einladungscode für deinen Sub. Der Code ist 24 Stunden gültig.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!inviteCode ? (
            <>
              {/* Email Input BEFORE generating code */}
              <div className="space-y-2">
                <Label htmlFor="email-input">E-Mail des Subs (optional):</Label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="sub@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Wenn angegeben, wird der Code automatisch per E-Mail versendet.
                </p>
              </div>
              
              <Button onClick={generateCode} className="w-full" disabled={loading}>
                {loading ? 'Generiere...' : email.trim() ? 'Code generieren & E-Mail senden' : 'Code generieren'}
              </Button>
            </>
          ) : (
            <>
              {/* Generated Code Display */}
              <div className="space-y-2">
                <Label>Dein Einladungscode:</Label>
                <div className="flex items-center space-x-2">
                  <Input value={inviteCode} readOnly className="font-mono text-center" />
                  <Button type="button" size="icon" variant="outline" onClick={copyToClipboard}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Info about email sending */}
              {email && (
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    📧 E-Mail wurde an <strong>{email}</strong> gesendet
                  </p>
                </div>
              )}

              {/* Info Alert */}
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Dieser Code ist 24 Stunden gültig und kann nur einmal verwendet werden.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvitationModal;