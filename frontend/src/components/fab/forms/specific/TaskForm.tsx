/**
 * Task Form Component
 * 
 * Specific form for creating tasks
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { StageSelector } from '../components/StageSelector';

interface TaskFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function TaskForm({ data, onChange }: TaskFormProps) {
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
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Aufgabentitel eingeben..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detaillierte Beschreibung der Aufgabe..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">Priorität</Label>
            <Select value={data.priority || 'medium'} onValueChange={(value) => handleChange('priority', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Niedrig</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Select value={data.category || ''} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Kategorie wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="maintenance">Wartung</SelectItem>
                <SelectItem value="special">Besonders</SelectItem>
                <SelectItem value="punishment">Strafe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={data.dueDate || ''}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="assignedTo">Zugewiesen an</Label>
          <Input
            id="assignedTo"
            value={data.assignedTo || ''}
            onChange={(e) => handleChange('assignedTo', e.target.value)}
            placeholder="Person oder Rolle..."
            className="mt-1"
          />
        </div>
        </CardContent>
      </Card>
    </div>
  );
}