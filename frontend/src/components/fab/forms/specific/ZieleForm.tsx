/**
 * Ziel Form Component
 * 
 * SMART goal creation form with simplified stage assignment
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Info, Calendar, TrendingUp, CheckCircle2, Gauge, Users } from 'lucide-react';

interface ZieleFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function ZieleForm({ data, onChange }: ZieleFormProps) {
  const [showInfo, setShowInfo] = useState(false);

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const SMARTInfoContent = () => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Anleitung zum Ausfüllen des SMART-Ziele Formulars
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <p>
          Dieses Formular unterstützt dabei, Ziele für den Sub nach der bewährten SMART-Methode zu formulieren. 
          Ein SMART-Ziel ist klar definiert und erhöht die Wahrscheinlichkeit der erfolgreichen Umsetzung erheblich.
        </p>

        <div>
          <h3 className="font-semibold mb-2">Was sind SMART-Ziele?</h3>
          <p className="mb-3">
            SMART ist ein Akronym, das dabei hilft, Ziele strukturiert und erfolgversprechend zu formulieren. 
            Jeder Buchstabe steht für ein wichtiges Kriterium, das das Ziel erfüllen sollte:
          </p>

          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                S - Spezifisch
              </h4>
              <p className="text-gray-600">
                Formulieren Sie das Ziel so konkret und präzise wie möglich. Vermeiden Sie vage Aussagen und 
                beantworten Sie die W-Fragen: Was genau soll der Sub erreichen? Wer ist beteiligt? Wo findet es statt?
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Gauge className="h-4 w-4 text-green-500" />
                M - Messbar
              </h4>
              <p className="text-gray-600">
                Definieren Sie klare Kriterien, anhand derer der Fortschritt und die Zielerreichung 
                überprüft werden können. Legen Sie konkrete Zahlen, Mengen oder andere messbare Indikatoren fest.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
                A - Attraktiv/Erreichbar
              </h4>
              <p className="text-gray-600">
                Das Ziel sollte den Sub motivieren und gleichzeitig realistisch erreichbar sein. Es sollte eine 
                Herausforderung darstellen, aber nicht unmöglich erscheinen. Prüfen Sie, ob der Sub die notwendigen 
                Ressourcen und Fähigkeiten hat oder erlangen kann.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                R - Relevant/Realistisch
              </h4>
              <p className="text-gray-600">
                Stellen Sie sicher, dass das Ziel für die Entwicklung des Subs wichtig ist und mit 
                übergeordneten Zielen der Beziehung übereinstimmt. Es sollte zum richtigen Zeitpunkt das Richtige sein.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                T - Terminiert
              </h4>
              <p className="text-gray-600">
                Setzen Sie einen klaren Zeitrahmen mit einem konkreten Enddatum oder Meilenstein-Terminen. 
                Dies schafft Verbindlichkeit für den Sub und hilft bei der Planung.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Hinweise zum Ausfüllen</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Nehmen Sie sich Zeit für die Formulierung - je präziser Sie das Ziel definieren, desto leichter wird die Umsetzung für den Sub</li>
            <li>• Überprüfen Sie jedes Kriterium einzeln und passen Sie die Formulierung bei Bedarf an</li>
            <li>• Ein gut formuliertes SMART-Ziel beantwortet alle fünf Kriterien vollständig</li>
            <li>• Scheuen Sie sich nicht, das Ziel mehrmals zu überarbeiten, bis es wirklich SMART ist</li>
          </ul>
        </div>

        <p className="text-center text-muted-foreground italic">
          Nutzen Sie die folgenden Felder, um das Ziel für den Sub Schritt für Schritt nach der SMART-Methode zu entwickeln und zu verfeinern.
        </p>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SMART-Ziel definieren
            </CardTitle>
            <Dialog open={showInfo} onOpenChange={setShowInfo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-1" />
                  Info
                </Button>
              </DialogTrigger>
              <SMARTInfoContent />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* S - Spezifisch */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-semibold text-blue-700">S - Spezifisch: Was genau soll der Sub erreichen?</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Ziel-Titel *</Label>
              <Input
                id="title"
                placeholder="z.B. 'Täglich 30 Minuten Meditation praktizieren'"
                value={data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detaillierte Beschreibung</Label>
              <Textarea
                id="description"
                placeholder="Beschreiben Sie konkret, was der Sub tun wird, wer beteiligt ist und wo es stattfindet..."
                rows={3}
                value={data.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>

          {/* M - Messbar */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-green-500" />
              <Label className="text-sm font-semibold text-green-700">M - Messbar: Wie wird der Fortschritt gemessen?</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetValue">Messbarer Zielwert</Label>
                <Input
                  id="targetValue"
                  type="number"
                  min="1"
                  placeholder="z.B. 30 (Tage), 10 (Wiederholungen)"
                  value={data.targetValue || ''}
                  onChange={(e) => updateField('targetValue', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="measurementUnit">Maßeinheit</Label>
                <Select value={data.measurementUnit || ''} onValueChange={(value) => updateField('measurementUnit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Einheit wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Tage</SelectItem>
                    <SelectItem value="weeks">Wochen</SelectItem>
                    <SelectItem value="times">Mal</SelectItem>
                    <SelectItem value="minutes">Minuten</SelectItem>
                    <SelectItem value="hours">Stunden</SelectItem>
                    <SelectItem value="percentage">Prozent</SelectItem>
                    <SelectItem value="points">Punkte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* A - Attraktiv/Erreichbar */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              <Label className="text-sm font-semibold text-yellow-700">A - Attraktiv/Erreichbar: Ist es motivierend und realistisch?</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorität/Motivation</Label>
                <Select value={data.priority || 'medium'} onValueChange={(value) => updateField('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig - Nice to have</SelectItem>
                    <SelectItem value="medium">Mittel - Wichtig für Entwicklung</SelectItem>
                    <SelectItem value="high">Hoch - Absolut entscheidend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Schwierigkeitsgrad</Label>
                <Select value={data.difficultyLevel || ''} onValueChange={(value) => updateField('difficultyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Einschätzung wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Leicht erreichbar</SelectItem>
                    <SelectItem value="moderate">Herausfordernd aber machbar</SelectItem>
                    <SelectItem value="challenging">Sehr ambitioniert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* R - Relevant */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-semibold text-purple-700">R - Relevant: Warum ist dieses Ziel wichtig?</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Lebensbereich</Label>
              <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Bereich auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Persönliche Entwicklung</SelectItem>
                  <SelectItem value="relationship">Beziehung/Partnerschaft</SelectItem>
                  <SelectItem value="health">Gesundheit/Fitness</SelectItem>
                  <SelectItem value="skill">Fähigkeiten/Lernen</SelectItem>
                  <SelectItem value="career">Beruf/Karriere</SelectItem>
                  <SelectItem value="spiritual">Spiritualität/Achtsamkeit</SelectItem>
                  <SelectItem value="creative">Kreativität/Hobbys</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">Persönliche Motivation</Label>
              <Textarea
                id="motivation"
                placeholder="Warum ist dieses Ziel für den Sub wichtig? Wie passt es zu den übergeordneten Entwicklungszielen?"
                rows={2}
                value={data.motivation || ''}
                onChange={(e) => updateField('motivation', e.target.value)}
              />
            </div>
          </div>

          {/* T - Terminiert */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              <Label className="text-sm font-semibold text-red-700">T - Terminiert: Bis wann soll es erreicht sein?</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Ziel-Datum</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={data.deadline || ''}
                  onChange={(e) => updateField('deadline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointsReward">Belohnung (Punkte)</Label>
                <Input
                  id="pointsReward"
                  type="number"
                  min="1"
                  placeholder="z.B. 100"
                  value={data.pointsReward || ''}
                  onChange={(e) => updateField('pointsReward', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Zusätzliche Planung */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-semibold text-gray-700">Umsetzungsplanung (Optional)</Label>
            <div className="space-y-2">
              <Label htmlFor="actionSteps">Erste Schritte</Label>
              <Textarea
                id="actionSteps"
                placeholder="Welche konkreten ersten Schritte soll der Sub unternehmen?"
                rows={2}
                value={data.actionSteps || ''}
                onChange={(e) => updateField('actionSteps', e.target.value)}
              />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}