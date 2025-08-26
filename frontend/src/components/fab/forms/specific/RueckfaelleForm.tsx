/**
 * Rückfälle Form Component
 * 
 * Form for documenting relapses
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
import { AlertTriangle } from 'lucide-react';

interface RueckfaelleFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function RueckfaelleForm({ data, onChange }: RueckfaelleFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Rückfall Dokumentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Rückfall Beschreibung *</Label>
            <Input
              id="title"
              placeholder="Was ist passiert?"
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Art des Rückfalls</Label>
            <Select value={data.type || ''} onValueChange={(value) => updateField('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Art auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rule_violation">Regelverstoß</SelectItem>
                <SelectItem value="behavioral">Verhaltensrückfall</SelectItem>
                <SelectItem value="emotional">Emotionaler Rückfall</SelectItem>
                <SelectItem value="addiction">Suchtverhalten</SelectItem>
                <SelectItem value="communication">Kommunikationsfehler</SelectItem>
                <SelectItem value="discipline">Disziplinverlust</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Schweregrad</Label>
            <Select value={data.severity || 'medium'} onValueChange={(value) => updateField('severity', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Geringfügig</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="major">Schwer</SelectItem>
                <SelectItem value="critical">Kritisch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggers">Auslöser *</Label>
            <Textarea
              id="triggers"
              placeholder="Was hat zum Rückfall geführt?"
              rows={2}
              value={data.triggers || ''}
              onChange={(e) => updateField('triggers', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaillierte Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Genauer Verlauf und Umstände des Rückfalls..."
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer</Label>
              <Input
                id="duration"
                placeholder="Wie lange hat es gedauert?"
                value={data.duration || ''}
                onChange={(e) => updateField('duration', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsPenalty">Punktabzug</Label>
              <Input
                id="pointsPenalty"
                type="number"
                min="0"
                placeholder="z.B. 20"
                value={data.pointsPenalty || ''}
                onChange={(e) => updateField('pointsPenalty', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotions">Gefühle dabei</Label>
            <Input
              id="emotions"
              placeholder="Welche Emotionen waren beteiligt?"
              value={data.emotions || ''}
              onChange={(e) => updateField('emotions', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasReported"
                  checked={data.wasReported || false}
                  onCheckedChange={(checked) => updateField('wasReported', checked)}
                />
                <Label htmlFor="wasReported" className="text-sm">Gemeldet</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasIntentional"
                  checked={data.wasIntentional || false}
                  onCheckedChange={(checked) => updateField('wasIntentional', checked)}
                />
                <Label htmlFor="wasIntentional" className="text-sm">Vorsätzlich</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresAction"
                  checked={data.requiresAction || false}
                  onCheckedChange={(checked) => updateField('requiresAction', checked)}
                />
                <Label htmlFor="requiresAction" className="text-sm">Maßnahmen erforderlich</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasConsequences"
                  checked={data.hasConsequences || false}
                  onCheckedChange={(checked) => updateField('hasConsequences', checked)}
                />
                <Label htmlFor="hasConsequences" className="text-sm">Hat Konsequenzen</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prevention">Präventionsmaßnahmen</Label>
            <Textarea
              id="prevention"
              placeholder="Wie kann sowas in Zukunft verhindert werden?"
              rows={2}
              value={data.prevention || ''}
              onChange={(e) => updateField('prevention', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lessons">Erkenntnisse</Label>
            <Textarea
              id="lessons"
              placeholder="Was hast du daraus gelernt?"
              rows={2}
              value={data.lessons || ''}
              onChange={(e) => updateField('lessons', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}