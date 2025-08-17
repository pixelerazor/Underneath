import { useState } from 'react';
import { Copy, Mail, Clock, Check } from 'lucide-react';
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
    // Simuliere API Call
    setTimeout(() => {
      setInviteCode(
        'DOM-' +
          Math.random().toString(36).substring(2, 6).toUpperCase() +
          '-' +
          Math.random().toString(36).substring(2, 6).toUpperCase()
      );
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    if (inviteCode) {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendEmail = async () => {
    // Platzhalter für Email-Versand
    console.log('Sending to:', email);
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
            <Button onClick={generateCode} className="w-full" disabled={loading}>
              {loading ? 'Generiere...' : 'Code generieren'}
            </Button>
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

              {/* Email Option */}
              <div className="space-y-2">
                <Label htmlFor="email">Per E-Mail versenden (optional):</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="sub@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={sendEmail}
                    disabled={!email}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

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
