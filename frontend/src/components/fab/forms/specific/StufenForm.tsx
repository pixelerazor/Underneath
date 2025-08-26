/**
 * Stufen Form Component
 * 
 * Form for creating stage plan entries
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
import { TrendingUp } from 'lucide-react';

interface StufenFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StufenForm({ data, onChange }: StufenFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stufenplan Eintrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Eintrag Titel *</Label>
            <Input
              id="title"
              placeholder="Titel des Stufenplan-Eintrags..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Detaillierte Beschreibung des Eintrags..."
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stageNumber">Stufe *</Label>
              <Input
                id="stageNumber"
                type="number"
                min="1"
                max="10"
                placeholder="z.B. 3"
                value={data.stageNumber || ''}
                onChange={(e) => updateField('stageNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rule">Regel</SelectItem>
                  <SelectItem value="task">Aufgabe</SelectItem>
                  <SelectItem value="privilege">Privileg</SelectItem>
                  <SelectItem value="ritual">Ritual</SelectItem>
                  <SelectItem value="goal">Ziel</SelectItem>
                  <SelectItem value="restriction">Einschränkung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pointsRequired">Erforderliche Punkte</Label>
              <Input
                id="pointsRequired"
                type="number"
                min="0"
                placeholder="z.B. 100"
                value={data.pointsRequired || ''}
                onChange={(e) => updateField('pointsRequired', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsReward">Punkte Belohnung</Label>
              <Input
                id="pointsReward"
                type="number"
                min="0"
                placeholder="z.B. 50"
                value={data.pointsReward || ''}
                onChange={(e) => updateField('pointsReward', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Anforderungen</Label>
            <Textarea
              id="requirements"
              placeholder="Was muss erfüllt werden für diese Stufe?"
              rows={2}
              value={data.requirements || ''}
              onChange={(e) => updateField('requirements', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Vorteile/Belohnungen</Label>
            <Textarea
              id="benefits"
              placeholder="Was wird mit dieser Stufe erreicht/freigeschaltet?"
              rows={2}
              value={data.benefits || ''}
              onChange={(e) => updateField('benefits', e.target.value)}
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
                  id="isAutomatic"
                  checked={data.isAutomatic || false}
                  onCheckedChange={(checked) => updateField('isAutomatic', checked)}
                />
                <Label htmlFor="isAutomatic" className="text-sm">Automatisch</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  checked={data.requiresApproval || false}
                  onCheckedChange={(checked) => updateField('requiresApproval', checked)}
                />
                <Label htmlFor="requiresApproval" className="text-sm">Genehmigung erforderlich</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRepeatable"
                  checked={data.isRepeatable || false}
                  onCheckedChange={(checked) => updateField('isRepeatable', checked)}
                />
                <Label htmlFor="isRepeatable" className="text-sm">Wiederholbar</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Gültigkeitsdauer</Label>
            <Select value={data.duration || 'permanent'} onValueChange={(value) => updateField('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Dauer auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Dauerhaft</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="monthly">Monatlich</SelectItem>
                <SelectItem value="temporary">Temporär</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}