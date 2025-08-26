/**
 * Trigger Form Component
 * 
 * Form for identifying and documenting triggers
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
import { Zap } from 'lucide-react';

interface TriggerFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function TriggerForm({ data, onChange }: TriggerFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Trigger Identifikation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Trigger Beschreibung *</Label>
            <Input
              id="title"
              placeholder="Was hat als Trigger gewirkt?"
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Trigger Art</Label>
            <Select value={data.type || ''} onValueChange={(value) => updateField('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Art auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emotional">Emotional</SelectItem>
                <SelectItem value="situational">Situationsbedingt</SelectItem>
                <SelectItem value="visual">Visuell</SelectItem>
                <SelectItem value="auditory">Akustisch</SelectItem>
                <SelectItem value="physical">Körperlich</SelectItem>
                <SelectItem value="social">Sozial</SelectItem>
                <SelectItem value="temporal">Zeitlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaillierte Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Genaue Beschreibung des Triggers und der Situation..."
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
                placeholder="Wie stark war der Trigger?"
                value={data.intensity || ''}
                onChange={(e) => updateField('intensity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Häufigkeit</Label>
              <Select value={data.frequency || ''} onValueChange={(value) => updateField('frequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wie oft?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rare">Selten</SelectItem>
                  <SelectItem value="occasional">Gelegentlich</SelectItem>
                  <SelectItem value="regular">Regelmäßig</SelectItem>
                  <SelectItem value="frequent">Häufig</SelectItem>
                  <SelectItem value="constant">Ständig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Reaktion/Antwort</Label>
            <Textarea
              id="response"
              placeholder="Wie hast du auf den Trigger reagiert?"
              rows={2}
              value={data.response || ''}
              onChange={(e) => updateField('response', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Kontext/Umstände</Label>
            <Textarea
              id="context"
              placeholder="In welcher Situation ist der Trigger aufgetreten?"
              rows={2}
              value={data.context || ''}
              onChange={(e) => updateField('context', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emotions">Ausgelöste Emotionen</Label>
              <Input
                id="emotions"
                placeholder="Welche Gefühle entstanden?"
                value={data.emotions || ''}
                onChange={(e) => updateField('emotions', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalReaction">Körperliche Reaktion</Label>
              <Input
                id="physicalReaction"
                placeholder="Körperliche Symptome"
                value={data.physicalReaction || ''}
                onChange={(e) => updateField('physicalReaction', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasExpected"
                  checked={data.wasExpected || false}
                  onCheckedChange={(checked) => updateField('wasExpected', checked)}
                />
                <Label htmlFor="wasExpected" className="text-sm">War erwartet</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasManaged"
                  checked={data.wasManaged || false}
                  onCheckedChange={(checked) => updateField('wasManaged', checked)}
                />
                <Label htmlFor="wasManaged" className="text-sm">Gut bewältigt</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="causedRelapse"
                  checked={data.causedRelapse || false}
                  onCheckedChange={(checked) => updateField('causedRelapse', checked)}
                />
                <Label htmlFor="causedRelapse" className="text-sm">Führte zu Rückfall</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={data.isRecurring || false}
                  onCheckedChange={(checked) => updateField('isRecurring', checked)}
                />
                <Label htmlFor="isRecurring" className="text-sm">Wiederkehrend</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="copingStrategies">Bewältigungsstrategien</Label>
            <Textarea
              id="copingStrategies"
              placeholder="Welche Strategien helfen bei diesem Trigger?"
              rows={2}
              value={data.copingStrategies || ''}
              onChange={(e) => updateField('copingStrategies', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prevention">Prävention</Label>
            <Textarea
              id="prevention"
              placeholder="Wie kann dieser Trigger in Zukunft vermieden werden?"
              rows={2}
              value={data.prevention || ''}
              onChange={(e) => updateField('prevention', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}