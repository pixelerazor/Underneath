/**
 * Initiationsriten Form Component
 * 
 * Comprehensive form for creating initiation rituals with safety considerations
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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Info, 
  AlertTriangle, 
  Heart, 
  Users, 
  Calendar, 
  Settings, 
  Shield,
  Camera,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface InitiationsritenFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function InitiationsritenForm({ data, onChange }: InitiationsritenFormProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const updateArrayField = (field: string, value: string, checked: boolean) => {
    const currentArray = data[field] || [];
    if (checked) {
      updateField(field, [...currentArray, value]);
    } else {
      updateField(field, currentArray.filter((item: string) => item !== value));
    }
  };

  // Show safety alert for physical markings
  React.useEffect(() => {
    if (data.ritualType === 'physical_marking') {
      setShowSafetyAlert(true);
    } else {
      setShowSafetyAlert(false);
    }
  }, [data.ritualType]);

  const InfoContent = () => (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Leitfaden für Initiationsriten
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <p>
          Initiationsriten sind bedeutungsvolle Zeremonien, die Übergänge, Zugehörigkeit oder 
          Entwicklungsstufen markieren. Dieser Leitfaden hilft dabei, solche Rituale verantwortungsvoll zu planen.
        </p>

        <div>
          <h3 className="font-semibold mb-2">Arten von Initiationsriten</h3>
          <div className="space-y-2">
            <div className="border-l-4 border-blue-500 pl-3">
              <h4 className="font-medium">Körperliche Markierungen</h4>
              <p className="text-muted-foreground text-xs">
                Temporäre oder permanente körperliche Zeichen (Tattoos, Piercings, temporäre Markierungen)
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <h4 className="font-medium">Symbolische Handlungen</h4>
              <p className="text-muted-foreground text-xs">
                Rituelle Handlungen mit symbolischer Bedeutung ohne physische Veränderung
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <h4 className="font-medium">Zeremonielle Akte</h4>
              <p className="text-muted-foreground text-xs">
                Formelle Zeremonien mit bestimmtem Ablauf, Setting und Beteiligten
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-3">
              <h4 className="font-medium">Verhaltensbasierte Rituale</h4>
              <p className="text-muted-foreground text-xs">
                Rituale, die bestimmte Verhaltensweisen oder Aufgaben beinhalten
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-red-600">Wichtige Sicherheitshinweise</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Alle Beteiligten müssen explizit und informiert zustimmen</li>
            <li>• Bei körperlichen Handlungen: Hygiene und professionelle Durchführung beachten</li>
            <li>• Grenzen und Ausstiegsklauseln klar definieren</li>
            <li>• Medizinische Aspekte bei physischen Ritualen berücksichtigen</li>
            <li>• Rechtliche Bestimmungen beachten</li>
            <li>• Psychologische Auswirkungen bedenken</li>
          </ul>
        </div>

        <p className="text-center text-muted-foreground italic">
          Nutzen Sie dieses Formular, um Ihr Ritual strukturiert und sicher zu planen.
        </p>
      </div>
    </DialogContent>
  );

  const renderRitualTypeDetails = () => {
    switch (data.ritualType) {
      case 'physical_marking':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="markingType">Art der Markierung</Label>
                <Select value={data.markingType || ''} onValueChange={(value) => updateField('markingType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Art auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temporary_paint">Temporäre Farbe/Henna</SelectItem>
                    <SelectItem value="temporary_jewelry">Temporärer Schmuck</SelectItem>
                    <SelectItem value="tattoo">Tattoo (permanent)</SelectItem>
                    <SelectItem value="piercing">Piercing</SelectItem>
                    <SelectItem value="other">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyLocation">Körperstelle</Label>
                <Input
                  id="bodyLocation"
                  placeholder="z.B. 'Handgelenk', 'Nacken'..."
                  value={data.bodyLocation || ''}
                  onChange={(e) => updateField('bodyLocation', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbolism">Symbolik und Bedeutung</Label>
              <Textarea
                id="symbolism"
                placeholder="Was symbolisiert diese Markierung? Welche Bedeutung hat sie?"
                rows={2}
                value={data.symbolism || ''}
                onChange={(e) => updateField('symbolism', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'symbolic_action':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actionSequence">Ablauf der symbolischen Handlung</Label>
              <Textarea
                id="actionSequence"
                placeholder="Beschreiben Sie Schritt für Schritt den Ablauf der symbolischen Handlung..."
                rows={3}
                value={data.actionSequence || ''}
                onChange={(e) => updateField('actionSequence', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbolMeaning">Symbolische Bedeutung</Label>
                <Textarea
                  id="symbolMeaning"
                  placeholder="Was bedeutet diese Handlung symbolisch?"
                  rows={2}
                  value={data.symbolMeaning || ''}
                  onChange={(e) => updateField('symbolMeaning', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repetitionSchedule">Wiederholungsrhythmus</Label>
                <Select value={data.repetitionSchedule || ''} onValueChange={(value) => updateField('repetitionSchedule', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Häufigkeit auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Einmalig</SelectItem>
                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                    <SelectItem value="monthly">Monatlich</SelectItem>
                    <SelectItem value="milestone">Bei Meilensteinen</SelectItem>
                    <SelectItem value="other">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 'ceremonial_act':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ceremonyLocation">Setting und Ort</Label>
              <Input
                id="ceremonyLocation"
                placeholder="Wo findet die Zeremonie statt?"
                value={data.ceremonyLocation || ''}
                onChange={(e) => updateField('ceremonyLocation', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants">Beteiligte Personen</Label>
                <Input
                  id="participants"
                  placeholder="Wer nimmt teil?"
                  value={data.participants || ''}
                  onChange={(e) => updateField('participants', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ceremonyDuration">Dauer der Zeremonie</Label>
                <Input
                  id="ceremonyDuration"
                  placeholder="z.B. '2 Stunden'"
                  value={data.ceremonyDuration || ''}
                  onChange={(e) => updateField('ceremonyDuration', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ceremonyElements">Zeremonielle Elemente</Label>
              <Textarea
                id="ceremonyElements"
                placeholder="Welche besonderen Elemente, Gegenstände oder Rituale gehören zur Zeremonie?"
                rows={3}
                value={data.ceremonyElements || ''}
                onChange={(e) => updateField('ceremonyElements', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'behavioral_ritual':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="behaviorDescription">Beschreibung des Verhaltensrituals</Label>
              <Textarea
                id="behaviorDescription"
                placeholder="Welche Verhaltensweisen oder Aufgaben sind Teil dieses Rituals?"
                rows={3}
                value={data.behaviorDescription || ''}
                onChange={(e) => updateField('behaviorDescription', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="behaviorDuration">Zeitrahmen</Label>
                <Input
                  id="behaviorDuration"
                  placeholder="z.B. '24 Stunden', '1 Woche'"
                  value={data.behaviorDuration || ''}
                  onChange={(e) => updateField('behaviorDuration', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="behaviorFrequency">Häufigkeit</Label>
                <Select value={data.behaviorFrequency || ''} onValueChange={(value) => updateField('behaviorFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Häufigkeit wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Einmalig</SelectItem>
                    <SelectItem value="daily">Täglich</SelectItem>
                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                    <SelectItem value="continuous">Kontinuierlich</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 'custom':
        return (
          <div className="space-y-2">
            <Label htmlFor="customDefinition">Eigene Definition</Label>
            <Textarea
              id="customDefinition"
              placeholder="Beschreiben Sie Ihr individuelles Ritual detailliert..."
              rows={4}
              value={data.customDefinition || ''}
              onChange={(e) => updateField('customDefinition', e.target.value)}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Initiationsritus für Sub definieren
            </CardTitle>
            <Dialog open={showInfo} onOpenChange={setShowInfo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-1" />
                  Leitfaden
                </Button>
              </DialogTrigger>
              <InfoContent />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Grundinformationen */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-semibold text-purple-700">Grundinformationen</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Name des Rituals *</Label>
              <Input
                id="title"
                placeholder="z.B. 'Aufnahmeritual Stufe 2', 'Vertiefungszeremonie'..."
                value={data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Kurze Beschreibung</Label>
              <Textarea
                id="description"
                placeholder="Überblick über das Ritual und seinen Zweck..."
                rows={2}
                value={data.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>

          {/* Art des Rituals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-semibold text-blue-700">Art des Rituals</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ritualType">Ritual-Typ *</Label>
              <Select value={data.ritualType || ''} onValueChange={(value) => updateField('ritualType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical_marking">Körperliche Markierungen</SelectItem>
                  <SelectItem value="symbolic_action">Symbolische Handlungen</SelectItem>
                  <SelectItem value="ceremonial_act">Zeremonielle Akte</SelectItem>
                  <SelectItem value="behavioral_ritual">Verhaltensbasierte Rituale</SelectItem>
                  <SelectItem value="custom">Eigene Definition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Kontextabhängige Detailfelder */}
            {data.ritualType && renderRitualTypeDetails()}
          </div>

          {/* Sicherheitswarnung für körperliche Markierungen */}
          {showSafetyAlert && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Wichtige Sicherheitshinweise:</strong> Bei körperlichen Markierungen sind 
                Hygiene, professionelle Durchführung und medizinische Überlegungen besonders wichtig. 
                Informieren Sie sich über Risiken und lassen Sie permanente Eingriffe nur von 
                qualifizierten Fachkräften durchführen.
              </AlertDescription>
            </Alert>
          )}

          {/* Bedeutungsebene */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <Label className="text-sm font-semibold text-pink-700">Bedeutungsebene</Label>
            </div>
            <div className="space-y-2">
              <Label>Was soll das Ritual bewirken? (Mehrfachauswahl möglich)</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'belonging', label: 'Zugehörigkeit markieren' },
                  { value: 'development', label: 'Entwicklungsstufe kennzeichnen' },
                  { value: 'connection', label: 'Verbindung vertiefen' },
                  { value: 'role_definition', label: 'Rolle definieren/verändern' },
                  { value: 'transformation', label: 'Persönliche Transformation' }
                ].map((meaning) => (
                  <div key={meaning.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={meaning.value}
                      checked={(data.meanings || []).includes(meaning.value)}
                      onCheckedChange={(checked) => updateArrayField('meanings', meaning.value, !!checked)}
                    />
                    <Label htmlFor={meaning.value} className="text-sm">{meaning.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rahmenbedingungen */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <Label className="text-sm font-semibold text-orange-700">Rahmenbedingungen</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timing">Zeitpunkt/Timing</Label>
                <Select value={data.timing || ''} onValueChange={(value) => updateField('timing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zeitpunkt wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Sofort</SelectItem>
                    <SelectItem value="scheduled">Nach bestimmter Zeit</SelectItem>
                    <SelectItem value="milestone">Bei Erreichen von Meilensteinen</SelectItem>
                    <SelectItem value="special_occasion">Zu besonderen Anlässen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentation">Dokumentation</Label>
                <Select value={data.documentation || ''} onValueChange={(value) => updateField('documentation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dokumentationsart wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine Dokumentation</SelectItem>
                    <SelectItem value="written">Schriftlich</SelectItem>
                    <SelectItem value="photo">Foto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="comprehensive">Umfassend (Foto + schriftlich)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresPreparation"
                    checked={data.requiresPreparation || false}
                    onCheckedChange={(checked) => updateField('requiresPreparation', checked)}
                  />
                  <Label htmlFor="requiresPreparation" className="text-sm">Vorbereitung erforderlich</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresAftercare"
                    checked={data.requiresAftercare || false}
                    onCheckedChange={(checked) => updateField('requiresAftercare', checked)}
                  />
                  <Label htmlFor="requiresAftercare" className="text-sm">Nachsorge geplant</Label>
                </div>
              </div>
              
              {data.requiresPreparation && (
                <div className="space-y-2">
                  <Label htmlFor="preparationDetails">Vorbereitung (Details)</Label>
                  <Textarea
                    id="preparationDetails"
                    placeholder="Was muss vorbereitet werden?"
                    rows={2}
                    value={data.preparationDetails || ''}
                    onChange={(e) => updateField('preparationDetails', e.target.value)}
                  />
                </div>
              )}
              
              {data.requiresAftercare && (
                <div className="space-y-2">
                  <Label htmlFor="aftercareDetails">Nachsorge (Details)</Label>
                  <Textarea
                    id="aftercareDetails"
                    placeholder="Welche Nachsorge ist geplant?"
                    rows={2}
                    value={data.aftercareDetails || ''}
                    onChange={(e) => updateField('aftercareDetails', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Einverständnis & Grenzen */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <Label className="text-sm font-semibold text-green-700">Einverständnis & Grenzen</Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="explicitConsent"
                  checked={data.explicitConsent || false}
                  onCheckedChange={(checked) => updateField('explicitConsent', checked)}
                />
                <Label htmlFor="explicitConsent" className="text-sm font-medium">
                  Explizites Einverständnis des Subs wurde eingeholt *
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hardLimits">Hard Limits und Ausschlüsse</Label>
                <Textarea
                  id="hardLimits"
                  placeholder="Was ist absolut ausgeschlossen? Welche Grenzen dürfen nicht überschritten werden?"
                  rows={2}
                  value={data.hardLimits || ''}
                  onChange={(e) => updateField('hardLimits', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitClause">Ausstiegsklausel</Label>
                <Textarea
                  id="exitClause"
                  placeholder="Unter welchen Bedingungen kann das Ritual abgebrochen werden?"
                  rows={2}
                  value={data.exitClause || ''}
                  onChange={(e) => updateField('exitClause', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalConsiderations">Medizinische Überlegungen</Label>
                <Textarea
                  id="medicalConsiderations"
                  placeholder="Gibt es medizinische Aspekte zu beachten? Allergien, Vorerkrankungen, etc.?"
                  rows={2}
                  value={data.medicalConsiderations || ''}
                  onChange={(e) => updateField('medicalConsiderations', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Reversibilität */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              <Label className="text-sm font-semibold text-indigo-700">Reversibilität</Label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reversibility">Rückgängigmachung</Label>
                <Select value={data.reversibility || ''} onValueChange={(value) => updateField('reversibility', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Reversibilität wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent (nicht rückgängig machbar)</SelectItem>
                    <SelectItem value="temporary">Temporär</SelectItem>
                    <SelectItem value="symbolically_reversible">Symbolisch rückgängig machbar</SelectItem>
                    <SelectItem value="conditional">Unter bestimmten Bedingungen aufhebbar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(data.reversibility === 'temporary' || data.reversibility === 'conditional') && (
                <div className="space-y-2">
                  <Label htmlFor="reversibilityDetails">Details zur Rückgängigmachung</Label>
                  <Textarea
                    id="reversibilityDetails"
                    placeholder={
                      data.reversibility === 'temporary' 
                        ? "Nach welcher Zeit läuft das Ritual aus? Wie lange ist es gültig?"
                        : "Unter welchen Bedingungen kann das Ritual aufgehoben werden?"
                    }
                    rows={2}
                    value={data.reversibilityDetails || ''}
                    onChange={(e) => updateField('reversibilityDetails', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}