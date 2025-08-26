/**
 * Rule Form Component
 * 
 * Specific form for creating rules
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { StageSelector } from '../components/StageSelector';

interface RuleFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function RuleForm({ data, onChange }: RuleFormProps) {
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
          <Label htmlFor="title">Regel *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Kurze Beschreibung der Regel..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Detaillierte Beschreibung</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Ausführliche Erklärung der Regel, wann sie gilt und was zu beachten ist..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || 'behavior'} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavior">Verhalten</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="restriction">Einschränkung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Wichtigkeit</Label>
            <Select value={data.severity || 'warning'} onValueChange={(value) => handleChange('severity', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="warning">Warnung</SelectItem>
                <SelectItem value="strict">Strikt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="consequences">Konsequenzen bei Nichteinhaltung</Label>
          <Textarea
            id="consequences"
            value={data.consequences || ''}
            onChange={(e) => handleChange('consequences', e.target.value)}
            placeholder="Was passiert bei Regelverstoß..."
            rows={2}
            className="mt-1"
          />
        </div>
        </CardContent>
      </Card>
    </div>
  );
}