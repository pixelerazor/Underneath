/**
 * Appointment Form Component
 * 
 * Specific form for creating appointments
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AppointmentFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function AppointmentForm({ data, onChange }: AppointmentFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="border-0 rounded-none shadow-none">
      <CardContent className="space-y-4 pt-4">
        <div>
          <Label htmlFor="title">Termintitel *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Titel des Termins..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="type">Terminart</Label>
          <Select value={data.type || 'session'} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="session">Session</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Startzeit *</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={data.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="endDate">Endzeit</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={data.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Ort</Label>
          <Input
            id="location"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Wo findet der Termin statt..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="attendees">Teilnehmer</Label>
          <Input
            id="attendees"
            value={data.attendees || ''}
            onChange={(e) => handleChange('attendees', e.target.value)}
            placeholder="Kommagetrennte Liste der Teilnehmer..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Zusätzliche Informationen zum Termin..."
            rows={3}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}