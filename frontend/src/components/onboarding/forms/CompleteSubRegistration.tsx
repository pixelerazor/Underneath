/**
 * Complete SUB Registration Form
 * 
 * Vollständige SUB-Registrierung mit allen Kategorien und SUB-spezifischen Feldern
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

// Import shared steps
import { CommunicationStep, BDSMBasicsStep } from './SharedSteps';
import { LifestyleCommunityStep, RelationshipDevelopmentStep } from './CompleteDomRegistration';

// Import basic steps adapted for SUB
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

// Step 1: Basisdaten & Identität (gleich wie DOM)
export const SubStep1: React.FC<StepProps> = ({ formData, updateFormData, onNext, isFirst }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Basisdaten & Identität</CardTitle>
        <CardDescription>Persönliche Informationen und Identität</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gleicher Inhalt wie DomStep1 */}
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

// Step 2: SUB-spezifische Hingabe & Submission
export const SubStep2: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Hingabe & Submission</CardTitle>
        <CardDescription>Ihre Motivationsstruktur und Submission-Bedürfnisse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="motivationStructure">Motivationsstruktur</Label>
          <RadioGroup 
            value={formData.motivationStructure || ''} 
            onValueChange={(value) => updateFormData({ motivationStructure: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intrinsic" id="intrinsic" />
              <Label htmlFor="intrinsic">Intrinsisch - Innere Motivation, Eigenantrieb</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="extrinsic" id="extrinsic" />
              <Label htmlFor="extrinsic">Extrinsisch - Externe Belohnungen/Konsequenzen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed" id="mixed" />
              <Label htmlFor="mixed">Gemischt - Beides wichtig</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reward-sensitive" id="reward-sensitive" />
              <Label htmlFor="reward-sensitive">Stark belohnungssensitiv</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="structureVsSpontaneity">Struktur- vs. Spontaneitätsbedürfnis</Label>
          <RadioGroup 
            value={formData.structureVsSpontaneity || ''} 
            onValueChange={(value) => updateFormData({ structureVsSpontaneity: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high-structure" id="high-structure-sub" />
              <Label htmlFor="high-structure-sub">Brauche viel Struktur und Routine</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate-structure" id="moderate-structure-sub" />
              <Label htmlFor="moderate-structure-sub">Moderate Struktur mit Freiräumen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible-sub" />
              <Label htmlFor="flexible-sub">Flexibel - passe mich an</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spontaneous" id="spontaneous-sub" />
              <Label htmlFor="spontaneous-sub">Bevorzuge Spontanität</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Bedürfnis nach emotionaler Kontinuität: {formData.emotionalContinuityNeed || 5}/10</Label>
          <Slider
            value={[formData.emotionalContinuityNeed || 5]}
            onValueChange={(value) => updateFormData({ emotionalContinuityNeed: value[0] })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
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
          <Label htmlFor="submissionStyles">Sub-Stile</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Bratty - Herausfordernd/frech', 'Gehorsam - Folgsam und dienend', 'Service-orientiert - Dienst im Fokus', 'Little/Middle - Regression',
              'Pet/Puppy - Tier-Roleplay', 'Slave - Vollständige Hingabe', 'Masochistisch - Schmerz-liebend', 'Sensual - Sinnlich/zärtlich',
              'Rope Bunny - Bondage-fokussiert', 'Good Girl/Boy - Praise-orientiert', 'Princess/Prince - Verwöhnt werden', 'Experimental - Erforschend'
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
                <Label htmlFor={`sub-style-${style}`} className="text-sm">{style}</Label>
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

// Step 3: Regression & Rollenspiel
export const SubStep3: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Regression & Rollenspiel</CardTitle>
        <CardDescription>Regression und rollenspiel-spezifische Präferenzen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Regressionsfähigkeit & -bedürfnis: {formData.regressionCapacity || 0}/10</Label>
          <Slider
            value={[formData.regressionCapacity || 0]}
            onValueChange={(value) => updateFormData({ regressionCapacity: value[0] })}
            max={10}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="regressionDepth">Regressionstiefe</Label>
          <Select value={formData.regressionDepth || ''} onValueChange={(value) => updateFormData({ regressionDepth: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Tiefe wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Keine Regression</SelectItem>
              <SelectItem value="light">Leichte Regression - Spielerisch</SelectItem>
              <SelectItem value="moderate">Moderate Regression - Teilweise Headspace</SelectItem>
              <SelectItem value="deep">Tiefe Regression - Vollständiger Headspace</SelectItem>
              <SelectItem value="variable">Variabel je nach Situation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="regressionTriggers">Regressionsauslöser</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Stress/Überforderung', 'Müdigkeit', 'Emotionale Momente', 'Bestimmte Aktivitäten', 'Dom-Aufmerksamkeit', 'Rituale', 'Umgebung/Setting', 'Spontan/natürlich'].map((trigger) => (
              <div key={trigger} className="flex items-center space-x-2">
                <Checkbox
                  id={`trigger-${trigger}`}
                  checked={formData.regressionTriggers?.includes(trigger) || false}
                  onCheckedChange={(checked) => {
                    const triggers = formData.regressionTriggers || [];
                    if (checked) {
                      updateFormData({ regressionTriggers: [...triggers, trigger] });
                    } else {
                      updateFormData({ regressionTriggers: triggers.filter((t: string) => t !== trigger) });
                    }
                  }}
                />
                <Label htmlFor={`trigger-${trigger}`} className="text-sm">{trigger}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="preferredRoles">Bevorzugte Rollen</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Little (Kind)', 'Middle (Teenager)', 'Adult Baby', 'Pet/Kitten', 'Puppy', 'Pony', 'Doll/Toy', 'Princess/Prince', 'Student', 'Andere Rollen'].map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={formData.preferredRoles?.includes(role) || false}
                  onCheckedChange={(checked) => {
                    const roles = formData.preferredRoles || [];
                    if (checked) {
                      updateFormData({ preferredRoles: [...roles, role] });
                    } else {
                      updateFormData({ preferredRoles: roles.filter((r: string) => r !== role) });
                    }
                  }}
                />
                <Label htmlFor={`role-${role}`} className="text-sm">{role}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="aftercareRegression">Aftercare-Bedarf bei Regression</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Kuscheln', 'Warme Decke', 'Snacks/Getränke', 'Beruhigende Stimme', 'Stille Zeit', 'Spielzeug/Comforter', 'Sanfte Musik', 'Langsame Rückführung'].map((need) => (
              <div key={need} className="flex items-center space-x-2">
                <Checkbox
                  id={`aftercare-reg-${need}`}
                  checked={formData.aftercareRegression?.includes(need) || false}
                  onCheckedChange={(checked) => {
                    const needs = formData.aftercareRegression || [];
                    if (checked) {
                      updateFormData({ aftercareRegression: [...needs, need] });
                    } else {
                      updateFormData({ aftercareRegression: needs.filter((n: string) => n !== need) });
                    }
                  }}
                />
                <Label htmlFor={`aftercare-reg-${need}`} className="text-sm">{need}</Label>
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

// Step 4: Körper & Sexualität
export const SubStep4: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Körper & Sexualität</CardTitle>
        <CardDescription>Körperliche Aspekte und sexuelle Präferenzen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="bodyModifications">Körperliche Modifikationen</Label>
          <Textarea
            id="bodyModifications"
            value={formData.bodyModifications || ''}
            onChange={(e) => updateFormData({ bodyModifications: e.target.value })}
            placeholder="Piercings, Tattoos, Narben, etc..."
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="bodyInsecurities">Körperliche Besonderheiten & Schamthemen</Label>
          <Textarea
            id="bodyInsecurities"
            value={formData.bodyInsecurities || ''}
            onChange={(e) => updateFormData({ bodyInsecurities: e.target.value })}
            placeholder="Bereiche, die besondere Aufmerksamkeit oder Sensibilität benötigen..."
            rows={2}
          />
        </div>

        <div>
          <Label>Körperselbstbild: {formData.bodySelfImage || 5}/10</Label>
          <Slider
            value={[formData.bodySelfImage || 5]}
            onValueChange={(value) => updateFormData({ bodySelfImage: value[0] })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="chastityExperience">Keuschheitserfahrung & -präferenz</Label>
          <RadioGroup 
            value={formData.chastityExperience || ''} 
            onValueChange={(value) => updateFormData({ chastityExperience: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-experience" id="no-chastity" />
              <Label htmlFor="no-chastity">Keine Erfahrung, nicht interessiert</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="curious" id="chastity-curious" />
              <Label htmlFor="chastity-curious">Neugierig, möchte ausprobieren</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="some-experience" id="chastity-some" />
              <Label htmlFor="chastity-some">Einige Erfahrung</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="experienced" id="chastity-exp" />
              <Label htmlFor="chastity-exp">Erfahren und interessiert</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lifestyle" id="chastity-lifestyle" />
              <Label htmlFor="chastity-lifestyle">Teil meines Lifestyles</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Orgasmuskontrolle-Präferenz: {formData.orgasmControlPreference || 5}/10</Label>
          <Slider
            value={[formData.orgasmControlPreference || 5]}
            onValueChange={(value) => updateFormData({ orgasmControlPreference: value[0] })}
            max={10}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="sexualExclusivity">Sexuelle Exklusivitätswünsche</Label>
          <RadioGroup 
            value={formData.sexualExclusivity || ''} 
            onValueChange={(value) => updateFormData({ sexualExclusivity: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="complete-exclusivity" id="complete-exclusivity-sub" />
              <Label htmlFor="complete-exclusivity-sub">Vollständige Exklusivität erwünscht</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bdsm-exclusivity" id="bdsm-exclusivity-sub" />
              <Label htmlFor="bdsm-exclusivity-sub">BDSM-Exklusivität wichtig</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible-exclusivity" />
              <Label htmlFor="flexible-exclusivity">Flexibel nach Absprache</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="open" id="open-relationship-sub" />
              <Label htmlFor="open-relationship-sub">Offene Beziehung OK</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Schmerztoleranz (allgemein): {formData.painToleranceGeneral || 5}/10</Label>
          <Slider
            value={[formData.painToleranceGeneral || 5]}
            onValueChange={(value) => updateFormData({ painToleranceGeneral: value[0] })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Impact Play Toleranz: {formData.impactPlayTolerance || 5}/10</Label>
          <Slider
            value={[formData.impactPlayTolerance || 5]}
            onValueChange={(value) => updateFormData({ impactPlayTolerance: value[0] })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
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

// Step 5: Psychologische Vulnerabilität & Dom-Suche
export const SubStep5: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev, isLast }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Psychologie & Dom-Suche</CardTitle>
        <CardDescription>Psychologische Aspekte und gewünschter Dom-Typ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Psychologische Vulnerabilität */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Psychologische Vulnerabilität</h3>
          
          <div>
            <Label htmlFor="biographicalInfluences">Biografische Prägungen & Trigger</Label>
            <Textarea
              id="biographicalInfluences"
              value={formData.biographicalInfluences || ''}
              onChange={(e) => updateFormData({ biographicalInfluences: e.target.value })}
              placeholder="Wichtige Lebenserfahrungen, die Ihre Submission beeinflussen (vertraulich behandelt)..."
              rows={3}
            />
          </div>

          <div>
            <Label>Vertrauensfähigkeit: {formData.trustAbility || 5}/10</Label>
            <Slider
              value={[formData.trustAbility || 5]}
              onValueChange={(value) => updateFormData({ trustAbility: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="protectionMechanisms">Schutzmechanismen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Stolz', 'Misstrauen', 'Ehre/Würde', 'Kontrolle behalten', 'Emotional distanziert', 'Sarkasmus/Humor', 'Rückzug', 'Aggression'].map((mechanism) => (
                <div key={mechanism} className="flex items-center space-x-2">
                  <Checkbox
                    id={`protection-${mechanism}`}
                    checked={formData.protectionMechanisms?.includes(mechanism) || false}
                    onCheckedChange={(checked) => {
                      const mechanisms = formData.protectionMechanisms || [];
                      if (checked) {
                        updateFormData({ protectionMechanisms: [...mechanisms, mechanism] });
                      } else {
                        updateFormData({ protectionMechanisms: mechanisms.filter((m: string) => m !== mechanism) });
                      }
                    }}
                  />
                  <Label htmlFor={`protection-${mechanism}`} className="text-sm">{mechanism}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="switchPotential">Switch-Potential</Label>
            <RadioGroup 
              value={formData.switchPotential || ''} 
              onValueChange={(value) => updateFormData({ switchPotential: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-switch" id="no-switch" />
                <Label htmlFor="no-switch">Kein Switch-Interesse</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="curious" id="switch-curious" />
                <Label htmlFor="switch-curious">Neugierig auf Switch-Rolle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasional" id="switch-occasional" />
                <Label htmlFor="switch-occasional">Gelegentlich Switch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="versatile" id="switch-versatile" />
                <Label htmlFor="switch-versatile">Vielseitig/Verse</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Gesuchter Dom-Typ */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Gesuchter Dom-Typ</h3>
          
          <div>
            <Label htmlFor="desiredDomTypes">Gewünschte Dom-Eigenschaften</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                'Streng/Strict', 'Fürsorgend/Caring', 'Spielerisch/Playful', 'Sadistisch/Sadistic',
                'Daddy/Mommy', 'Master/Mistress', 'Owner', 'Trainer',
                'Erfahren', 'Geduldig', 'Experimentierfreudig', 'Verständnisvoll',
                'Psychologisch versiert', 'Körperlich dominant', 'Emotional intelligent', 'Konsistent'
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desired-dom-${type}`}
                    checked={formData.desiredDomTypes?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      const types = formData.desiredDomTypes || [];
                      if (checked) {
                        updateFormData({ desiredDomTypes: [...types, type] });
                      } else {
                        updateFormData({ desiredDomTypes: types.filter((t: string) => t !== type) });
                      }
                    }}
                  />
                  <Label htmlFor={`desired-dom-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="relationshipGoalsSub">Beziehungsziele als Sub</Label>
            <Textarea
              id="relationshipGoalsSub"
              value={formData.relationshipGoalsSub || ''}
              onChange={(e) => updateFormData({ relationshipGoalsSub: e.target.value })}
              placeholder="Was möchten Sie in einer D/s-Beziehung erreichen? Welche Entwicklung wünschen Sie sich?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="learningGoals">Lernziele & Entwicklungswünsche</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                'Selbstvertrauen aufbauen', 'Grenzen erkunden', 'Kontrolle abgeben lernen', 'Neue Erfahrungen sammeln',
                'Vertrauen aufbauen', 'Kommunikation verbessern', 'Fantasien ausleben', 'Stress abbauen',
                'Disziplin entwickeln', 'Service-Fähigkeiten', 'Spirituelle Verbindung', 'Persönlichkeitsentwicklung'
              ].map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`learning-goal-${goal}`}
                    checked={formData.learningGoals?.includes(goal) || false}
                    onCheckedChange={(checked) => {
                      const goals = formData.learningGoals || [];
                      if (checked) {
                        updateFormData({ learningGoals: [...goals, goal] });
                      } else {
                        updateFormData({ learningGoals: goals.filter((g: string) => g !== goal) });
                      }
                    }}
                  />
                  <Label htmlFor={`learning-goal-${goal}`} className="text-sm">{goal}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="motivatingRewards">Motivierende Belohnungen</Label>
            <Textarea
              id="motivatingRewards"
              value={formData.motivatingRewards || ''}
              onChange={(e) => updateFormData({ motivatingRewards: e.target.value })}
              placeholder="Welche Arten von Belohnungen motivieren Sie am meisten?"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Zurück</Button>
          <Button onClick={onNext}>{isLast ? 'Profil abschließen' : 'Weiter'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Vollständige SUB-Registrierung mit allen Schritten (inklusive shared steps)
export const completeSubRegistrationSteps = [
  { component: SubStep1, title: 'Basisdaten & Identität' },
  { component: SubStep2, title: 'Hingabe & Submission' },
  { component: SubStep3, title: 'Regression & Rollenspiel' },
  { component: SubStep4, title: 'Körper & Sexualität' },
  { component: SubStep5, title: 'Psychologie & Dom-Suche' },
  // Shared steps (gleich wie bei DOM)
  { component: CommunicationStep, title: 'Kommunikation & Dokumentation' },
  { component: BDSMBasicsStep, title: 'BDSM-Grundlagen & Sicherheit' },
  { component: LifestyleCommunityStep, title: 'Lifestyle & Community' },
  { component: RelationshipDevelopmentStep, title: 'Beziehungsentwicklung' }
];