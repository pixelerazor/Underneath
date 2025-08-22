/**
 * Basic Info Step Component
 * 
 * First step of profile completion - collects basic user information
 * like preferred name and experience level.
 * 
 * @component BasicInfoStep
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BasicInfoStepProps {
  data: {
    preferredName?: string;
    experienceLevel?: string;
  };
  onChange: (data: any) => void;
  userRole: string;
}

export function BasicInfoStep({ data, onChange, userRole }: BasicInfoStepProps) {
  const [localData, setLocalData] = useState({
    preferredName: data.preferredName || '',
    experienceLevel: data.experienceLevel || '',
  });

  // Update parent when local data changes
  useEffect(() => {
    onChange(localData);
  }, [localData, onChange]);

  const handleInputChange = (field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'DOM':
        return 'Als DOM haben Sie die Führungsrolle in der Beziehung und können Aufgaben, Regeln und Belohnungen verwalten.';
      case 'SUB':
        return 'Als SUB folgen Sie der Führung und arbeiten an Ihren persönlichen Entwicklungszielen.';
      case 'OBSERVER':
        return 'Als OBSERVER haben Sie Einblick in die Beziehungsdynamik zur Unterstützung und Beratung.';
      default:
        return 'Ihre Rolle bestimmt, welche Funktionen Ihnen zur Verfügung stehen.';
    }
  };

  const getExperienceLevels = () => [
    { value: 'BEGINNER', label: 'Anfänger - Neu in DS-Beziehungen' },
    { value: 'EXPERIENCED', label: 'Erfahren - Mehrere Jahre Erfahrung' },
    { value: 'EXPERT', label: 'Expert - Sehr erfahren und kenntnisreich' },
  ];

  const getPreferredNamePlaceholder = (role: string) => {
    switch (role) {
      case 'DOM':
        return 'z.B. Sir, Master, Mistress, oder Ihr Name...';
      case 'SUB':
        return 'z.B. Ihr Vorname oder gewünschte Anrede...';
      case 'OBSERVER':
        return 'z.B. Dr. Schmidt, Coach Miller...';
      default:
        return 'Wie möchten Sie angesprochen werden?';
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Confirmation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            Ihre Rolle
            <Badge variant="secondary">{userRole}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {getRoleDescription(userRole)}
          </p>
        </CardContent>
      </Card>

      {/* Preferred Name */}
      <div className="space-y-2">
        <Label htmlFor="preferredName" className="text-base font-medium">
          Bevorzugte Anrede
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="preferredName"
          value={localData.preferredName}
          onChange={(e) => handleInputChange('preferredName', e.target.value)}
          placeholder={getPreferredNamePlaceholder(userRole)}
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          {userRole === 'DOM' 
            ? 'Wie soll Ihr SUB Sie ansprechen? Dies kann jederzeit geändert werden.'
            : userRole === 'SUB'
            ? 'Wie möchten Sie von Ihrem DOM angesprochen werden?'
            : 'Wie sollen andere Sie in der Plattform ansprechen?'
          }
        </p>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label htmlFor="experienceLevel" className="text-base font-medium">
          Erfahrungslevel
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={localData.experienceLevel}
          onValueChange={(value) => handleInputChange('experienceLevel', value)}
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder="Wählen Sie Ihr Erfahrungslevel..." />
          </SelectTrigger>
          <SelectContent>
            {getExperienceLevels().map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Dies hilft uns, die Erfahrung an Ihr Wissen anzupassen.
        </p>
      </div>

      {/* Experience Level Description */}
      {localData.experienceLevel && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm">
              {localData.experienceLevel === 'BEGINNER' && 
                '🌱 Als Anfänger erhalten Sie zusätzliche Erklärungen und sanfte Einführungen in neue Konzepte.'
              }
              {localData.experienceLevel === 'EXPERIENCED' && 
                '🌿 Mit Ihrer Erfahrung können Sie fortgeschrittene Features nutzen und komplexere Szenarien bearbeiten.'
              }
              {localData.experienceLevel === 'EXPERT' && 
                '🌳 Als Expert haben Sie Zugriff auf alle erweiterten Funktionen und Anpassungsmöglichkeiten.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Validation Hints */}
      {(!localData.preferredName || !localData.experienceLevel) && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ Bitte füllen Sie alle erforderlichen Felder aus, um fortzufahren.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}