/**
 * Achievement Form Component
 * 
 * Specific form for documenting achievements
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AchievementFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function AchievementForm({ data, onChange }: AchievementFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="border-0 rounded-none shadow-none">
      <CardContent className="space-y-4 pt-4">
        <div>
          <Label htmlFor="title">Achievement *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Name des Achievements..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Kategorie</Label>
          <Select value={data.category || 'milestone'} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="milestone">Meilenstein</SelectItem>
              <SelectItem value="goal">Ziel</SelectItem>
              <SelectItem value="improvement">Verbesserung</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Beschreibung *</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Was wurde erreicht und warum ist es wichtig..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="points">Punkte</Label>
            <Input
              id="points"
              type="number"
              value={data.points || ''}
              onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
              placeholder="z.B. 100"
              min="0"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="badge">Badge</Label>
            <Input
              id="badge"
              value={data.badge || ''}
              onChange={(e) => handleChange('badge', e.target.value)}
              placeholder="z.B. Erste Woche"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="achievedAt">Erreicht am</Label>
          <Input
            id="achievedAt"
            type="datetime-local"
            value={data.achievedAt || new Date().toISOString().slice(0, 16)}
            onChange={(e) => handleChange('achievedAt', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}