/**
 * DOM Registration Steps
 * 
 * Multi-page registration form for DOM users with comprehensive profile data
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
export const DomStep2: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timePreference">Bevorzugte Tageszeit</Label>
            <Select value={formData.timePreference || ''} onValueChange={(value) => updateFormData({ timePreference: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tageszeit wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morgens (6-12 Uhr)</SelectItem>
                <SelectItem value="afternoon">Nachmittags (12-18 Uhr)</SelectItem>
                <SelectItem value="evening">Abends (18-24 Uhr)</SelectItem>
                <SelectItem value="night">Nachts (24-6 Uhr)</SelectItem>
                <SelectItem value="flexible">Flexibel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sessionFrequency">Gewünschte Session-Häufigkeit</Label>
            <Select value={formData.sessionFrequency || ''} onValueChange={(value) => updateFormData({ sessionFrequency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Häufigkeit wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="several-times-week">Mehrmals pro Woche</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="bi-weekly">Alle zwei Wochen</SelectItem>
                <SelectItem value="monthly">Monatlich</SelectItem>
                <SelectItem value="irregular">Unregelmäßig</SelectItem>
              </SelectContent>
            </Select>
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

// Step 3: Gesundheit & Grenzen
export const DomStep3: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
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
export const DomStep4: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
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
              <SelectItem value="beginner">Anfänger (0-1 Jahre)</SelectItem>
              <SelectItem value="intermediate">Fortgeschritten (1-5 Jahre)</SelectItem>
              <SelectItem value="experienced">Erfahren (5-10 Jahre)</SelectItem>
              <SelectItem value="expert">Experte (10+ Jahre)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dominanceStyle">Dom-Stil</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Streng/Strict', 'Fürsorgend/Caring', 'Spielerisch/Playful', 'Sadistisch/Sadistic',
              'Psychologisch/Psychological', 'Sensual', 'Primal', 'Daddy/Mommy Dom',
              'Master/Mistress', 'Owner', 'Trainer', 'Service Top'
            ].map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`dom-style-${style}`}
                  checked={formData.dominanceStyles?.includes(style) || false}
                  onCheckedChange={(checked) => {
                    const styles = formData.dominanceStyles || [];
                    if (checked) {
                      updateFormData({ dominanceStyles: [...styles, style] });
                    } else {
                      updateFormData({ dominanceStyles: styles.filter((s: string) => s !== style) });
                    }
                  }}
                />
                <Label htmlFor={`dom-style-${style}`}>{style}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="preferredActivities">Bevorzugte Aktivitäten</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Bondage', 'Spanking', 'Flogging', 'Paddling', 'Caning', 'Wax Play',
              'Temperature Play', 'Sensory Play', 'Elektro Play', 'Needle Play',
              'Rope Bondage', 'Suspension', 'Pet Play', 'Age Play', 'Role Play',
              'Humiliation', 'Degradation', 'Praise', 'Service', 'Protocol'
            ].map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={`activity-${activity}`}
                  checked={formData.preferredActivities?.includes(activity) || false}
                  onCheckedChange={(checked) => {
                    const activities = formData.preferredActivities || [];
                    if (checked) {
                      updateFormData({ preferredActivities: [...activities, activity] });
                    } else {
                      updateFormData({ preferredActivities: activities.filter((a: string) => a !== activity) });
                    }
                  }}
                />
                <Label htmlFor={`activity-${activity}`}>{activity}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="toys">Verfügbare Toys & Equipment</Label>
          <Textarea
            id="toys"
            value={formData.toys || ''}
            onChange={(e) => updateFormData({ toys: e.target.value })}
            placeholder="Liste Ihrer verfügbaren BDSM-Toys und Ausrüstung..."
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

// Step 5: Beziehungsvorstellungen & Kommunikation
export const DomStep5: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev, isLast }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Beziehungsvorstellungen & Kommunikation</CardTitle>
        <CardDescription>Ihre Vorstellungen von der gewünschten Beziehung</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="relationshipType">Gewünschte Beziehungsart</Label>
          <Select value={formData.relationshipType || ''} onValueChange={(value) => updateFormData({ relationshipType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Beziehungsart wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Gelegentliche Sessions</SelectItem>
              <SelectItem value="regular">Regelmäßige Partnerschaft</SelectItem>
              <SelectItem value="exclusive">Exklusive Beziehung</SelectItem>
              <SelectItem value="multiple">Mehrere Partner</SelectItem>
              <SelectItem value="poly">Polyamorie</SelectItem>
              <SelectItem value="undecided">Noch unentschieden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="commitmentLevel">Gewünschter Commitment-Level</Label>
          <Select value={formData.commitmentLevel || ''} onValueChange={(value) => updateFormData({ commitmentLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Commitment-Level wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Niedrig - Lockere Kontakte</SelectItem>
              <SelectItem value="medium">Mittel - Regelmäßige Sessions</SelectItem>
              <SelectItem value="high">Hoch - Feste Partnerschaft</SelectItem>
              <SelectItem value="total">Total - 24/7 Beziehung</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="communicationStyle">Kommunikationsstil</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Direkt', 'Einfühlsam', 'Streng', 'Spielerisch',
              'Formell', 'Informell', 'Häufig', 'Nach Bedarf'
            ].map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`comm-${style}`}
                  checked={formData.communicationStyles?.includes(style) || false}
                  onCheckedChange={(checked) => {
                    const styles = formData.communicationStyles || [];
                    if (checked) {
                      updateFormData({ communicationStyles: [...styles, style] });
                    } else {
                      updateFormData({ communicationStyles: styles.filter((s: string) => s !== style) });
                    }
                  }}
                />
                <Label htmlFor={`comm-${style}`}>{style}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="aftercareNeeds">Aftercare-Präferenzen als Dom</Label>
          <Textarea
            id="aftercareNeeds"
            value={formData.aftercareNeeds || ''}
            onChange={(e) => updateFormData({ aftercareNeeds: e.target.value })}
            placeholder="Wie bieten Sie Aftercare an? Was benötigen Sie selbst nach Sessions?"
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

export const domRegistrationSteps = [
  { component: DomStep1, title: 'Basisdaten & Identität' },
  { component: DomStep2, title: 'Lebenssituation & Verfügbarkeit' },
  { component: DomStep3, title: 'Gesundheit & Grenzen' },
  { component: DomStep4, title: 'BDSM-Erfahrung & Präferenzen' },
  { component: DomStep5, title: 'Beziehungsvorstellungen & Kommunikation' }
];