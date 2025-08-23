/**
 * Comprehensive DOM Registration Steps
 * 
 * Complete multi-page registration form with all categories
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormData {
  [key: string]: any;
}

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// Step 1: Basisdaten & Identität
export const DomStep1: React.FC<StepProps> = ({ formData, updateFormData, onNext, isFirst }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Basisdaten & Identität</CardTitle>
        <CardDescription>Persönliche Informationen und Identität</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Persönliche Identität */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Persönliche Identität</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate">Geburtsdatum</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate || ''}
                onChange={(e) => updateFormData({ birthDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="age">Alter</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age || ''}
                onChange={(e) => updateFormData({ age: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genderIdentity">Geschlechtsidentität</Label>
              <Select value={formData.genderIdentity || ''} onValueChange={(value) => updateFormData({ genderIdentity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Geschlechtsidentität wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cis-male">Cis Mann</SelectItem>
                  <SelectItem value="cis-female">Cis Frau</SelectItem>
                  <SelectItem value="trans-male">Trans Mann</SelectItem>
                  <SelectItem value="trans-female">Trans Frau</SelectItem>
                  <SelectItem value="non-binary">Non-binär</SelectItem>
                  <SelectItem value="genderfluid">Genderfluid</SelectItem>
                  <SelectItem value="agender">Agender</SelectItem>
                  <SelectItem value="other">Andere</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pronouns">Pronomen</Label>
              <Select value={formData.pronouns || ''} onValueChange={(value) => updateFormData({ pronouns: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pronomen wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="er">er/ihm</SelectItem>
                  <SelectItem value="sie">sie/ihr</SelectItem>
                  <SelectItem value="they">they/them</SelectItem>
                  <SelectItem value="xier">xier/xiem</SelectItem>
                  <SelectItem value="per">per/per</SelectItem>
                  <SelectItem value="custom">Andere/Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sexualOrientation">Sexuelle Orientierung</Label>
              <Select value={formData.sexualOrientation || ''} onValueChange={(value) => updateFormData({ sexualOrientation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Orientierung wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heterosexual">Heterosexuell</SelectItem>
                  <SelectItem value="homosexual">Homosexuell</SelectItem>
                  <SelectItem value="bisexual">Bisexuell</SelectItem>
                  <SelectItem value="pansexual">Pansexuell</SelectItem>
                  <SelectItem value="demisexual">Demisexuell</SelectItem>
                  <SelectItem value="asexual">Asexuell</SelectItem>
                  <SelectItem value="graysexual">Graysexuell</SelectItem>
                  <SelectItem value="questioning">Noch unsicher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="romanticOrientation">Romantische Orientierung</Label>
              <Select value={formData.romanticOrientation || ''} onValueChange={(value) => updateFormData({ romanticOrientation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Romantische Orientierung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heteroromantic">Heteroromantisch</SelectItem>
                  <SelectItem value="homoromantic">Homoromantisch</SelectItem>
                  <SelectItem value="biromantic">Biromantisch</SelectItem>
                  <SelectItem value="panromantic">Panromantisch</SelectItem>
                  <SelectItem value="demiromantic">Demiromantisch</SelectItem>
                  <SelectItem value="aromantic">Aromantisch</SelectItem>
                  <SelectItem value="grayromantic">Grayromantisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="ethnicCulturalIdentity">Ethnische/kulturelle Identität</Label>
            <Input
              id="ethnicCulturalIdentity"
              value={formData.ethnicCulturalIdentity || ''}
              onChange={(e) => updateFormData({ ethnicCulturalIdentity: e.target.value })}
              placeholder="z.B. Deutsch, Türkisch-Deutsch, Afro-Amerikanisch..."
            />
          </div>
        </div>

        {/* Geografische Daten */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Geografische Daten</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Wohnort/Region</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => updateFormData({ location: e.target.value })}
                placeholder="Stadt, Bundesland/Region"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Zeitzone</Label>
              <Select value={formData.timezone || ''} onValueChange={(value) => updateFormData({ timezone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Zeitzone wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CET">CET (Mitteleuropäische Zeit)</SelectItem>
                  <SelectItem value="EST">EST (Ostküste USA)</SelectItem>
                  <SelectItem value="PST">PST (Westküste USA)</SelectItem>
                  <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                  <SelectItem value="JST">JST (Japan Standard Time)</SelectItem>
                  <SelectItem value="other">Andere</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobility">Mobilität/Reisebereitschaft</Label>
              <Select value={formData.mobility || ''} onValueChange={(value) => updateFormData({ mobility: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Reisebereitschaft" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Nur lokal</SelectItem>
                  <SelectItem value="regional">Regional (bis 100km)</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="limited">Eingeschränkt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="languages">Sprachen</Label>
              <Input
                id="languages"
                value={formData.languages || ''}
                onChange={(e) => updateFormData({ languages: e.target.value })}
                placeholder="z.B. Deutsch (Muttersprache), Englisch (fließend)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onNext}>Weiter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Lebenssituation & Verfügbarkeit
export const DomStep2: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Lebenssituation & Verfügbarkeit</CardTitle>
        <CardDescription>Ihre aktuelle Lebenssituation und zeitlichen Ressourcen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wohn- und Lebenssituation */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Wohn- und Lebenssituation</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="livingSituation">Wohnsituation</Label>
              <Select value={formData.livingSituation || ''} onValueChange={(value) => updateFormData({ livingSituation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Wohnsituation wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alone">Alleine lebend</SelectItem>
                  <SelectItem value="with-partner">Mit Partner/in</SelectItem>
                  <SelectItem value="with-family">Bei Familie</SelectItem>
                  <SelectItem value="shared-flat">WG</SelectItem>
                  <SelectItem value="with-friends">Mit Freunden</SelectItem>
                  <SelectItem value="other">Andere</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="privacyLevel">Privatsphäre-Level</Label>
              <Select value={formData.privacyLevel || ''} onValueChange={(value) => updateFormData({ privacyLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Privatsphäre wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Hoch - Eigener Bereich</SelectItem>
                  <SelectItem value="medium">Mittel - Teilweise privat</SelectItem>
                  <SelectItem value="low">Niedrig - Wenig Privatsphäre</SelectItem>
                  <SelectItem value="sessions-possible">Sessions möglich</SelectItem>
                  <SelectItem value="calls-only">Nur Calls möglich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="children">Kinder/Dependents</Label>
              <Select value={formData.children || ''} onValueChange={(value) => updateFormData({ children: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Kinder/Dependents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Keine</SelectItem>
                  <SelectItem value="young-children">Kleine Kinder (unter 10)</SelectItem>
                  <SelectItem value="teenagers">Teenager</SelectItem>
                  <SelectItem value="adult-children">Erwachsene Kinder</SelectItem>
                  <SelectItem value="elderly-care">Pflege von Angehörigen</SelectItem>
                  <SelectItem value="other-dependents">Andere Dependents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pets">Haustiere</Label>
              <Input
                id="pets"
                value={formData.pets || ''}
                onChange={(e) => updateFormData({ pets: e.target.value })}
                placeholder="z.B. Hund, Katze, Allergien beachten"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profession">Berufliche Situation</Label>
            <Select value={formData.profession || ''} onValueChange={(value) => updateFormData({ profession: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Berufliche Situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Vollzeit angestellt</SelectItem>
                <SelectItem value="part-time">Teilzeit angestellt</SelectItem>
                <SelectItem value="freelance">Freiberuflich</SelectItem>
                <SelectItem value="shift-work">Schichtarbeit</SelectItem>
                <SelectItem value="home-office">Homeoffice</SelectItem>
                <SelectItem value="travel-job">Reisetätigkeit</SelectItem>
                <SelectItem value="student">Student/in</SelectItem>
                <SelectItem value="unemployed">Arbeitssuchend</SelectItem>
                <SelectItem value="retired">Rentner/in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Zeitliche Ressourcen */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Zeitliche Ressourcen</h3>
          
          <div>
            <Label>Verfügbare Stunden pro Woche für BDSM: {formData.availableHours || 5}</Label>
            <Slider
              value={[formData.availableHours || 5]}
              onValueChange={(value) => updateFormData({ availableHours: value[0] })}
              max={40}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="preferredTimes">Bevorzugte Tageszeiten</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Früh morgens (6-9)', 'Vormittags (9-12)', 'Mittags (12-15)', 'Nachmittags (15-18)', 'Abends (18-21)', 'Spät abends (21-24)', 'Nachts (24-6)'].map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={`time-${time}`}
                    checked={formData.preferredTimes?.includes(time) || false}
                    onCheckedChange={(checked) => {
                      const times = formData.preferredTimes || [];
                      if (checked) {
                        updateFormData({ preferredTimes: [...times, time] });
                      } else {
                        updateFormData({ preferredTimes: times.filter((t: string) => t !== time) });
                      }
                    }}
                  />
                  <Label htmlFor={`time-${time}`} className="text-sm">{time}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weekendAvailability">Wochenend-Verfügbarkeit</Label>
              <Select value={formData.weekendAvailability || ''} onValueChange={(value) => updateFormData({ weekendAvailability: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Wochenende" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Vollständig verfügbar</SelectItem>
                  <SelectItem value="partial">Teilweise verfügbar</SelectItem>
                  <SelectItem value="limited">Eingeschränkt verfügbar</SelectItem>
                  <SelectItem value="none">Nicht verfügbar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="spontaneity">Spontanität vs. Planung</Label>
              <Select value={formData.spontaneity || ''} onValueChange={(value) => updateFormData({ spontaneity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Planungstyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spontaneous">Sehr spontan</SelectItem>
                  <SelectItem value="flexible">Flexibel</SelectItem>
                  <SelectItem value="planned">Bevorzuge Planung</SelectItem>
                  <SelectItem value="structured">Brauche Struktur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Finanzielle Parameter */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Finanzielle Parameter</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bdsmBudget">Budget für BDSM (monatlich)</Label>
              <Select value={formData.bdsmBudget || ''} onValueChange={(value) => updateFormData({ bdsmBudget: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50">Unter 50€</SelectItem>
                  <SelectItem value="50-100">50-100€</SelectItem>
                  <SelectItem value="100-250">100-250€</SelectItem>
                  <SelectItem value="250-500">250-500€</SelectItem>
                  <SelectItem value="over-500">Über 500€</SelectItem>
                  <SelectItem value="flexible">Flexibel je nach Bedarf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="financialStability">Finanzielle Stabilität</Label>
              <Select value={formData.financialStability || ''} onValueChange={(value) => updateFormData({ financialStability: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Stabilität" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable">Stabil</SelectItem>
                  <SelectItem value="mostly-stable">Überwiegend stabil</SelectItem>
                  <SelectItem value="variable">Schwankend</SelectItem>
                  <SelectItem value="limited">Eingeschränkt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="financialIndependence">Finanzielle Unabhängigkeit</Label>
            <RadioGroup 
              value={formData.financialIndependence || ''} 
              onValueChange={(value) => updateFormData({ financialIndependence: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="independent" id="independent" />
                <Label htmlFor="independent">Vollständig unabhängig</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostly-independent" id="mostly-independent" />
                <Label htmlFor="mostly-independent">Überwiegend unabhängig</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supported" id="supported" />
                <Label htmlFor="supported">Teilweise unterstützt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dependent" id="dependent" />
                <Label htmlFor="dependent">Abhängig von anderen</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Zurück</Button>
          <Button onClick={onNext}>Weiter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Gesundheit
export const DomStep3: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gesundheit</CardTitle>
        <CardDescription>Physische und psychische Gesundheitsinformationen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Physische Gesundheit */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Physische Gesundheit</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="height">Größe (cm)</Label>
              <Input
                id="height"
                type="number"
                min="140"
                max="220"
                value={formData.height || ''}
                onChange={(e) => updateFormData({ height: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="weight">Gewicht (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="40"
                max="200"
                value={formData.weight || ''}
                onChange={(e) => updateFormData({ weight: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="fitnessLevel">Fitness-Level</Label>
              <Select value={formData.fitnessLevel || ''} onValueChange={(value) => updateFormData({ fitnessLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Fitness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="moderate">Moderat</SelectItem>
                  <SelectItem value="good">Gut</SelectItem>
                  <SelectItem value="excellent">Ausgezeichnet</SelectItem>
                  <SelectItem value="athletic">Athletisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="mobility">Beweglichkeit/Flexibilität</Label>
            <Select value={formData.physicalMobility || ''} onValueChange={(value) => updateFormData({ physicalMobility: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Beweglichkeit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-flexible">Sehr beweglich</SelectItem>
                <SelectItem value="flexible">Beweglich</SelectItem>
                <SelectItem value="average">Durchschnittlich</SelectItem>
                <SelectItem value="limited">Eingeschränkt</SelectItem>
                <SelectItem value="very-limited">Stark eingeschränkt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chronicConditions">Chronische Erkrankungen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Diabetes', 'Bluthochdruck', 'Herzprobleme', 'Epilepsie', 'Asthma', 'Arthritis', 'Rückenprobleme', 'Hauterkrankungen', 'Andere', 'Keine'].map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chronic-${condition}`}
                    checked={formData.chronicConditions?.includes(condition) || false}
                    onCheckedChange={(checked) => {
                      const conditions = formData.chronicConditions || [];
                      if (checked) {
                        updateFormData({ chronicConditions: [...conditions, condition] });
                      } else {
                        updateFormData({ chronicConditions: conditions.filter((c: string) => c !== condition) });
                      }
                    }}
                  />
                  <Label htmlFor={`chronic-${condition}`} className="text-sm">{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="allergies">Allergien & Medikamenteninteraktionen</Label>
            <Textarea
              id="allergies"
              value={formData.allergies || ''}
              onChange={(e) => updateFormData({ allergies: e.target.value })}
              placeholder="Allergien, Unverträglichkeiten, Medikamenteninteraktionen..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyMedication">Notfallmedikation</Label>
              <Input
                id="emergencyMedication"
                value={formData.emergencyMedication || ''}
                onChange={(e) => updateFormData({ emergencyMedication: e.target.value })}
                placeholder="z.B. Insulin, Notfall-Inhalator..."
              />
            </div>
            <div>
              <Label htmlFor="regularMedication">Regelmäßige Medikation</Label>
              <Input
                id="regularMedication"
                value={formData.regularMedication || ''}
                onChange={(e) => updateFormData({ regularMedication: e.target.value })}
                placeholder="Regelmäßig eingenommene Medikamente..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contraceptionSTI">Verhütung/STI-Status</Label>
            <Textarea
              id="contraceptionSTI"
              value={formData.contraceptionSTI || ''}
              onChange={(e) => updateFormData({ contraceptionSTI: e.target.value })}
              placeholder="Verhütungsmethoden, letzter STI-Test, relevante Informationen..."
              rows={2}
            />
          </div>
        </div>

        {/* Psychische Gesundheit */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Psychische Gesundheit</h3>
          
          <div>
            <Label htmlFor="mentalHealthDiagnoses">Psychische Diagnosen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Depression', 'Angststörungen', 'ADS/ADHS', 'Borderline', 'Bipolare Störung', 'PTBS', 'Autismus-Spektrum', 'Essstörungen', 'Andere', 'Keine'].map((diagnosis) => (
                <div key={diagnosis} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mental-${diagnosis}`}
                    checked={formData.mentalHealthDiagnoses?.includes(diagnosis) || false}
                    onCheckedChange={(checked) => {
                      const diagnoses = formData.mentalHealthDiagnoses || [];
                      if (checked) {
                        updateFormData({ mentalHealthDiagnoses: [...diagnoses, diagnosis] });
                      } else {
                        updateFormData({ mentalHealthDiagnoses: diagnoses.filter((d: string) => d !== diagnosis) });
                      }
                    }}
                  />
                  <Label htmlFor={`mental-${diagnosis}`} className="text-sm">{diagnosis}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentTherapy">Aktuelle Therapie</Label>
              <RadioGroup 
                value={formData.currentTherapy || ''} 
                onValueChange={(value) => updateFormData({ currentTherapy: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="therapy-yes" />
                  <Label htmlFor="therapy-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="therapy-no" />
                  <Label htmlFor="therapy-no">Nein</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planned" id="therapy-planned" />
                  <Label htmlFor="therapy-planned">Geplant</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="psychopharmaceuticals">Psychopharmaka</Label>
              <Input
                id="psychopharmaceuticals"
                value={formData.psychopharmaceuticals || ''}
                onChange={(e) => updateFormData({ psychopharmaceuticals: e.target.value })}
                placeholder="Antidepressiva, Anxiolytika etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="traumaHistory">Trauma-Historie</Label>
            <Textarea
              id="traumaHistory"
              value={formData.traumaHistory || ''}
              onChange={(e) => updateFormData({ traumaHistory: e.target.value })}
              placeholder="Relevante Trauma-Erfahrungen, Trigger (vertraulich behandelt)..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="addiction">Suchterkrankungen</Label>
              <Select value={formData.addiction || ''} onValueChange={(value) => updateFormData({ addiction: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Suchterkrankungen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Keine</SelectItem>
                  <SelectItem value="active">Aktive Sucht</SelectItem>
                  <SelectItem value="recovering">In Genesung</SelectItem>
                  <SelectItem value="remission">Remittiert</SelectItem>
                  <SelectItem value="past">Vergangene Sucht</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emotionalRegulation">Emotionale Regulation</Label>
              <Select value={formData.emotionalRegulation || ''} onValueChange={(value) => updateFormData({ emotionalRegulation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Regulation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Ausgezeichnet</SelectItem>
                  <SelectItem value="good">Gut</SelectItem>
                  <SelectItem value="moderate">Moderat</SelectItem>
                  <SelectItem value="challenging">Herausfordernd</SelectItem>
                  <SelectItem value="difficult">Schwierig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Zurück</Button>
          <Button onClick={onNext}>Weiter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const comprehensiveDomSteps = [
  { component: DomStep1, title: 'Basisdaten & Identität' },
  { component: DomStep2, title: 'Lebenssituation & Verfügbarkeit' },
  { component: DomStep3, title: 'Gesundheit' }
  // Weitere Steps folgen in separaten Dateien
];