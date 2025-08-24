/**
 * Punishment Form Component
 * 
 * Specific form for documenting punishments
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PunishmentFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function PunishmentForm({ data, onChange }: PunishmentFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="border-0 rounded-none shadow-none">
      <CardContent className="space-y-4 pt-4">
        <div>
          <Label htmlFor="title">Strafe *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Art der Strafe..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="reason">Grund *</Label>
          <Textarea
            id="reason"
            value={data.reason || ''}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="Warum wird diese Strafe verhängt..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="severity">Schweregrad</Label>
            <Select value={data.severity || 'medium'} onValueChange={(value) => handleChange('severity', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Leicht</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="severe">Schwer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Dauer</Label>
            <Input
              id="duration"
              value={data.duration || ''}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="z.B. 1 Woche, 3 Tage..."
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Zusätzliche Details</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Weitere Informationen zur Durchführung..."
            rows={2}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}