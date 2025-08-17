import { useState } from 'react';
import { Crown, Send, Info, Clock, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/useAuthStore';
import { useConnectionStore } from '@/store/useConnectionStore';
import CreateInvitationModal from './CreateInvitationModal';

export function WelcomeScreen() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { invitationCode, codeExpiresAt } = useConnectionStore();

  const copyCode = async () => {
    if (invitationCode) {
      await navigator.clipboard.writeText(invitationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if code is expired
  const isCodeExpired = codeExpiresAt ? new Date() > new Date(codeExpiresAt) : false;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="border-b p-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-semibold">DOM {user?.displayName || user?.email}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Willkommen, {user?.displayName || 'DOM'}</CardTitle>
            <CardDescription>
              Um Underneath zu nutzen, musst du eine Verbindung mit einem Sub eingehen.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Existing Code Display */}
            {invitationCode && !isCodeExpired && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Aktiver Einladungscode:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted px-2 py-1 rounded font-mono text-center">
                        {invitationCode}
                      </code>
                      <Button size="sm" variant="outline" onClick={copyCode}>
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Gültig bis: {new Date(codeExpiresAt!).toLocaleString('de-DE')}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Anleitung */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">So funktioniert's:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Erstelle einen Einladungscode</li>
                    <li>Teile den Code mit deinem Sub (per Mail oder Messenger)</li>
                    <li>Sub registriert sich und gibt den Code ein</li>
                    <li>Verbindung wird hergestellt</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {(!invitationCode || isCodeExpired) && (
              <Button className="w-full" size="lg" onClick={() => setShowInviteModal(true)}>
                <Send className="mr-2 h-4 w-4" />
                Einladungscode erstellen
              </Button>
            )}

            {invitationCode && !isCodeExpired && (
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">
                  Warte auf die Registrierung deines Subs...
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowInviteModal(true)}
                >
                  Neuen Code erstellen
                </Button>
              </div>
            )}

            {/* Dev Mode Toggle */}
            {import.meta.env.DEV && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center mb-2">Development Mode</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Setze Mock-Sub in Store
                    const mockSub = {
                      id: 'dev-1',
                      name: 'Dev Sub',
                      level: 1,
                      levelTitle: 'Anfänger',
                      points: 0,
                      maxPoints: 100,
                    };
                    useConnectionStore.getState().setConnection(mockSub);
                  }}
                >
                  🛠️ Mock Sub verbinden (Dev)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Invitation Modal */}
      <CreateInvitationModal open={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </div>
  );
}
