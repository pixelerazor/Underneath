/**
 * Keuschheit Form Component
 * 
 * Form for documenting chastity-related entries
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
import { Lock } from 'lucide-react';

interface KeuschheitFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function KeuschheitForm({ data, onChange }: KeuschheitFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Keuschheit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              placeholder="Kurze Beschreibung des Eintrags..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Art des Eintrags</Label>
            <Select value={data.type || ''} onValueChange={(value) => updateField('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Art auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lockup">Verschluss</SelectItem>
                <SelectItem value="release">Freigabe</SelectItem>
                <SelectItem value="orgasm">Orgasmus</SelectItem>
                <SelectItem value="denial">Verweigerung</SelectItem>
                <SelectItem value="edge">Edging</SelectItem>
                <SelectItem value="punishment">Bestrafung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Dauer</Label>
            <Input
              id="duration"
              type="number"
              min="0"
              placeholder="Dauer in Minuten"
              value={data.duration || ''}
              onChange={(e) => updateField('duration', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">Gerät/Methode</Label>
            <Input
              id="device"
              placeholder="Verwendetes Gerät oder Methode..."
              value={data.device || ''}
              onChange={(e) => updateField('device', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Detaillierte Beschreibung der Erfahrung..."
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intensity">Intensität (1-10)</Label>
              <Input
                id="intensity"
                type="number"
                min="1"
                max="10"
                placeholder="z.B. 7"
                value={data.intensity || ''}
                onChange={(e) => updateField('intensity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="satisfaction">Zufriedenheit (1-10)</Label>
              <Input
                id="satisfaction"
                type="number"
                min="1"
                max="10"
                placeholder="z.B. 8"
                value={data.satisfaction || ''}
                onChange={(e) => updateField('satisfaction', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasPlanned"
                  checked={data.wasPlanned || false}
                  onCheckedChange={(checked) => updateField('wasPlanned', checked)}
                />
                <Label htmlFor="wasPlanned" className="text-sm">Geplant</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasPermission"
                  checked={data.wasPermission || false}
                  onCheckedChange={(checked) => updateField('wasPermission', checked)}
                />
                <Label htmlFor="wasPermission" className="text-sm">Mit Erlaubnis</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasReward"
                  checked={data.wasReward || false}
                  onCheckedChange={(checked) => updateField('wasReward', checked)}
                />
                <Label htmlFor="wasReward" className="text-sm">Als Belohnung</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasPunishment"
                  checked={data.wasPunishment || false}
                  onCheckedChange={(checked) => updateField('wasPunishment', checked)}
                />
                <Label htmlFor="wasPunishment" className="text-sm">Als Strafe</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Zusätzliche Notizen</Label>
            <Textarea
              id="notes"
              placeholder="Weitere Gedanken oder Beobachtungen..."
              rows={2}
              value={data.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}