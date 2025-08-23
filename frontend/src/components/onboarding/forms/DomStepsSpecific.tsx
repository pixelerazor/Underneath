/**
 * DOM-Specific Registration Steps
 * DOM-spezifische Felder: Führung, Verantwortung, Sadismus, Beziehungsgestaltung
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

// DOM-Specific Step 1: Führung & Dominanz
export const DomSpecificStep1: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Führung & Dominanz</CardTitle>
        <CardDescription>Ihr Führungsstil und Dominanz-Ausprägung</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="dominanceAuthenticity">Dominanz-Authentizität</Label>
          <RadioGroup 
            value={formData.dominanceAuthenticity || ''} 
            onValueChange={(value) => updateFormData({ dominanceAuthenticity: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spontaneous-situational" id="spont-sit" />
              <Label htmlFor="spont-sit">Spontan-situativ - Reagiere intuitiv auf Situationen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structured-planned" id="struct-plan" />
              <Label htmlFor="struct-plan">Strukturiert-planvoll - Durchdachte Führungsansätze</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced">Ausgewogen - Je nach Situation</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Rollensicherheit & Führungserfahrung: {formData.roleConfidence || 5}/10</Label>
          <Slider
            value={[formData.roleConfidence || 5]}
            onValueChange={(value) => updateFormData({ roleConfidence: value[0] })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="leadershipStyle">Führungsstil</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Mikromanagement - Detaillierte Kontrolle', 
              'Rahmenführung - Vorgabe von Zielen/Grenzen',
              'Delegativ - Eigenverantwortung fördern',
              'Kooperativ - Gemeinsame Entscheidungen',
              'Autoritär - Klare Hierarchie',
              'Transformational - Inspiration und Vision'
            ].map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`leadership-${style}`}
                  checked={formData.leadershipStyles?.includes(style) || false}
                  onCheckedChange={(checked) => {
                    const styles = formData.leadershipStyles || [];
                    if (checked) {
                      updateFormData({ leadershipStyles: [...styles, style] });
                    } else {
                      updateFormData({ leadershipStyles: styles.filter((s: string) => s !== style) });
                    }
                  }}
                />
                <Label htmlFor={`leadership-${style}`} className="text-sm">{style}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Regelaffinität: {formData.ruleAffinity || 5}/10</Label>
            <Slider
              value={[formData.ruleAffinity || 5]}
              onValueChange={(value) => updateFormData({ ruleAffinity: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Konsequenz-Kapazität: {formData.consequenceCapacity || 5}/10</Label>
            <Slider
              value={[formData.consequenceCapacity || 5]}
              onValueChange={(value) => updateFormData({ consequenceCapacity: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Planungsaffinität: {formData.planningAffinity || 5}/10</Label>
            <Slider
              value={[formData.planningAffinity || 5]}
              onValueChange={(value) => updateFormData({ planningAffinity: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Ritualtreue: {formData.ritualFaithfulness || 5}/10</Label>
            <Slider
              value={[formData.ritualFaithfulness || 5]}
              onValueChange={(value) => updateFormData({ ritualFaithfulness: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dominanceStyles">Dominanz-Stile</Label>
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
                <Label htmlFor={`dom-style-${style}`} className="text-sm">{style}</Label>
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

// DOM-Specific Step 2: Verantwortung & Kontrolle
export const DomSpecificStep2: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Verantwortung & Kontrolle</CardTitle>
        <CardDescription>Bereitschaft zur Verantwortungsübernahme und Kontrolle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="responsibilityReadiness">Verantwortungsbereitschaft</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Emotional - Für emotionales Wohlbefinden', 
              'Finanziell - Finanzielle Unterstützung/Kontrolle',
              'Gesundheitlich - Gesundheitsverantwortung',
              'Sozial - Soziale Kontakte/Beziehungen',
              'Beruflich - Karriereentscheidungen',
              'Alltäglich - Tagesstrukturen'
            ].map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={`responsibility-${area}`}
                  checked={formData.responsibilityAreas?.includes(area) || false}
                  onCheckedChange={(checked) => {
                    const areas = formData.responsibilityAreas || [];
                    if (checked) {
                      updateFormData({ responsibilityAreas: [...areas, area] });
                    } else {
                      updateFormData({ responsibilityAreas: areas.filter((a: string) => a !== area) });
                    }
                  }}
                />
                <Label htmlFor={`responsibility-${area}`} className="text-sm">{area}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Präsenzkontinuität: {formData.presenceContinuity || 5}/10</Label>
            <Slider
              value={[formData.presenceContinuity || 5]}
              onValueChange={(value) => updateFormData({ presenceContinuity: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Emotionale Verfügbarkeit: {formData.emotionalAvailability || 5}/10</Label>
            <Slider
              value={[formData.emotionalAvailability || 5]}
              onValueChange={(value) => updateFormData({ emotionalAvailability: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="structureNeed">Struktur- vs. Spontaneitätsbedürfnis als Dom</Label>
          <RadioGroup 
            value={formData.structureNeedAsDom || ''} 
            onValueChange={(value) => updateFormData({ structureNeedAsDom: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high-structure" id="high-structure" />
              <Label htmlFor="high-structure">Brauche viel Struktur und Vorhersehbarkeit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate-structure" id="moderate-structure" />
              <Label htmlFor="moderate-structure">Moderate Struktur mit Raum für Spontanität</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible">Flexibel - passe mich an</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spontaneous" id="spontaneous" />
              <Label htmlFor="spontaneous">Bevorzuge Spontanität und Flexibilität</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Flexibilitätsbedarf in der Führung: {formData.leadershipFlexibility || 5}/10</Label>
          <Slider
            value={[formData.leadershipFlexibility || 5]}
            onValueChange={(value) => updateFormData({ leadershipFlexibility: value[0] })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="controlPreferences">Kontrollpräferenzen</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              'Mikrokontrolle - Details kontrollieren',
              'Makrokontrolle - Große Linien vorgeben', 
              'Zeitkontrolle - Tagesabläufe strukturieren',
              'Entscheidungskontrolle - Wichtige Entscheidungen',
              'Verhaltenskontrolle - Verhalten modifizieren',
              'Gedankenkontrolle - Denkweisen beeinflussen'
            ].map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={`control-${pref}`}
                  checked={formData.controlPreferences?.includes(pref) || false}
                  onCheckedChange={(checked) => {
                    const prefs = formData.controlPreferences || [];
                    if (checked) {
                      updateFormData({ controlPreferences: [...prefs, pref] });
                    } else {
                      updateFormData({ controlPreferences: prefs.filter((p: string) => p !== pref) });
                    }
                  }}
                />
                <Label htmlFor={`control-${pref}`} className="text-sm">{pref}</Label>
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

// DOM-Specific Step 3: Sadismus & Macht & Sexuelle Dominanz
export const DomSpecificStep3: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev, isLast }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sadismus, Macht & Sexuelle Dominanz</CardTitle>
        <CardDescription>Sadistische Neigungen und sexuelle Dominanzpräferenzen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sadismus & Macht */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sadismus & Macht</h3>
          
          <div>
            <Label>Sadismus-Intensität: {formData.sadismIntensity || 0}/10</Label>
            <Slider
              value={[formData.sadismIntensity || 0]}
              onValueChange={(value) => updateFormData({ sadismIntensity: value[0] })}
              max={10}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="sadismTypes">Bevorzugte Sadismus-Formen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                'Emotional - Emotionale Dominanz/Demütigung',
                'Körperlich - Schmerz und Impact Play', 
                'Mental - Psychologische Kontrolle',
                'Sensual - Sinnliche Qualen/Teasing',
                'Degradation - Erniedrigung',
                'Service - Durch Dienst quälen'
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sadism-${type}`}
                    checked={formData.sadismTypes?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      const types = formData.sadismTypes || [];
                      if (checked) {
                        updateFormData({ sadismTypes: [...types, type] });
                      } else {
                        updateFormData({ sadismTypes: types.filter((t: string) => t !== type) });
                      }
                    }}
                  />
                  <Label htmlFor={`sadism-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Aftercare-Kompetenz: {formData.aftercareCompetence || 5}/10</Label>
            <Slider
              value={[formData.aftercareCompetence || 5]}
              onValueChange={(value) => updateFormData({ aftercareCompetence: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        {/* Sexuelle Dominanz */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sexuelle Dominanz</h3>
          
          <div>
            <Label htmlFor="initiativeExpectation">Initiativ-Erwartung an Sub</Label>
            <RadioGroup 
              value={formData.initiativeExpectation || ''} 
              onValueChange={(value) => updateFormData({ initiativeExpectation: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-initiative" id="no-initiative" />
                <Label htmlFor="no-initiative">Sub soll keine Initiative zeigen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited-initiative" id="limited-initiative" />
                <Label htmlFor="limited-initiative">Begrenzte Initiative erwünscht</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="encouraged-initiative" id="encouraged-initiative" />
                <Label htmlFor="encouraged-initiative">Initiative wird ermutigt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="required-initiative" id="required-initiative" />
                <Label htmlFor="required-initiative">Initiative ist erforderlich</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Orgasmuskontrolle-Interesse: {formData.orgasmControlInterest || 0}/10</Label>
            <Slider
              value={[formData.orgasmControlInterest || 0]}
              onValueChange={(value) => updateFormData({ orgasmControlInterest: value[0] })}
              max={10}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="physicalExclusivity">Körperliche Exklusivitätsansprüche</Label>
            <RadioGroup 
              value={formData.physicalExclusivity || ''} 
              onValueChange={(value) => updateFormData({ physicalExclusivity: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complete-exclusivity" id="complete-exclusivity" />
                <Label htmlFor="complete-exclusivity">Vollständige körperliche Exklusivität</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sexual-exclusivity" id="sexual-exclusivity" />
                <Label htmlFor="sexual-exclusivity">Nur sexuelle Exklusivität</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bdsm-exclusivity" id="bdsm-exclusivity" />
                <Label htmlFor="bdsm-exclusivity">BDSM-Exklusivität</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-exclusivity" id="no-exclusivity" />
                <Label htmlFor="no-exclusivity">Keine Exklusivitätsansprüche</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Findom-Interesse: {formData.findomInterest || 0}/10</Label>
            <Slider
              value={[formData.findomInterest || 0]}
              onValueChange={(value) => updateFormData({ findomInterest: value[0] })}
              max={10}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        {/* Beziehungsgestaltung */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Beziehungsgestaltung</h3>
          
          <div>
            <Label>Bindungsfähigkeit als Dom: {formData.bondingAbility || 5}/10</Label>
            <Slider
              value={[formData.bondingAbility || 5]}
              onValueChange={(value) => updateFormData({ bondingAbility: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nähetoleranz: {formData.intimacyTolerance || 5}/10</Label>
              <Slider
                value={[formData.intimacyTolerance || 5]}
                onValueChange={(value) => updateFormData({ intimacyTolerance: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Rückzugsbedürfnis: {formData.withdrawalNeed || 5}/10</Label>
              <Slider
                value={[formData.withdrawalNeed || 5]}
                onValueChange={(value) => updateFormData({ withdrawalNeed: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subNeedsHandling">Umgang mit Sub-Bedürfnissen</Label>
            <Textarea
              id="subNeedsHandling"
              value={formData.subNeedsHandling || ''}
              onChange={(e) => updateFormData({ subNeedsHandling: e.target.value })}
              placeholder="Wie gehen Sie mit den emotionalen und physischen Bedürfnissen Ihres Subs um?"
              rows={3}
            />
          </div>

          <div>
            <Label>Krisenmanagement-Fähigkeiten: {formData.crisisManagement || 5}/10</Label>
            <Slider
              value={[formData.crisisManagement || 5]}
              onValueChange={(value) => updateFormData({ crisisManagement: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
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

export const domSpecificSteps = [
  { component: DomSpecificStep1, title: 'Führung & Dominanz' },
  { component: DomSpecificStep2, title: 'Verantwortung & Kontrolle' },
  { component: DomSpecificStep3, title: 'Sadismus, Macht & Sexuelle Dominanz' }
];