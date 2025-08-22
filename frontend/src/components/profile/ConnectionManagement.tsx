/**
 * Connection Management Component
 * 
 * Provides UI for users to view and manage their current connection.
 * Shows connection details, partner information, and termination options.
 * 
 * Features:
 * - Display current connection status and partner info
 * - Connection duration and status indicators
 * - Terminate connection functionality with confirmation
 * - No connection state with invitation guidance
 * 
 * @component ConnectionManagement
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { User, Calendar, AlertTriangle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { ConnectionService, ConnectionResponse } from '@/services/connectionService';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ConnectionManagement() {
  const [connectionData, setConnectionData] = useState<ConnectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    loadConnectionData();
  }, []);

  const loadConnectionData = async () => {
    setLoading(true);
    try {
      const data = await ConnectionService.getMyConnection();
      setConnectionData(data);
    } catch (error) {
      console.error('Error loading connection data:', error);
      toast.error('Fehler beim Laden der Verbindungsdaten');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateConnection = async () => {
    if (!connectionData?.connection) return;

    setTerminating(true);
    try {
      await ConnectionService.terminateMyConnection();
      toast.success('Verbindung erfolgreich beendet');
      
      // Reload connection data to reflect changes
      await loadConnectionData();
    } catch (error: any) {
      const errorMessage = ConnectionService.getConnectionErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setTerminating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktuelle Verbindung</CardTitle>
          <CardDescription>Laden...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No active connection state
  if (!connectionData?.hasConnection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Keine aktive Verbindung
          </CardTitle>
          <CardDescription>
            Sie haben derzeit keine Verbindung zu einem {user?.role === 'DOM' ? 'SUB' : 'DOM'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Nächste Schritte:</strong>
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              {user?.role === 'DOM' ? (
                <>
                  <li>• Erstellen Sie eine Einladung für einen SUB</li>
                  <li>• Teilen Sie den Einladungscode mit dem gewünschten SUB</li>
                  <li>• Warten Sie auf die Annahme der Einladung</li>
                </>
              ) : (
                <>
                  <li>• Bitten Sie einen DOM um eine Einladung</li>
                  <li>• Verwenden Sie den erhaltenen Einladungscode</li>
                  <li>• Gehen Sie zu "Einladung annehmen" um den Code einzugeben</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Sobald eine Verbindung hergestellt ist, erscheinen hier die Verbindungsdetails.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const connection = connectionData.connection!;
  const partner = connection.partner;
  const statusText = ConnectionService.getConnectionStatusText(connection.status);
  const duration = ConnectionService.getConnectionDuration(connection.createdAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Aktuelle Verbindung
        </CardTitle>
        <CardDescription>
          Ihre Verbindung zu {partner.displayName || partner.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={connection.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {connection.status === 'ACTIVE' && <Check className="h-3 w-3 mr-1" />}
              {statusText}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {duration}
          </div>
        </div>

        {/* Partner Information */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Verbindungspartner ({partner.role})</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">E-Mail:</span>
              <span className="text-sm font-mono">{partner.email}</span>
            </div>
            {partner.displayName && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm">{partner.displayName}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verbunden seit:</span>
              <span className="text-sm">
                {new Date(connection.createdAt).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Actions */}
        {connection.status === 'ACTIVE' && (
          <div className="border-t pt-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Verbindung beenden
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Das Beenden der Verbindung kann nicht rückgängig gemacht werden. 
                    Beide Benutzer müssen eine neue Einladung erstellen, um sich wieder zu verbinden.
                  </p>
                </div>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={terminating}>
                  <X className="h-4 w-4 mr-2" />
                  Verbindung beenden
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Verbindung beenden?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sind Sie sicher, dass Sie die Verbindung zu {partner.displayName || partner.email} beenden möchten?
                    Diese Aktion kann nicht rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleTerminateConnection}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={terminating}
                  >
                    {terminating ? 'Beende...' : 'Verbindung beenden'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Terminated Connection Info */}
        {connection.status === 'TERMINATED' && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Diese Verbindung wurde beendet. Sie können eine neue Einladung erstellen 
              oder auf eine neue Einladung warten.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}