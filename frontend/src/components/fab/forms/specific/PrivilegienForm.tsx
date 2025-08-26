/**
 * Privilegien Form Component
 * 
 * Form for creating privileges
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
import { Gift } from 'lucide-react';

interface PrivilegienFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function PrivilegienForm({ data, onChange }: PrivilegienFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Privilegien
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Privileg Name *</Label>
            <Input
              id="title"
              placeholder="Name des Privilegs..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung *</Label>
            <Textarea
              id="description"
              placeholder="Was beinhaltet dieses Privileg?"
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie *</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freedom">Freiheit</SelectItem>
                <SelectItem value="access">Zugang</SelectItem>
                <SelectItem value="permission">Erlaubnis</SelectItem>
                <SelectItem value="reward">Belohnung</SelectItem>
                <SelectItem value="comfort">Komfort</SelectItem>
                <SelectItem value="time">Zeitprivileg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromStage">Ab Stufe *</Label>
              <Input
                id="fromStage"
                type="number"
                min="1"
                max="10"
                placeholder="z.B. 2"
                value={data.fromStage || ''}
                onChange={(e) => updateField('fromStage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsCost">Kosten (Punkte)</Label>
              <Input
                id="pointsCost"
                type="number"
                min="0"
                placeholder="z.B. 50"
                value={data.pointsCost || ''}
                onChange={(e) => updateField('pointsCost', e.target.value)}
              />
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

          <div className="space-y-3">
            <Label>Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isEarned"
                  checked={data.isEarned || false}
                  onCheckedChange={(checked) => updateField('isEarned', checked)}
                />
                <Label htmlFor="isEarned" className="text-sm">Muss verdient werden</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRevocable"
                  checked={data.isRevocable || false}
                  onCheckedChange={(checked) => updateField('isRevocable', checked)}
                />
                <Label htmlFor="isRevocable" className="text-sm">Entziehbar</Label>
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
                  id="isConditional"
                  checked={data.isConditional || false}
                  onCheckedChange={(checked) => updateField('isConditional', checked)}
                />
                <Label htmlFor="isConditional" className="text-sm">Bedingungen</Label>
              </div>
            </div>
          </div>

          {data.isConditional && (
            <div className="space-y-2">
              <Label htmlFor="conditions">Bedingungen</Label>
              <Textarea
                id="conditions"
                placeholder="Unter welchen Bedingungen gilt dieses Privileg?"
                rows={2}
                value={data.conditions || ''}
                onChange={(e) => updateField('conditions', e.target.value)}
              />
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}