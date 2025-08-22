/**
 * Communication Step Component
 * 
 * Third step of profile completion - communication preferences.
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommunicationStepProps {
  data: {
    communication?: {
      frequency?: string;
      style?: string;
      contactMethods?: string[];
      emergencyContact?: boolean;
    };
  };
  onChange: (data: any) => void;
  userRole: string;
}

export function CommunicationStep({ data, onChange, userRole }: CommunicationStepProps) {
  const [localData, setLocalData] = useState({
    communication: {
      frequency: data.communication?.frequency || '',
      style: data.communication?.style || '',
      contactMethods: data.communication?.contactMethods || [],
      emergencyContact: data.communication?.emergencyContact || false,
    },
  });

  useEffect(() => {
    onChange({ communication: localData.communication });
  }, [localData, onChange]);

  const updateField = (field: string, value: any) => {
    setLocalData(prev => ({
      communication: {
        ...prev.communication,
        [field]: value,
      },
    }));
  };

  const toggleContactMethod = (method: string) => {
    const methods = localData.communication.contactMethods;
    const newMethods = methods.includes(method)
      ? methods.filter(m => m !== method)
      : [...methods, method];
    updateField('contactMethods', newMethods);
  };

  const frequencies = [
    { value: 'daily', label: 'Täglich' },
    { value: 'every_few_days', label: 'Alle paar Tage' },
    { value: 'weekly', label: 'Wöchentlich' },
    { value: 'as_needed', label: 'Bei Bedarf' },
  ];

  const styles = [
    { value: 'formal', label: 'Formell' },
    { value: 'casual', label: 'Entspannt' },
    { value: 'structured', label: 'Strukturiert' },
    { value: 'flexible', label: 'Flexibel' },
  ];

  const contactMethods = [
    { value: 'app_notifications', label: 'App-Benachrichtigungen' },
    { value: 'email', label: 'E-Mail' },
    { value: 'push_notifications', label: 'Push-Notifications' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kommunikationseinstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Wie möchten Sie kommunizieren und benachrichtigt werden?
          </p>
        </CardContent>
      </Card>

      {/* Communication Frequency */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Kommunikationshäufigkeit
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Select value={localData.communication.frequency} onValueChange={(value) => updateField('frequency', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Wie oft möchten Sie kommunizieren?" />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map((freq) => (
              <SelectItem key={freq.value} value={freq.value}>
                {freq.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Communication Style */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Kommunikationsstil
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Select value={localData.communication.style} onValueChange={(value) => updateField('style', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Welchen Kommunikationsstil bevorzugen Sie?" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contact Methods */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Benachrichtigungsmethoden</Label>
        <div className="space-y-3">
          {contactMethods.map((method) => (
            <div key={method.value} className="flex items-center space-x-2">
              <Checkbox
                id={method.value}
                checked={localData.communication.contactMethods.includes(method.value)}
                onCheckedChange={() => toggleContactMethod(method.value)}
              />
              <Label htmlFor={method.value} className="text-sm font-normal cursor-pointer">
                {method.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      {userRole !== 'OBSERVER' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="emergencyContact"
            checked={localData.communication.emergencyContact}
            onCheckedChange={(checked) => updateField('emergencyContact', checked)}
          />
          <Label htmlFor="emergencyContact" className="text-sm">
            Bei wichtigen Situationen außerhalb der normalen Zeiten kontaktieren
          </Label>
        </div>
      )}

      {/* Validation */}
      {(!localData.communication.frequency || !localData.communication.style) && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ Bitte wählen Sie Häufigkeit und Stil der Kommunikation aus.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}