/**
 * TPE Form Component
 * 
 * Form for documenting Total Power Exchange entries
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
import { Crown } from 'lucide-react';

interface TpeFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function TpeForm({ data, onChange }: TpeFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            TPE Eintrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">TPE Ereignis *</Label>
            <Input
              id="title"
              placeholder="Beschreibung des TPE Ereignisses..."
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
                <SelectItem value="command">Befehl</SelectItem>
                <SelectItem value="protocol">Protokoll</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="ceremony">Zeremonie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaillierte Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Genaue Beschreibung des TPE Ereignisses..."
              rows={4}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer</Label>
              <Input
                id="duration"
                placeholder="z.B. 2 Stunden, ganzer Tag..."
                value={data.duration || ''}
                onChange={(e) => updateField('duration', e.target.value)}
              />
            </div>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Kontext/Situation</Label>
            <Textarea
              id="context"
              placeholder="In welcher Situation fand dies statt?"
              rows={2}
              value={data.context || ''}
              onChange={(e) => updateField('context', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="compliance">Gehorsam (1-10)</Label>
              <Input
                id="compliance"
                type="number"
                min="1"
                max="10"
                placeholder="Wie gut wurde gehorcht?"
                value={data.compliance || ''}
                onChange={(e) => updateField('compliance', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="satisfaction">Zufriedenheit (1-10)</Label>
              <Input
                id="satisfaction"
                type="number"
                min="1"
                max="10"
                placeholder="Zufriedenheit mit dem Ergebnis"
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
                  id="wasInitiated"
                  checked={data.wasInitiated || false}
                  onCheckedChange={(checked) => updateField('wasInitiated', checked)}
                />
                <Label htmlFor="wasInitiated" className="text-sm">Von DOM initiiert</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasSuccessful"
                  checked={data.wasSuccessful !== false}
                  onCheckedChange={(checked) => updateField('wasSuccessful', checked)}
                />
                <Label htmlFor="wasSuccessful" className="text-sm">Erfolgreich</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hadResistance"
                  checked={data.hadResistance || false}
                  onCheckedChange={(checked) => updateField('hadResistance', checked)}
                />
                <Label htmlFor="hadResistance" className="text-sm">Widerstand geleistet</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresFollowup"
                  checked={data.requiresFollowup || false}
                  onCheckedChange={(checked) => updateField('requiresFollowup', checked)}
                />
                <Label htmlFor="requiresFollowup" className="text-sm">Nachbesprechung nötig</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotions">Emotionen/Gefühle</Label>
            <Input
              id="emotions"
              placeholder="Welche Gefühle waren beteiligt?"
              value={data.emotions || ''}
              onChange={(e) => updateField('emotions', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lessons">Erkenntnisse</Label>
            <Textarea
              id="lessons"
              placeholder="Was wurde gelernt oder erkannt?"
              rows={2}
              value={data.lessons || ''}
              onChange={(e) => updateField('lessons', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvements">Verbesserungsmöglichkeiten</Label>
            <Textarea
              id="improvements"
              placeholder="Was könnte beim nächsten Mal besser gemacht werden?"
              rows={2}
              value={data.improvements || ''}
              onChange={(e) => updateField('improvements', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}