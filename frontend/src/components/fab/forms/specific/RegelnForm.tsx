/**
 * Regeln Form Component
 * 
 * Form for creating rules
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
import { BookOpen } from 'lucide-react';

interface RegelnFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function RegelnForm({ data, onChange }: RegelnFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Regeln
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Regel Titel *</Label>
            <Input
              id="title"
              placeholder="Kurze Beschreibung der Regel..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaillierte Beschreibung *</Label>
            <Textarea
              id="description"
              placeholder="Vollständige Beschreibung der Regel und was sie beinhaltet..."
              rows={4}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavior">Verhalten</SelectItem>
                <SelectItem value="communication">Kommunikation</SelectItem>
                <SelectItem value="time">Zeit</SelectItem>
                <SelectItem value="personal">Persönlich</SelectItem>
                <SelectItem value="safety">Sicherheit</SelectItem>
                <SelectItem value="respect">Respekt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Schweregrad</Label>
              <Select value={data.severity || 'medium'} onValueChange={(value) => updateField('severity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Info</SelectItem>
                  <SelectItem value="medium">Warnung</SelectItem>
                  <SelectItem value="high">Strikt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsPenalty">Punktabzug bei Verstoß</Label>
              <Input
                id="pointsPenalty"
                type="number"
                min="0"
                placeholder="z.B. 10"
                value={data.pointsPenalty || ''}
                onChange={(e) => updateField('pointsPenalty', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consequences">Konsequenzen bei Verstoß</Label>
            <Textarea
              id="consequences"
              placeholder="Was passiert bei einem Regelverstoß?"
              rows={2}
              value={data.consequences || ''}
              onChange={(e) => updateField('consequences', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={data.isActive !== false}
                  onCheckedChange={(checked) => updateField('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-sm">Aktiv</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowsWarning"
                  checked={data.allowsWarning || false}
                  onCheckedChange={(checked) => updateField('allowsWarning', checked)}
                />
                <Label htmlFor="allowsWarning" className="text-sm">Warnung erlaubt</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={data.isPublic !== false}
                  onCheckedChange={(checked) => updateField('isPublic', checked)}
                />
                <Label htmlFor="isPublic" className="text-sm">Öffentlich sichtbar</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresExplanation"
                  checked={data.requiresExplanation || false}
                  onCheckedChange={(checked) => updateField('requiresExplanation', checked)}
                />
                <Label htmlFor="requiresExplanation" className="text-sm">Begründung erforderlich</Label>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}