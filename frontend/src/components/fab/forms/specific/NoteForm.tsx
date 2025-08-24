/**
 * Note Form Component
 * 
 * Specific form for creating notes and journal entries
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface NoteFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function NoteForm({ data, onChange }: NoteFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="border-0 rounded-none shadow-none">
      <CardContent className="space-y-4 pt-4">
        <div>
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Titel der Notiz..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Kategorie</Label>
          <Select value={data.category || 'general'} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Allgemein</SelectItem>
              <SelectItem value="insight">Erkenntnis</SelectItem>
              <SelectItem value="trigger">Trigger</SelectItem>
              <SelectItem value="relapse">Rückfall</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Inhalt *</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Schreibe deine Gedanken und Erfahrungen..."
            rows={5}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Stimmung: {data.mood || 5}/10</Label>
          <Slider
            value={[data.mood || 5]}
            onValueChange={(value) => handleChange('mood', value[0])}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Sehr schlecht</span>
            <span>Sehr gut</span>
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags (kommagetrennt)</Label>
          <Input
            id="tags"
            value={data.tags || ''}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="z.B. training, erfolg, schwierigkeit"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}