/**
 * Aufgaben Form Component
 * 
 * Structured task creation form based on W-questions methodology
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
import { CheckSquare, Info, Users, Calendar, MapPin, Settings, CheckCircle2 } from 'lucide-react';

interface AufgabenFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function AufgabenForm({ data, onChange }: AufgabenFormProps) {
  const [showInfo, setShowInfo] = useState(false);

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const WQuestionsInfoContent = () => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Anleitung zur strukturierten Aufgabenerstellung
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <p>
          Dieses Formular hilft dabei, Aufgaben für den Sub strukturiert und vollständig zu definieren. 
          Durch die W-Fragen wird sichergestellt, dass alle wichtigen Aspekte einer Aufgabe klar kommuniziert werden.
        </p>

        <div>
          <h3 className="font-semibold mb-2">Die W-Fragen für Aufgaben</h3>
          <p className="mb-3">
            Eine gut definierte Aufgabe beantwortet alle wichtigen W-Fragen und lässt dem Sub keinen Raum für Missverständnisse:
          </p>

          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                Was - Was muss getan werden?
              </h4>
              <p className="text-muted-foreground">
                Definieren Sie konkret und eindeutig, was der Sub erledigen soll. Vermeiden Sie vage Formulierungen.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-green-500" />
                Warum - Warum ist es notwendig?
              </h4>
              <p className="text-muted-foreground">
                Erklären Sie den Zweck und die Bedeutung der Aufgabe. Dies erhöht Motivation und Verständnis.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-yellow-500" />
                Wer - Wer ist beteiligt?
              </h4>
              <p className="text-muted-foreground">
                Klären Sie, wer außer dem Sub noch beteiligt ist oder involviert werden könnte.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Wann - Wann soll es erledigt werden?
              </h4>
              <p className="text-muted-foreground">
                Setzen Sie klare zeitliche Rahmen und Deadlines für die Aufgabenerledigung.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Wo - Wo findet es statt?
              </h4>
              <p className="text-muted-foreground">
                Spezifizieren Sie den Ort oder die Umgebung, in der die Aufgabe ausgeführt werden soll.
              </p>
            </div>

            <div className="border-l-4 border-indigo-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-500" />
                Wie - Wie soll es umgesetzt werden?
              </h4>
              <p className="text-muted-foreground">
                Beschreiben Sie die gewünschte Vorgehensweise, Methodik oder besondere Anforderungen.
              </p>
            </div>

            <div className="border-l-4 border-pink-500 pl-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-pink-500" />
                Welche Bedingungen - Was sind die Qualitätskriterien?
              </h4>
              <p className="text-muted-foreground">
                Definieren Sie, wann die Aufgabe als erfolgreich erledigt gilt und welche Standards erfüllt werden müssen.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Hinweise zur Aufgabenerstellung</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Je klarer Sie die Aufgabe definieren, desto besser kann der Sub sie erfüllen</li>
            <li>• Überlegen Sie sich vorher, was das gewünschte Ergebnis ist</li>
            <li>• Berücksichtigen Sie die aktuellen Fähigkeiten und Grenzen des Subs</li>
            <li>• Setzen Sie realistische aber herausfordernde Zeitrahmen</li>
          </ul>
        </div>

        <p className="text-center text-muted-foreground italic">
          Nutzen Sie die folgenden Felder, um die Aufgabe systematisch anhand der W-Fragen zu strukturieren.
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
              <CheckSquare className="h-5 w-5" />
              Aufgabe für Sub definieren
            </CardTitle>
            <Dialog open={showInfo} onOpenChange={setShowInfo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-1" />
                  Info
                </Button>
              </DialogTrigger>
              <WQuestionsInfoContent />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Was - Was muss getan werden? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-semibold text-blue-700">Was: Was muss der Sub tun?</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Aufgaben-Titel *</Label>
              <Input
                id="title"
                placeholder="z.B. 'Wohnzimmer staubsaugen und wischen'"
                value={data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detaillierte Beschreibung</Label>
              <Textarea
                id="description"
                placeholder="Beschreiben Sie genau, was der Sub tun soll, welche Schritte nötig sind..."
                rows={3}
                value={data.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>

          {/* Warum - Warum ist es notwendig? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-green-500" />
              <Label className="text-sm font-semibold text-green-700">Warum: Grund und Zweck der Aufgabe</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine/Haushaltsführung</SelectItem>
                    <SelectItem value="training">Training/Entwicklung</SelectItem>
                    <SelectItem value="service">Service/Dienst</SelectItem>
                    <SelectItem value="maintenance">Wartung/Pflege</SelectItem>
                    <SelectItem value="special">Besondere Aufgabe</SelectItem>
                    <SelectItem value="punishment">Straf-Aufgabe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Wichtigkeit</Label>
                <Select value={data.priority || 'medium'} onValueChange={(value) => updateField('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig - Kann warten</SelectItem>
                    <SelectItem value="medium">Mittel - Normal wichtig</SelectItem>
                    <SelectItem value="high">Hoch - Sehr wichtig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Zweck und Bedeutung</Label>
              <Textarea
                id="purpose"
                placeholder="Warum ist diese Aufgabe für den Sub oder die Beziehung wichtig?"
                rows={2}
                value={data.purpose || ''}
                onChange={(e) => updateField('purpose', e.target.value)}
              />
            </div>
          </div>

          {/* Wer - Wer ist beteiligt? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-500" />
              <Label className="text-sm font-semibold text-yellow-700">Wer: Beteiligte Personen</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="involvedPersons">Weitere Beteiligte (optional)</Label>
              <Input
                id="involvedPersons"
                placeholder="z.B. 'Gemeinsam mit Dom' oder 'Koordination mit...'"
                value={data.involvedPersons || ''}
                onChange={(e) => updateField('involvedPersons', e.target.value)}
              />
            </div>
          </div>

          {/* Wann - Wann soll es erledigt werden? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-semibold text-purple-700">Wann: Zeitlicher Rahmen</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={data.dueDate || ''}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeFrame">Zeitaufwand (geschätzt)</Label>
                <Select value={data.timeFrame || ''} onValueChange={(value) => updateField('timeFrame', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dauer wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Schnell (unter 15 Min)</SelectItem>
                    <SelectItem value="short">Kurz (15-30 Min)</SelectItem>
                    <SelectItem value="medium">Mittel (30-60 Min)</SelectItem>
                    <SelectItem value="long">Lang (1-2 Std)</SelectItem>
                    <SelectItem value="extended">Ausgedehnt (über 2 Std)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Wo - Wo findet es statt? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <Label className="text-sm font-semibold text-red-700">Wo: Ort und Umgebung</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ort der Durchführung</Label>
              <Input
                id="location"
                placeholder="z.B. 'Wohnzimmer', 'Küche', 'draußen', 'online'..."
                value={data.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
              />
            </div>
          </div>

          {/* Wie - Wie soll es umgesetzt werden? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-indigo-500" />
              <Label className="text-sm font-semibold text-indigo-700">Wie: Methodik und Vorgehen</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="methodology">Vorgehensweise und Methodik</Label>
              <Textarea
                id="methodology"
                placeholder="Wie soll der Sub vorgehen? Welche Schritte, Reihenfolge oder Methoden sind zu beachten?"
                rows={2}
                value={data.methodology || ''}
                onChange={(e) => updateField('methodology', e.target.value)}
              />
            </div>
          </div>

          {/* Welche Bedingungen - Qualitätskriterien */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-pink-500" />
              <Label className="text-sm font-semibold text-pink-700">Welche Bedingungen: Erfolgskriterien</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualityCriteria">Qualitätskriterien und Erfolgsbedingungen</Label>
              <Textarea
                id="qualityCriteria"
                placeholder="Wann gilt die Aufgabe als erfolgreich erledigt? Welche Standards müssen erfüllt sein?"
                rows={2}
                value={data.qualityCriteria || ''}
                onChange={(e) => updateField('qualityCriteria', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsReward">Belohnung (Punkte)</Label>
              <Input
                id="pointsReward"
                type="number"
                min="1"
                placeholder="z.B. 10"
                value={data.pointsReward || ''}
                onChange={(e) => updateField('pointsReward', e.target.value)}
              />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}