/**
 * SUB Registration Steps
 * 
 * Multi-page registration form for SUB users with comprehensive profile data
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

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
export const SubStep1: React.FC<StepProps> = ({ formData, updateFormData, onNext, isFirst }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Basisdaten & Identität</CardTitle>
        <CardDescription>Grundlegende Informationen über Sie</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Vorname</Label>
            <Input
              id="firstName"
              value={formData.firstName || ''}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              placeholder="Ihr Vorname"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Nachname</Label>
            <Input
              id="lastName"
              value={formData.lastName || ''}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              placeholder="Ihr Nachname"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Alter</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={formData.age || ''}
              onChange={(e) => updateFormData({ age: parseInt(e.target.value) })}
              placeholder="Ihr Alter"
            />
          </div>
          <div>
            <Label htmlFor="gender">Geschlecht</Label>
            <Select value={formData.gender || ''} onValueChange={(value) => updateFormData({ gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Geschlecht wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Männlich</SelectItem>
                <SelectItem value="female">Weiblich</SelectItem>
                <SelectItem value="non-binary">Non-binär</SelectItem>
                <SelectItem value="trans-male">Trans Mann</SelectItem>
                <SelectItem value="trans-female">Trans Frau</SelectItem>
                <SelectItem value="other">Andere</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="sexuality">Sexuelle Orientierung</Label>
          <Select value={formData.sexuality || ''} onValueChange={(value) => updateFormData({ sexuality: value })}>
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
              <SelectItem value="questioning">Noch unsicher</SelectItem>
              <SelectItem value="other">Andere</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Wohnort</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => updateFormData({ location: e.target.value })}
              placeholder="Stadt, Land"
            />
          </div>
          <div>
            <Label htmlFor="languages">Sprachen</Label>
            <Input
              id="languages"
              value={formData.languages || ''}
              onChange={(e) => updateFormData({ languages: e.target.value })}
              placeholder="z.B. Deutsch, Englisch"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="aboutMe">Über mich</Label>
          <Textarea
            id="aboutMe"
            value={formData.aboutMe || ''}
            onChange={(e) => updateFormData({ aboutMe: e.target.value })}
            placeholder="Erzählen Sie etwas über sich..."
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={onNext}>Weiter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Lebenssituation & Verfügbarkeit
export const SubStep2: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Lebenssituation & Verfügbarkeit</CardTitle>
        <CardDescription>Ihre aktuelle Lebenssituation und Verfügbarkeit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="profession">Beruf</Label>
            <Input
              id="profession"
              value={formData.profession || ''}
              onChange={(e) => updateFormData({ profession: e.target.value })}
              placeholder="Ihre Berufsbezeichnung"
            />
          </div>
          <div>
            <Label htmlFor="workSchedule">Arbeitszeiten</Label>
            <Select value={formData.workSchedule || ''} onValueChange={(value) => updateFormData({ workSchedule: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Arbeitszeiten" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regulär (9-17 Uhr)</SelectItem>
                <SelectItem value="shift">Schichtarbeit</SelectItem>
                <SelectItem value="flexible">Flexible Zeiten</SelectItem>
                <SelectItem value="weekend">Wochenendarbeit</SelectItem>
                <SelectItem value="freelance">Freiberuflich</SelectItem>
                <SelectItem value="student">Student/in</SelectItem>
                <SelectItem value="unemployed">Arbeitssuchend</SelectItem>
                <SelectItem value="retired">Rentner/in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
          <Label htmlFor="availability">Verfügbarkeit für Sessions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${day}`}
                  checked={formData.availableDays?.includes(day) || false}
                  onCheckedChange={(checked) => {
                    const days = formData.availableDays || [];
                    if (checked) {
                      updateFormData({ availableDays: [...days, day] });
                    } else {
                      updateFormData({ availableDays: days.filter((d: string) => d !== day) });
                    }
                  }}
                />
                <Label htmlFor={`availability-${day}`}>{day}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="submissionAvailability">Verfügbarkeit für Submission</Label>
          <Select value={formData.submissionAvailability || ''} onValueChange={(value) => updateFormData({ submissionAvailability: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Verfügbarkeit wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="session-only">Nur während Sessions</SelectItem>
              <SelectItem value="daily-tasks">Tägliche Aufgaben</SelectItem>
              <SelectItem value="part-time">Teilzeit (bestimmte Stunden)</SelectItem>
              <SelectItem value="24-7">24/7 Verfügbarkeit</SelectItem>
              <SelectItem value="weekends">Nur Wochenenden</SelectItem>
              <SelectItem value="flexible">Flexibel nach Absprache</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="privacy">Privatsphäre-Level</Label>
          <Select value={formData.privacy || ''} onValueChange={(value) => updateFormData({ privacy: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Privatsphäre-Level wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Hoch - Maximale Diskretion</SelectItem>
              <SelectItem value="medium">Mittel - Selektive Offenheit</SelectItem>
              <SelectItem value="low">Niedrig - Offene Kommunikation</SelectItem>
              <SelectItem value="public">Öffentlich - Community-Teilnahme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Zurück</Button>
          <Button onClick={onNext}>Weiter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Gesundheit & Grenzen
export const SubStep3: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gesundheit & Grenzen</CardTitle>
        <CardDescription>Wichtige Informationen für Ihre Sicherheit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="healthConditions">Gesundheitszustand</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Herzprobleme', 'Bluthochdruck', 'Diabetes', 'Epilepsie', 
              'Rückenprobleme', 'Gelenkprobleme', 'Atemprobleme', 'Hauterkrankungen',
              'Psychische Erkrankungen', 'Medikamenteneinnahme', 'Schwangerschaft', 'Andere'
            ].map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={`health-${condition}`}
                  checked={formData.healthConditions?.includes(condition) || false}
                  onCheckedChange={(checked) => {
                    const conditions = formData.healthConditions || [];
                    if (checked) {
                      updateFormData({ healthConditions: [...conditions, condition] });
                    } else {
                      updateFormData({ healthConditions: conditions.filter((c: string) => c !== condition) });
                    }
                  }}
                />
                <Label htmlFor={`health-${condition}`}>{condition}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="healthNotes">Gesundheitshinweise (Details)</Label>
          <Textarea
            id="healthNotes"
            value={formData.healthNotes || ''}
            onChange={(e) => updateFormData({ healthNotes: e.target.value })}
            placeholder="Weitere Details zu Ihrem Gesundheitszustand..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="hardLimits">Absolute Grenzen (Hard Limits)</Label>
          <Textarea
            id="hardLimits"
            value={formData.hardLimits || ''}
            onChange={(e) => updateFormData({ hardLimits: e.target.value })}
            placeholder="Aktivitäten, die Sie niemals durchführen möchten..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="softLimits">Weiche Grenzen (Soft Limits)</Label>
          <Textarea
            id="softLimits"
            value={formData.softLimits || ''}
            onChange={(e) => updateFormData({ softLimits: e.target.value })}
            placeholder="Aktivitäten, bei denen Sie vorsichtig sein möchten..."
            rows={3}
          />
        </div>

        <div>
          <Label>Schmerztoleranz (1-10)</Label>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="painTolerance">Allgemeine Schmerztoleranz: {formData.painTolerance || 5}</Label>
              <Slider
                id="painTolerance"
                min={1}
                max={10}
                step={1}
                value={[formData.painTolerance || 5]}
                onValueChange={(value) => updateFormData({ painTolerance: value[0] })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="impactTolerance">Impact Play Toleranz: {formData.impactTolerance || 5}</Label>
              <Slider
                id="impactTolerance"
                min={1}
                max={10}
                step={1}
                value={[formData.impactTolerance || 5]}
                onValueChange={(value) => updateFormData({ impactTolerance: value[0] })}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="safewords">Safewords</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <Label htmlFor="greenSafeword">Grün (Weiter)</Label>
              <Input
                id="greenSafeword"
                value={formData.greenSafeword || ''}
                onChange={(e) => updateFormData({ greenSafeword: e.target.value })}
                placeholder="z.B. Grün"
              />
            </div>
            <div>
              <Label htmlFor="yellowSafeword">Gelb (Langsamer)</Label>
              <Input
                id="yellowSafeword"
                value={formData.yellowSafeword || ''}
                onChange={(e) => updateFormData({ yellowSafeword: e.target.value })}
                placeholder="z.B. Gelb"
              />
            </div>
            <div>
              <Label htmlFor="redSafeword">Rot (Stopp)</Label>
              <Input
                id="redSafeword"
                value={formData.redSafeword || ''}
                onChange={(e) => updateFormData({ redSafeword: e.target.value })}
                placeholder="z.B. Rot"
              />
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

// Step 4: BDSM-Erfahrung & Präferenzen
export const SubStep4: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>BDSM-Erfahrung & Präferenzen</CardTitle>
        <CardDescription>Ihre Erfahrungen und Vorlieben im BDSM-Bereich</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="bdsmExperience">BDSM-Erfahrung</Label>
          <Select value={formData.bdsmExperience || ''} onValueChange={(value) => updateFormData({ bdsmExperience: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Erfahrungsgrad wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curious">Neugierig/Interessiert</SelectItem>
              <SelectItem value="beginner">Anfänger (0-1 Jahre)</SelectItem>
              <SelectItem value="intermediate">Fortgeschritten (1-5 Jahre)</SelectItem>
              <SelectItem value="experienced">Erfahren (5-10 Jahre)</SelectItem>
              <SelectItem value="expert">Experte (10+ Jahre)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="submissionStyle">Sub-Stil</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Bratty', 'Gehorsam/Obedient', 'Service-orientiert', 'Little/Middle',
              'Pet/Puppy', 'Slave', 'Masochistisch', 'Sensual',
              'Rope Bunny', 'Pain Slut', 'Good Girl/Boy', 'Princess/Prince'
            ].map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`sub-style-${style}`}
                  checked={formData.submissionStyles?.includes(style) || false}
                  onCheckedChange={(checked) => {
                    const styles = formData.submissionStyles || [];
                    if (checked) {
                      updateFormData({ submissionStyles: [...styles, style] });
                    } else {
                      updateFormData({ submissionStyles: styles.filter((s: string) => s !== style) });
                    }
                  }}
                />
                <Label htmlFor={`sub-style-${style}`}>{style}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="interests">Interessante Aktivitäten</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Bondage', 'Spanking', 'Flogging', 'Paddling', 'Caning', 'Wax Play',
              'Temperature Play', 'Sensory Play', 'Elektro Play', 'Needle Play',
              'Rope Bondage', 'Suspension', 'Pet Play', 'Age Play', 'Role Play',
              'Humiliation', 'Degradation', 'Praise', 'Service', 'Protocol',
              'Orgasm Control', 'Chastity', 'Teasing & Denial', 'Forced Orgasm'
            ].map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={`interest-${activity}`}
                  checked={formData.interests?.includes(activity) || false}
                  onCheckedChange={(checked) => {
                    const interests = formData.interests || [];
                    if (checked) {
                      updateFormData({ interests: [...interests, activity] });
                    } else {
                      updateFormData({ interests: interests.filter((i: string) => i !== activity) });
                    }
                  }}
                />
                <Label htmlFor={`interest-${activity}`}>{activity}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="fantasies">Fantasien & Wünsche</Label>
          <Textarea
            id="fantasies"
            value={formData.fantasies || ''}
            onChange={(e) => updateFormData({ fantasies: e.target.value })}
            placeholder="Beschreiben Sie Ihre BDSM-Fantasien und Wünsche..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="previousExperiences">Bisherige Erfahrungen</Label>
          <Textarea
            id="previousExperiences"
            value={formData.previousExperiences || ''}
            onChange={(e) => updateFormData({ previousExperiences: e.target.value })}
            placeholder="Welche BDSM-Erfahrungen haben Sie bereits gemacht?"
            rows={3}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Zurück</Button>
          <Button onClick={onNext}>Weiter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 5: Beziehungswünsche & Kommunikation
export const SubStep5: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Beziehungswünsche & Kommunikation</CardTitle>
        <CardDescription>Ihre Vorstellungen von der gewünschten Beziehung</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="seekingDomType">Gesuchter Dom-Typ</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Streng/Strict', 'Fürsorgend/Caring', 'Spielerisch/Playful', 'Sadistisch/Sadistic',
              'Daddy/Mommy', 'Master/Mistress', 'Owner', 'Trainer',
              'Erfahren', 'Geduldig', 'Experimentierfreudig', 'Verständnisvoll'
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`seeking-${type}`}
                  checked={formData.seekingDomTypes?.includes(type) || false}
                  onCheckedChange={(checked) => {
                    const types = formData.seekingDomTypes || [];
                    if (checked) {
                      updateFormData({ seekingDomTypes: [...types, type] });
                    } else {
                      updateFormData({ seekingDomTypes: types.filter((t: string) => t !== type) });
                    }
                  }}
                />
                <Label htmlFor={`seeking-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="relationshipType">Gewünschte Beziehungsart</Label>
          <Select value={formData.relationshipType || ''} onValueChange={(value) => updateFormData({ relationshipType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Beziehungsart wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learning">Lernen & Entdecken</SelectItem>
              <SelectItem value="casual">Gelegentliche Sessions</SelectItem>
              <SelectItem value="regular">Regelmäßige Partnerschaft</SelectItem>
              <SelectItem value="exclusive">Exklusive Beziehung</SelectItem>
              <SelectItem value="long-term">Langfristige Beziehung</SelectItem>
              <SelectItem value="24-7">24/7 Lifestyle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="aftercareNeeds">Aftercare-Bedürfnisse</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Kuscheln', 'Gespräche', 'Stille Zeit', 'Snacks/Getränke',
              'Warme Decke', 'Beruhigende Musik', 'Massage', 'Duschen/Baden',
              'Positive Bestärkung', 'Check-in Gespräche', 'Allein Zeit', 'Andere'
            ].map((need) => (
              <div key={need} className="flex items-center space-x-2">
                <Checkbox
                  id={`aftercare-${need}`}
                  checked={formData.aftercareNeeds?.includes(need) || false}
                  onCheckedChange={(checked) => {
                    const needs = formData.aftercareNeeds || [];
                    if (checked) {
                      updateFormData({ aftercareNeeds: [...needs, need] });
                    } else {
                      updateFormData({ aftercareNeeds: needs.filter((n: string) => n !== need) });
                    }
                  }}
                />
                <Label htmlFor={`aftercare-${need}`}>{need}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="communicationPreferences">Kommunikationspräferenzen</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Täglich checken', 'Regelmäßige Updates', 'Video-Calls', 'Textnachrichten',
              'Offene Gespräche', 'Strukturierte Check-ins', 'Feedback Sessions', 'Journal teilen'
            ].map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={`comm-pref-${pref}`}
                  checked={formData.communicationPreferences?.includes(pref) || false}
                  onCheckedChange={(checked) => {
                    const prefs = formData.communicationPreferences || [];
                    if (checked) {
                      updateFormData({ communicationPreferences: [...prefs, pref] });
                    } else {
                      updateFormData({ communicationPreferences: prefs.filter((p: string) => p !== pref) });
                    }
                  }}
                />
                <Label htmlFor={`comm-pref-${pref}`}>{pref}</Label>
              </div>
            ))}
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

// Step 6: Ziele & Entwicklung
export const SubStep6: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev, isLast }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ziele & Entwicklung</CardTitle>
        <CardDescription>Ihre persönlichen Ziele und Entwicklungswünsche</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="personalGoals">Persönliche Ziele</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Selbstvertrauen aufbauen', 'Grenzen erkunden', 'Kontrolle abgeben lernen', 'Neue Erfahrungen sammeln',
              'Vertrauen aufbauen', 'Kommunikation verbessern', 'Fantasien ausleben', 'Stress abbauen',
              'Disziplin entwickeln', 'Service-Fähigkeiten', 'Spirituelle Verbindung', 'Persönlichkeitsentwicklung'
            ].map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={formData.personalGoals?.includes(goal) || false}
                  onCheckedChange={(checked) => {
                    const goals = formData.personalGoals || [];
                    if (checked) {
                      updateFormData({ personalGoals: [...goals, goal] });
                    } else {
                      updateFormData({ personalGoals: goals.filter((g: string) => g !== goal) });
                    }
                  }}
                />
                <Label htmlFor={`goal-${goal}`}>{goal}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="learningInterests">Lerninteressen</Label>
          <Textarea
            id="learningInterests"
            value={formData.learningInterests || ''}
            onChange={(e) => updateFormData({ learningInterests: e.target.value })}
            placeholder="Was möchten Sie im BDSM-Bereich lernen und entwickeln?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="rewards">Motivierende Belohnungen</Label>
          <Textarea
            id="rewards"
            value={formData.rewards || ''}
            onChange={(e) => updateFormData({ rewards: e.target.value })}
            placeholder="Welche Arten von Belohnungen motivieren Sie?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="dealBreakers">Deal-Breaker</Label>
          <Textarea
            id="dealBreakers"
            value={formData.dealBreakers || ''}
            onChange={(e) => updateFormData({ dealBreakers: e.target.value })}
            placeholder="Verhaltensweisen oder Eigenschaften, die für Sie inakzeptabel sind..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="additionalNotes">Zusätzliche Notizen</Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes || ''}
            onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
            placeholder="Weitere wichtige Informationen über Sie..."
            rows={3}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Zurück</Button>
          <Button onClick={onNext}>{isLast ? 'Profil abschließen' : 'Weiter'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const subRegistrationSteps = [
  { component: SubStep1, title: 'Basisdaten & Identität' },
  { component: SubStep2, title: 'Lebenssituation & Verfügbarkeit' },
  { component: SubStep3, title: 'Gesundheit & Grenzen' },
  { component: SubStep4, title: 'BDSM-Erfahrung & Präferenzen' },
  { component: SubStep5, title: 'Beziehungswünsche & Kommunikation' },
  { component: SubStep6, title: 'Ziele & Entwicklung' }
];