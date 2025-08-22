/**
 * Role Specific Step Component
 * 
 * Final step with role-specific preferences and settings.
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileService } from '@/services/profileService';

interface RoleSpecificStepProps {
  data: {
    preferences?: any;
    goals?: string;
    boundaries?: any;
  };
  onChange: (data: any) => void;
  userRole: string;
}

export function RoleSpecificStep({ data, onChange, userRole }: RoleSpecificStepProps) {
  const [localData, setLocalData] = useState({
    preferences: data.preferences || {},
    goals: data.goals || '',
    boundaries: data.boundaries || {},
  });

  useEffect(() => {
    onChange(localData);
  }, [localData, onChange]);

  const updatePreference = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const toggleMultiselect = (field: string, option: string) => {
    const current = localData.preferences[field] || [];
    const updated = current.includes(option)
      ? current.filter((item: string) => item !== option)
      : [...current, option];
    updatePreference(field, updated);
  };

  const roleConfig = ProfileService.getRoleFormConfig(userRole);

  const renderField = (fieldKey: string, fieldConfig: any) => {
    const { type, label, options } = fieldConfig;

    if (type === 'select') {
      return (
        <div key={fieldKey} className="space-y-2">
          <Label className="text-base font-medium">{label}</Label>
          <Select
            value={localData.preferences[fieldKey] || ''}
            onValueChange={(value) => updatePreference(fieldKey, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Wählen Sie ${label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (type === 'multiselect') {
      const selectedValues = localData.preferences[fieldKey] || [];
      return (
        <div key={fieldKey} className="space-y-3">
          <Label className="text-base font-medium">{label}</Label>
          <div className="space-y-2">
            {options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldKey}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => toggleMultiselect(fieldKey, option.value)}
                />
                <Label
                  htmlFor={`${fieldKey}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'DOM': return 'Führungsstil & Präferenzen';
      case 'SUB': return 'Ziele & Persönliche Entwicklung';
      case 'OBSERVER': return 'Professionelle Informationen';
      default: return 'Rollenspezifische Einstellungen';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{getRoleTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {userRole === 'DOM' && 'Definieren Sie Ihren Führungsansatz und Ihre Präferenzen für die Beziehungsgestaltung.'}
            {userRole === 'SUB' && 'Teilen Sie Ihre Entwicklungsziele und Motivationen mit.'}
            {userRole === 'OBSERVER' && 'Beschreiben Sie Ihre professionelle Rolle und Ihren Hintergrund.'}
          </p>
        </CardContent>
      </Card>

      {/* Role-specific preferences */}
      {roleConfig.preferences && (
        <div className="space-y-6">
          {Object.entries(roleConfig.preferences).map(([fieldKey, fieldConfig]: [string, any]) =>
            renderField(fieldKey, fieldConfig)
          )}
        </div>
      )}

      {/* Goals (mainly for SUB and OBSERVER) */}
      {(userRole === 'SUB' || userRole === 'OBSERVER') && (
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {userRole === 'SUB' ? 'Ihre Entwicklungsziele' : 'Ihre Ziele in dieser Rolle'}
          </Label>
          <Textarea
            value={localData.goals}
            onChange={(e) => setLocalData(prev => ({ ...prev, goals: e.target.value }))}
            placeholder={
              userRole === 'SUB' 
                ? 'Was möchten Sie durch diese Beziehung erreichen oder entwickeln?'
                : 'Wie möchten Sie die Beteiligten unterstützen?'
            }
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Diese Informationen helfen bei der besseren Abstimmung der Erwartungen.
          </p>
        </div>
      )}

      {/* DOM specific goals */}
      {userRole === 'DOM' && (
        <div className="space-y-2">
          <Label className="text-base font-medium">Ihre Vision für die Beziehung</Label>
          <Textarea
            value={localData.goals}
            onChange={(e) => setLocalData(prev => ({ ...prev, goals: e.target.value }))}
            placeholder="Welche Entwicklung und welche Dynamik stellen Sie sich vor?"
            className="min-h-[100px]"
          />
        </div>
      )}

      {/* Success message */}
      {Object.keys(localData.preferences).length > 0 && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Ihre Einstellungen sind gespeichert und können jederzeit in den Profileinstellungen angepasst werden.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}