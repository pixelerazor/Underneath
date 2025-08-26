/**
 * Stage Form Component
 * 
 * Form for creating new stages in the stage system
 * Uses the StageEntityConfig for extensible configuration
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trophy, AlertCircle } from 'lucide-react';

interface StageFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StageForm({ data, onChange }: StageFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Neue Stufe erstellen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Stage Number and Points */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stageNumber">Stufennummer *</Label>
              <Input
                id="stageNumber"
                type="number"
                min="1"
                max="20"
                placeholder="z.B. 5"
                value={data.stageNumber || ''}
                onChange={(e) => updateField('stageNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsStart">Punktestart *</Label>
              <Input
                id="pointsStart"
                type="number"
                min="0"
                placeholder="z.B. 500"
                value={data.pointsStart || ''}
                onChange={(e) => updateField('pointsStart', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsEnd">Punkteende</Label>
              <Input
                id="pointsEnd"
                type="number"
                min="0"
                placeholder="z.B. 999"
                value={data.pointsEnd || ''}
                onChange={(e) => updateField('pointsEnd', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leer lassen für unbegrenztes Ende
              </p>
            </div>
          </div>

          {/* Stage Name */}
          <div className="space-y-2">
            <Label htmlFor="stageName">Stufen Name *</Label>
            <Input
              id="stageName"
              placeholder="z.B. Anfänger, Fortgeschrittener, Experte..."
              value={data.stageName || ''}
              onChange={(e) => updateField('stageName', e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Beschreibe was diese Stufe auszeichnet und welche Privilegien/Verantwortungen sie mit sich bringt..."
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {/* Color Theme */}
          <div className="space-y-2">
            <Label htmlFor="colorTheme">Farb-Theme</Label>
            <Select value={data.colorTheme || ''} onValueChange={(value) => updateField('colorTheme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wähle ein Farb-Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">🔵 Blau (Vertrauen, Stabilität)</SelectItem>
                <SelectItem value="green">🟢 Grün (Wachstum, Harmonie)</SelectItem>
                <SelectItem value="purple">🟣 Lila (Weisheit, Luxus)</SelectItem>
                <SelectItem value="gold">🟡 Gold (Erfolg, Prestige)</SelectItem>
                <SelectItem value="red">🔴 Rot (Leidenschaft, Macht)</SelectItem>
                <SelectItem value="orange">🟠 Orange (Energie, Kreativität)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Features Selection */}
          <div className="space-y-3">
            <Label>Verfügbare Features in dieser Stufe</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasInitiationsriten"
                  checked={data.hasInitiationsriten || false}
                  onCheckedChange={(checked) => updateField('hasInitiationsriten', checked)}
                />
                <Label htmlFor="hasInitiationsriten" className="text-sm">Initiationsriten</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPrivilegien"
                  checked={data.hasPrivilegien || false}
                  onCheckedChange={(checked) => updateField('hasPrivilegien', checked)}
                />
                <Label htmlFor="hasPrivilegien" className="text-sm">Privilegien</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasStrafen"
                  checked={data.hasStrafen || false}
                  onCheckedChange={(checked) => updateField('hasStrafen', checked)}
                />
                <Label htmlFor="hasStrafen" className="text-sm">Strafensystem</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTPE"
                  checked={data.hasTPE || false}
                  onCheckedChange={(checked) => updateField('hasTPE', checked)}
                />
                <Label htmlFor="hasTPE" className="text-sm">TPE Elemente</Label>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-3">
            <Label>Erweiterte Einstellungen</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={data.isActive !== false} // Default to true
                  onCheckedChange={(checked) => updateField('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-sm">Stufe ist aktiv</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  checked={data.requiresApproval || false}
                  onCheckedChange={(checked) => updateField('requiresApproval', checked)}
                />
                <Label htmlFor="requiresApproval" className="text-sm">Stufenaufstieg erfordert DOM-Bestätigung</Label>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p><strong>Hinweis:</strong> Die Punkteberechnung ist eine Vorlage basierend auf der Stufennummer. 
              Diese Werte können später im Backend-System angepasst werden.</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}