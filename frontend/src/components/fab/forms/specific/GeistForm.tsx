/**
 * Geist Form Component
 * 
 * Form for documenting mental/spiritual wellbeing
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
import { Slider } from '@/components/ui/slider';
import { Brain } from 'lucide-react';

interface GeistFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function GeistForm({ data, onChange }: GeistFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Geistiges Wohlbefinden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Überschrift *</Label>
            <Input
              id="title"
              placeholder="Kurze Beschreibung des mentalen Zustands..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaillierte Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="Beschreibung der aktuellen mentalen Verfassung..."
              rows={3}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Stimmung (1-10): {data.mood || 5}</Label>
            <Slider
              value={[data.mood || 5]}
              onValueChange={([value]) => updateField('mood', value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sehr schlecht</span>
              <span>Neutral</span>
              <span>Sehr gut</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="energy">Energie (1-10): {data.energy || 5}</Label>
            <Slider
              value={[data.energy || 5]}
              onValueChange={([value]) => updateField('energy', value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="reflection">Reflektion</SelectItem>
                <SelectItem value="gratitude">Dankbarkeit</SelectItem>
                <SelectItem value="goals">Ziele</SelectItem>
                <SelectItem value="challenges">Herausforderungen</SelectItem>
                <SelectItem value="insights">Erkenntnisse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="triggers">Auslöser</Label>
              <Input
                id="triggers"
                placeholder="Was hat den Zustand ausgelöst?"
                value={data.triggers || ''}
                onChange={(e) => updateField('triggers', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer</Label>
              <Select value={data.duration || ''} onValueChange={(value) => updateField('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wie lange?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minuten</SelectItem>
                  <SelectItem value="hours">Stunden</SelectItem>
                  <SelectItem value="days">Tage</SelectItem>
                  <SelectItem value="ongoing">Andauernd</SelectItem>
                </SelectContent>
              </Select>
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