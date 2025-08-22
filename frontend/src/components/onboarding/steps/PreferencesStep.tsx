/**
 * Preferences Step Component
 * 
 * Second step of profile completion - collects general preferences
 * like availability and timezone.
 * 
 * @component PreferencesStep  
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PreferencesStepProps {
  data: {
    availability?: {
      days?: string[];
      timeSlots?: string[];
      timezone?: string;
    };
  };
  onChange: (data: any) => void;
  userRole: string;
}

export function PreferencesStep({ data, onChange, userRole }: PreferencesStepProps) {
  const [localData, setLocalData] = useState({
    availability: {
      days: data.availability?.days || [],
      timeSlots: data.availability?.timeSlots || [],
      timezone: data.availability?.timezone || '',
    },
  });

  useEffect(() => {
    onChange({ availability: localData.availability });
  }, [localData, onChange]);

  const handleDayChange = (day: string, checked: boolean) => {
    setLocalData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: checked 
          ? [...prev.availability.days, day]
          : prev.availability.days.filter(d => d !== day),
      },
    }));
  };

  const handleTimeSlotChange = (timeSlot: string, checked: boolean) => {
    setLocalData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: checked 
          ? [...prev.availability.timeSlots, timeSlot]
          : prev.availability.timeSlots.filter(ts => ts !== timeSlot),
      },
    }));
  };

  const handleTimezoneChange = (timezone: string) => {
    setLocalData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timezone,
      },
    }));
  };

  const days = [
    { value: 'monday', label: 'Montag' },
    { value: 'tuesday', label: 'Dienstag' },
    { value: 'wednesday', label: 'Mittwoch' },
    { value: 'thursday', label: 'Donnerstag' },
    { value: 'friday', label: 'Freitag' },
    { value: 'saturday', label: 'Samstag' },
    { value: 'sunday', label: 'Sonntag' },
  ];

  const timeSlots = [
    { value: 'early_morning', label: 'Früh morgens (6:00 - 9:00)' },
    { value: 'morning', label: 'Morgens (9:00 - 12:00)' },
    { value: 'afternoon', label: 'Nachmittags (12:00 - 17:00)' },
    { value: 'evening', label: 'Abends (17:00 - 21:00)' },
    { value: 'night', label: 'Nachts (21:00 - 24:00)' },
    { value: 'late_night', label: 'Spät nachts (0:00 - 6:00)' },
  ];

  const timezones = [
    { value: 'Europe/Berlin', label: 'Deutschland (CET/CEST)' },
    { value: 'Europe/Vienna', label: 'Österreich (CET/CEST)' },
    { value: 'Europe/Zurich', label: 'Schweiz (CET/CEST)' },
    { value: 'Europe/London', label: 'Großbritannien (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Frankreich (CET/CEST)' },
    { value: 'America/New_York', label: 'US East Coast (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'US West Coast (PST/PDT)' },
    { value: 'UTC', label: 'UTC (Koordinierte Weltzeit)' },
  ];

  const getRoleSpecificDescription = (role: string) => {
    switch (role) {
      case 'DOM':
        return 'Wann sind Sie verfügbar, um mit Ihrem SUB zu interagieren, Aufgaben zu überprüfen oder zu kommunizieren?';
      case 'SUB':
        return 'Wann sind Sie verfügbar für Aufgaben, Kommunikation mit Ihrem DOM oder andere Aktivitäten?';
      case 'OBSERVER':
        return 'Wann sind Sie für Beratungen, Gespräche oder die Beobachtung verfügbar?';
      default:
        return 'Ihre Verfügbarkeitszeiten helfen bei der besseren Koordination.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Verfügbarkeit & Präferenzen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {getRoleSpecificDescription(userRole)}
          </p>
        </CardContent>
      </Card>

      {/* Timezone */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Zeitzone
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={localData.availability.timezone}
          onValueChange={handleTimezoneChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wählen Sie Ihre Zeitzone..." />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Dies hilft bei der korrekten Anzeige von Zeiten und Terminen.
        </p>
      </div>

      {/* Available Days */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Verfügbare Tage
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          An welchen Wochentagen sind Sie normalerweise aktiv?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {days.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={localData.availability.days.includes(day.value)}
                onCheckedChange={(checked) => handleDayChange(day.value, checked as boolean)}
              />
              <Label 
                htmlFor={`day-${day.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {day.label}
              </Label>
            </div>
          ))}
        </div>
        {localData.availability.days.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {localData.availability.days.map(day => {
              const dayLabel = days.find(d => d.value === day)?.label;
              return (
                <Badge key={day} variant="secondary" className="text-xs">
                  {dayLabel}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Bevorzugte Tageszeiten
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Zu welchen Tageszeiten sind Sie am aktivsten?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <div key={slot.value} className="flex items-center space-x-2">
              <Checkbox
                id={`slot-${slot.value}`}
                checked={localData.availability.timeSlots.includes(slot.value)}
                onCheckedChange={(checked) => handleTimeSlotChange(slot.value, checked as boolean)}
              />
              <Label 
                htmlFor={`slot-${slot.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {slot.label}
              </Label>
            </div>
          ))}
        </div>
        {localData.availability.timeSlots.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {localData.availability.timeSlots.map(slot => {
              const slotLabel = timeSlots.find(s => s.value === slot)?.label;
              return (
                <Badge key={slot} variant="secondary" className="text-xs">
                  {slotLabel}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {(localData.availability.timezone || localData.availability.days.length > 0 || localData.availability.timeSlots.length > 0) && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Ihre Verfügbarkeitseinstellungen helfen dabei, die optimale Zeit für Interaktionen zu finden.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Validation Hints */}
      {!localData.availability.timezone && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ Bitte wählen Sie mindestens Ihre Zeitzone aus.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}