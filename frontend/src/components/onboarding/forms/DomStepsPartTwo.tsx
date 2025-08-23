/**
 * DOM Registration Steps - Part Two
 * Steps 4-7: Beziehungsstatus, Persönlichkeit, Kommunikation, BDSM-Grundlagen
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

// Step 4: Beziehungsstatus & Historie
export const DomStep4: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Beziehungsstatus & Historie</CardTitle>
        <CardDescription>Aktuelle Beziehungen und BDSM-Erfahrungen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aktuelle Beziehungen */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Aktuelle Beziehungen</h3>
          
          <div>
            <Label htmlFor="relationshipStatus">Beziehungsstatus</Label>
            <Select value={formData.relationshipStatus || ''} onValueChange={(value) => updateFormData({ relationshipStatus: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="dating">Dating</SelectItem>
                <SelectItem value="in-relationship">In Beziehung</SelectItem>
                <SelectItem value="married">Verheiratet</SelectItem>
                <SelectItem value="polyamorous">Polyamor</SelectItem>
                <SelectItem value="open-relationship">Offene Beziehung</SelectItem>
                <SelectItem value="complicated">Kompliziert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="primaryRelationships">Primärbeziehungen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Vanilla-Partner ohne BDSM-Wissen', 'Vanilla-Partner mit BDSM-Wissen', 'BDSM-Partner als Switch', 'Andere Dom-Partner', 'Sub-Partner', 'Poly-Netzwerk', 'Keine Primärbeziehung'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`primary-${type}`}
                    checked={formData.primaryRelationships?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      const relationships = formData.primaryRelationships || [];
                      if (checked) {
                        updateFormData({ primaryRelationships: [...relationships, type] });
                      } else {
                        updateFormData({ primaryRelationships: relationships.filter((r: string) => r !== type) });
                      }
                    }}
                  />
                  <Label htmlFor={`primary-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="relationshipOpenness">Offenheit der Beziehung</Label>
            <Select value={formData.relationshipOpenness || ''} onValueChange={(value) => updateFormData({ relationshipOpenness: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Offenheit wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closed">Geschlossen/Monogam</SelectItem>
                <SelectItem value="dadt">Don't Ask Don't Tell</SelectItem>
                <SelectItem value="hierarchical-poly">Hierarchische Polyamorie</SelectItem>
                <SelectItem value="egalitarian-poly">Egalitäre Polyamorie</SelectItem>
                <SelectItem value="relationship-anarchy">Relationship Anarchy</SelectItem>
                <SelectItem value="open-sexual">Sexuell offen</SelectItem>
                <SelectItem value="open-emotional">Emotional offen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="partnerConsent">Partner-Konsent (bei bestehenden Beziehungen)</Label>
            <RadioGroup 
              value={formData.partnerConsent || ''} 
              onValueChange={(value) => updateFormData({ partnerConsent: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-consent" id="full-consent" />
                <Label htmlFor="full-consent">Volle Zustimmung und Unterstützung</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aware-ok" id="aware-ok" />
                <Label htmlFor="aware-ok">Weiß Bescheid und ist okay damit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aware-reluctant" id="aware-reluctant" />
                <Label htmlFor="aware-reluctant">Weiß Bescheid, ist zurückhaltend</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unaware" id="unaware" />
                <Label htmlFor="unaware">Weiß nicht Bescheid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-applicable" id="not-applicable" />
                <Label htmlFor="not-applicable">Nicht anwendbar</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="exclusivityPreference">Exklusivität vs. Offenheit</Label>
            <Select value={formData.exclusivityPreference || ''} onValueChange={(value) => updateFormData({ exclusivityPreference: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Präferenz wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive-only">Nur exklusive Beziehungen</SelectItem>
                <SelectItem value="prefer-exclusive">Bevorzuge Exklusivität</SelectItem>
                <SelectItem value="flexible">Flexibel</SelectItem>
                <SelectItem value="prefer-open">Bevorzuge Offenheit</SelectItem>
                <SelectItem value="open-only">Nur offene Beziehungen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* BDSM-Erfahrung */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">BDSM-Erfahrung</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Jahre in der Szene: {formData.yearsInScene || 0}</Label>
              <Slider
                value={[formData.yearsInScene || 0]}
                onValueChange={(value) => updateFormData({ yearsInScene: value[0] })}
                max={30}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Anzahl vorheriger D/s-Beziehungen: {formData.previousDsRelationships || 0}</Label>
              <Slider
                value={[formData.previousDsRelationships || 0]}
                onValueChange={(value) => updateFormData({ previousDsRelationships: value[0] })}
                max={20}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="longestDsRelationship">Längste D/s-Beziehung</Label>
            <Select value={formData.longestDsRelationship || ''} onValueChange={(value) => updateFormData({ longestDsRelationship: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Dauer wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Noch keine</SelectItem>
                <SelectItem value="weeks">Wenige Wochen</SelectItem>
                <SelectItem value="months">Einige Monate</SelectItem>
                <SelectItem value="6-months">6 Monate</SelectItem>
                <SelectItem value="1-year">1 Jahr</SelectItem>
                <SelectItem value="2-years">2 Jahre</SelectItem>
                <SelectItem value="5-years">5+ Jahre</SelectItem>
                <SelectItem value="10-years">10+ Jahre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="separationReasons">Trennungsgründe (Lernfelder)</Label>
            <Textarea
              id="separationReasons"
              value={formData.separationReasons || ''}
              onChange={(e) => updateFormData({ separationReasons: e.target.value })}
              placeholder="Was haben Sie aus vergangenen Beziehungen gelernt? Häufige Trennungsgründe?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="currentDynamics">Aktuelle andere Dynamics</Label>
            <Input
              id="currentDynamics"
              value={formData.currentDynamics || ''}
              onChange={(e) => updateFormData({ currentDynamics: e.target.value })}
              placeholder="Andere aktuelle BDSM-Beziehungen oder -Dynamics"
            />
          </div>

          <div>
            <Label htmlFor="experienceLevel">Gesamterfahrungslevel</Label>
            <Select value={formData.experienceLevel || ''} onValueChange={(value) => updateFormData({ experienceLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Level wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curious">Neugierig/Interessiert</SelectItem>
                <SelectItem value="beginner">Anfänger (0-2 Jahre)</SelectItem>
                <SelectItem value="intermediate">Fortgeschritten (2-5 Jahre)</SelectItem>
                <SelectItem value="experienced">Erfahren (5-10 Jahre)</SelectItem>
                <SelectItem value="expert">Experte (10+ Jahre)</SelectItem>
                <SelectItem value="master">Master-Level</SelectItem>
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

// Step 5: Persönlichkeit & Psychologie
export const DomStep5: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Persönlichkeit & Psychologie</CardTitle>
        <CardDescription>Persönlichkeitsstruktur und Werte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Persönlichkeitsstruktur */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Persönlichkeitsstruktur</h3>
          
          <div>
            <Label htmlFor="attachmentStyle">Bindungsstil</Label>
            <Select value={formData.attachmentStyle || ''} onValueChange={(value) => updateFormData({ attachmentStyle: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Bindungsstil wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secure">Sicher - Vertraue leicht, fühle mich wohl mit Nähe</SelectItem>
                <SelectItem value="anxious">Ängstlich - Brauche viel Bestätigung, fürchte Verlassenwerden</SelectItem>
                <SelectItem value="avoidant">Vermeidend - Bevorzuge Unabhängigkeit, schwer mit Nähe</SelectItem>
                <SelectItem value="disorganized">Desorganisiert - Wechselnde Muster</SelectItem>
                <SelectItem value="uncertain">Unsicher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mbti">MBTI-Typ (optional)</Label>
              <Input
                id="mbti"
                value={formData.mbti || ''}
                onChange={(e) => updateFormData({ mbti: e.target.value })}
                placeholder="z.B. INTJ, ESFP..."
              />
            </div>
            <div>
              <Label htmlFor="enneagram">Enneagramm-Typ (optional)</Label>
              <Input
                id="enneagram"
                value={formData.enneagram || ''}
                onChange={(e) => updateFormData({ enneagram: e.target.value })}
                placeholder="z.B. Typ 8, 3w2..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="loveLanguages">Love Languages (wichtigste auswählen)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Worte der Bestätigung', 'Qualitätszeit', 'Geschenke', 'Hilfsbereite Handlungen', 'Körperliche Berührung'].map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`love-${language}`}
                    checked={formData.loveLanguages?.includes(language) || false}
                    onCheckedChange={(checked) => {
                      const languages = formData.loveLanguages || [];
                      if (checked) {
                        updateFormData({ loveLanguages: [...languages, language] });
                      } else {
                        updateFormData({ loveLanguages: languages.filter((l: string) => l !== language) });
                      }
                    }}
                  />
                  <Label htmlFor={`love-${language}`} className="text-sm">{language}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="introExtroversion">Introversion/Extraversion</Label>
              <Select value={formData.introExtroversion || ''} onValueChange={(value) => updateFormData({ introExtroversion: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Typ wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-introverted">Sehr introvertiert</SelectItem>
                  <SelectItem value="introverted">Introvertiert</SelectItem>
                  <SelectItem value="balanced">Ausgewogen (Ambivert)</SelectItem>
                  <SelectItem value="extroverted">Extrovertiert</SelectItem>
                  <SelectItem value="very-extroverted">Sehr extrovertiert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stressResponse">Stress-Response-Typ</Label>
              <Select value={formData.stressResponse || ''} onValueChange={(value) => updateFormData({ stressResponse: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Response-Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fight">Fight - Konfrontation</SelectItem>
                  <SelectItem value="flight">Flight - Vermeidung</SelectItem>
                  <SelectItem value="freeze">Freeze - Erstarrung</SelectItem>
                  <SelectItem value="fawn">Fawn - Beschwichtigung</SelectItem>
                  <SelectItem value="mixed">Gemischt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Werte & Überzeugungen */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Werte & Überzeugungen</h3>
          
          <div>
            <Label htmlFor="coreValues">Werte-Hierarchie (wichtigste auswählen)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Authentizität', 'Respekt', 'Autonomie', 'Tiefgang', 'Rationalität', 'Loyalität', 'Ehrlichkeit', 'Kreativität', 'Sicherheit', 'Wachstum', 'Harmonie', 'Gerechtigkeit'].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`value-${value}`}
                    checked={formData.coreValues?.includes(value) || false}
                    onCheckedChange={(checked) => {
                      const values = formData.coreValues || [];
                      if (checked) {
                        updateFormData({ coreValues: [...values, value] });
                      } else {
                        updateFormData({ coreValues: values.filter((v: string) => v !== value) });
                      }
                    }}
                  />
                  <Label htmlFor={`value-${value}`} className="text-sm">{value}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spirituality">Spiritualität/Religion</Label>
              <Select value={formData.spirituality || ''} onValueChange={(value) => updateFormData({ spirituality: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Spiritualität" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atheist">Atheistisch</SelectItem>
                  <SelectItem value="agnostic">Agnostisch</SelectItem>
                  <SelectItem value="spiritual">Spirituell (nicht religiös)</SelectItem>
                  <SelectItem value="christian">Christlich</SelectItem>
                  <SelectItem value="buddhist">Buddhistisch</SelectItem>
                  <SelectItem value="pagan">Heidnisch/Neopagan</SelectItem>
                  <SelectItem value="other">Andere</SelectItem>
                  <SelectItem value="private">Privat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="politicalOrientation">Politische Orientierung</Label>
              <Select value={formData.politicalOrientation || ''} onValueChange={(value) => updateFormData({ politicalOrientation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Orientierung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-liberal">Sehr liberal</SelectItem>
                  <SelectItem value="liberal">Liberal</SelectItem>
                  <SelectItem value="moderate">Moderat</SelectItem>
                  <SelectItem value="conservative">Konservativ</SelectItem>
                  <SelectItem value="very-conservative">Sehr konservativ</SelectItem>
                  <SelectItem value="libertarian">Libertär</SelectItem>
                  <SelectItem value="apolitical">Unpolitisch</SelectItem>
                  <SelectItem value="private">Privat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="education">Bildungshintergrund</Label>
            <Select value={formData.education || ''} onValueChange={(value) => updateFormData({ education: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Bildung wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hauptschule">Hauptschulabschluss</SelectItem>
                <SelectItem value="realschule">Realschulabschluss</SelectItem>
                <SelectItem value="abitur">Abitur/Fachabitur</SelectItem>
                <SelectItem value="ausbildung">Berufsausbildung</SelectItem>
                <SelectItem value="bachelor">Bachelor</SelectItem>
                <SelectItem value="master">Master/Diplom</SelectItem>
                <SelectItem value="phd">Promotion</SelectItem>
                <SelectItem value="other">Andere</SelectItem>
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

export const domStepsPartTwo = [
  { component: DomStep4, title: 'Beziehungsstatus & Historie' },
  { component: DomStep5, title: 'Persönlichkeit & Psychologie' }
];