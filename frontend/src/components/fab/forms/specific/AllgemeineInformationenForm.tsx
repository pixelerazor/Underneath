/**
 * Allgemeine Informationen Form Component
 * 
 * Form for general information entries
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
import { Info } from 'lucide-react';

interface AllgemeineInformationenFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function AllgemeineInformationenForm({ data, onChange }: AllgemeineInformationenFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Allgemeine Informationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              placeholder="Titel der Information..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wichtig">Wichtige Information</SelectItem>
                <SelectItem value="regel">Regel/Vereinbarung</SelectItem>
                <SelectItem value="erinnerung">Erinnerung</SelectItem>
                <SelectItem value="notiz">Persönliche Notiz</SelectItem>
                <SelectItem value="sonstige">Sonstige</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Inhalt *</Label>
            <Textarea
              id="content"
              placeholder="Beschreibe die Information..."
              rows={4}
              value={data.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Sichtbarkeit</Label>
            <Select value={data.visibility || 'both'} onValueChange={(value) => updateField('visibility', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sichtbarkeit auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Für beide sichtbar</SelectItem>
                <SelectItem value="dom_only">Nur für DOM</SelectItem>
                <SelectItem value="sub_only">Nur für SUB</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}