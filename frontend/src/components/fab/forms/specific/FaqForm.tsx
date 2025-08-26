/**
 * FAQ Form Component
 * 
 * Form for creating FAQ entries
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
import { HelpCircle } from 'lucide-react';

interface FaqFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FaqForm({ data, onChange }: FaqFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            FAQ Eintrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="question">Frage *</Label>
            <Input
              id="question"
              placeholder="Was ist die häufig gestellte Frage?"
              value={data.question || ''}
              onChange={(e) => updateField('question', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Antwort *</Label>
            <Textarea
              id="answer"
              placeholder="Detaillierte Antwort auf die Frage..."
              rows={4}
              value={data.answer || ''}
              onChange={(e) => updateField('answer', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Allgemein</SelectItem>
                <SelectItem value="rules">Regeln</SelectItem>
                <SelectItem value="stages">Stufen</SelectItem>
                <SelectItem value="privileges">Privilegien</SelectItem>
                <SelectItem value="technical">Technisch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Wichtigkeit</Label>
              <Select value={data.priority || 'medium'} onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Komma getrennt)</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3"
                value={data.tags || ''}
                onChange={(e) => updateField('tags', e.target.value)}
              />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}