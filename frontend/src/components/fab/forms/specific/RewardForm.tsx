/**
 * Reward Form Component
 * 
 * Specific form for giving rewards
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { StageSelector } from '../components/StageSelector';

interface RewardFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function RewardForm({ data, onChange }: RewardFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Stage Selection Header */}
      <StageSelector
        activeFromStage={data.activeFromStage}
        activeToStage={data.activeToStage}
        onActiveFromStageChange={(stage) => handleChange('activeFromStage', stage)}
        onActiveToStageChange={(stage) => handleChange('activeToStage', stage)}
      />
      
      <Card className="border-0 rounded-none shadow-none">
        <CardContent className="space-y-4 pt-4">
        <div>
          <Label htmlFor="title">Belohnung *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Name der Belohnung..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="earnedFor">Verdient für *</Label>
          <Textarea
            id="earnedFor"
            value={data.earnedFor || ''}
            onChange={(e) => handleChange('earnedFor', e.target.value)}
            placeholder="Wofür wurde diese Belohnung verdient..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Kategorie</Label>
          <Select value={data.category || 'privilege'} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="privilege">Privileg</SelectItem>
              <SelectItem value="gift">Geschenk</SelectItem>
              <SelectItem value="experience">Erlebnis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detaillierte Beschreibung der Belohnung..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="givenAt">Gegeben am</Label>
          <Input
            id="givenAt"
            type="datetime-local"
            value={data.givenAt || new Date().toISOString().slice(0, 16)}
            onChange={(e) => handleChange('givenAt', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
      </Card>
    </div>
  );
}