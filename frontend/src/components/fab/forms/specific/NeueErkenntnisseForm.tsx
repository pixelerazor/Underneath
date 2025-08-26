/**
 * Neue Erkenntnisse Form Component
 * 
 * Form for documenting new insights and learnings
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
import { Lightbulb } from 'lucide-react';

interface NeueErkenntnisseFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function NeueErkenntnisseForm({ data, onChange }: NeueErkenntnisseFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Neue Erkenntnisse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Erkenntnis Titel *</Label>
            <Input
              id="title"
              placeholder="Kurze Zusammenfassung der Erkenntnis..."
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insight">Detaillierte Erkenntnis *</Label>
            <Textarea
              id="insight"
              placeholder="Was hast du gelernt oder erkannt?"
              rows={4}
              value={data.insight || ''}
              onChange={(e) => updateField('insight', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Kontext</Label>
            <Textarea
              id="context"
              placeholder="In welcher Situation ist dir das aufgefallen?"
              rows={2}
              value={data.context || ''}
              onChange={(e) => updateField('context', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Persönlich</SelectItem>
                <SelectItem value="relationship">Beziehung</SelectItem>
                <SelectItem value="behavior">Verhalten</SelectItem>
                <SelectItem value="emotional">Emotional</SelectItem>
                <SelectItem value="spiritual">Spirituell</SelectItem>
                <SelectItem value="practical">Praktisch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="importance">Wichtigkeit</Label>
              <Select value={data.importance || 'medium'} onValueChange={(value) => updateField('importance', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                  <SelectItem value="breakthrough">Durchbruch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clarity">Klarheit (1-10)</Label>
              <Input
                id="clarity"
                type="number"
                min="1"
                max="10"
                placeholder="Wie klar ist die Erkenntnis?"
                value={data.clarity || ''}
                onChange={(e) => updateField('clarity', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application">Anwendung</Label>
            <Textarea
              id="application"
              placeholder="Wie wirst du diese Erkenntnis anwenden?"
              rows={2}
              value={data.application || ''}
              onChange={(e) => updateField('application', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatedTo">Bezug zu</Label>
            <Input
              id="relatedTo"
              placeholder="Bezieht sich auf welche Regeln/Ziele/Stufen?"
              value={data.relatedTo || ''}
              onChange={(e) => updateField('relatedTo', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}