/**
 * Strafen Form Component
 * 
 * Form for documenting punishments
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
import { AlertCircle } from 'lucide-react';
import { StageSelector } from '../components/StageSelector';

interface StrafenFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StrafenForm({ data, onChange }: StrafenFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Stage Selection Header */}
      <StageSelector
        activeFromStage={data.activeFromStage}
        activeToStage={data.activeToStage}
        onActiveFromStageChange={(stage) => updateField('activeFromStage', stage)}
        onActiveToStageChange={(stage) => updateField('activeToStage', stage)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Strafe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Strafe Titel *</Label>
            <Input
              id="title"
              placeholder="Art der Strafe..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Grund für die Strafe *</Label>
            <Textarea
              id="reason"
              placeholder="Was hat zur Strafe geführt?"
              rows={2}
              value={data.reason || ''}
              onChange={(e) => updateField('reason', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaillierte Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Genaue Beschreibung der Strafe..."
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Schweregrad *</Label>
              <Select value={data.severity || ''} onValueChange={(value) => updateField('severity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Schwere auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Leicht</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="severe">Schwer</SelectItem>
                  <SelectItem value="extreme">Extrem</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Körperlich</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="restriction">Einschränkung</SelectItem>
                  <SelectItem value="task">Aufgabe</SelectItem>
                  <SelectItem value="deprivation">Entzug</SelectItem>
                  <SelectItem value="humiliation">Demütigung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer</Label>
              <Input
                id="duration"
                placeholder="z.B. 30 Minuten, 1 Tag..."
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
                placeholder="z.B. 6"
                value={data.intensity || ''}
                onChange={(e) => updateField('intensity', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tools">Verwendete Hilfsmittel</Label>
            <Input
              id="tools"
              placeholder="Welche Gegenstände wurden verwendet?"
              value={data.tools || ''}
              onChange={(e) => updateField('tools', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Status und Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCompleted"
                  checked={data.isCompleted || false}
                  onCheckedChange={(checked) => updateField('isCompleted', checked)}
                />
                <Label htmlFor="isCompleted" className="text-sm">Vollzogen</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasEffective"
                  checked={data.wasEffective || false}
                  onCheckedChange={(checked) => updateField('wasEffective', checked)}
                />
                <Label htmlFor="wasEffective" className="text-sm">War effektiv</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wasConsensual"
                  checked={data.wasConsensual !== false}
                  onCheckedChange={(checked) => updateField('wasConsensual', checked)}
                />
                <Label htmlFor="wasConsensual" className="text-sm">Einvernehmlich</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresFollowup"
                  checked={data.requiresFollowup || false}
                  onCheckedChange={(checked) => updateField('requiresFollowup', checked)}
                />
                <Label htmlFor="requiresFollowup" className="text-sm">Nachbehandlung nötig</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reaction">Reaktion/Verhalten während der Strafe</Label>
            <Textarea
              id="reaction"
              placeholder="Wie wurde auf die Strafe reagiert?"
              rows={2}
              value={data.reaction || ''}
              onChange={(e) => updateField('reaction', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveness">Wirksamkeit und Erkenntnisse</Label>
            <Textarea
              id="effectiveness"
              placeholder="War die Strafe angemessen? Was wurde gelernt?"
              rows={2}
              value={data.effectiveness || ''}
              onChange={(e) => updateField('effectiveness', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}