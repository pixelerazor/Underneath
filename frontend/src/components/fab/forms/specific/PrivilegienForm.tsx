/**
 * Privilegien Form Component
 * 
 * Form for creating privileges and special rights
 * 
 * @author Underneath Team
 * @version 2.0.0
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

function PrivilegienForm({ data, onChange }: PrivilegienFormProps) {
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
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Was beinhaltet dieses Privileg?"
              rows={3}
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
                <SelectItem value="freedom">Freiheit</SelectItem>
                <SelectItem value="access">Zugang</SelectItem>
                <SelectItem value="permission">Erlaubnis</SelectItem>
                <SelectItem value="reward">Belohnung</SelectItem>
                <SelectItem value="comfort">Komfort</SelectItem>
                <SelectItem value="time">Zeitprivileg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Select value={data.type || ''} onValueChange={(value) => updateField('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Typ auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Dauerhaft</SelectItem>
                <SelectItem value="earned">Verdient</SelectItem>
                <SelectItem value="granted">Gewährt</SelectItem>
                <SelectItem value="conditional">Bedingt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activeFromStage">Ab Stufe</Label>
              <Input
                id="activeFromStage"
                type="number"
                min="1"
                max="10"
                placeholder="z.B. 2"
                value={data.activeFromStage || ''}
                onChange={(e) => updateField('activeFromStage', parseInt(e.target.value) || null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeToStage">Bis Stufe</Label>
              <Input
                id="activeToStage"
                type="number"
                min="1"
                max="10"
                placeholder="z.B. 5 (optional)"
                value={data.activeToStage || ''}
                onChange={(e) => updateField('activeToStage', parseInt(e.target.value) || null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pointsRequired">Benötigte Punkte</Label>
              <Input
                id="pointsRequired"
                type="number"
                min="0"
                placeholder="z.B. 50"
                value={data.pointsRequired || ''}
                onChange={(e) => updateField('pointsRequired', parseInt(e.target.value) || null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level (1-5)</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="5"
                placeholder="z.B. 3"
                value={data.level || ''}
                onChange={(e) => updateField('level', parseInt(e.target.value) || null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Gültigkeitsdauer</Label>
            <Select value={data.duration || ''} onValueChange={(value) => updateField('duration', value)}>
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

          <div className="space-y-2">
            <Label htmlFor="expiresAfter">Läuft ab nach</Label>
            <Input
              id="expiresAfter"
              placeholder="z.B. 30 Tage, 1 Monat"
              value={data.expiresAfter || ''}
              onChange={(e) => updateField('expiresAfter', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canRevoke"
                  checked={data.canRevoke !== false}
                  onCheckedChange={(checked) => updateField('canRevoke', checked)}
                />
                <Label htmlFor="canRevoke" className="text-sm">Entziehbar</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoExpires"
                  checked={data.autoExpires || false}
                  onCheckedChange={(checked) => updateField('autoExpires', checked)}
                />
                <Label htmlFor="autoExpires" className="text-sm">Läuft automatisch ab</Label>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default PrivilegienForm;