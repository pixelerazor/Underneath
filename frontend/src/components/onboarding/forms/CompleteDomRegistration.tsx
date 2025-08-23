/**
 * Complete DOM Registration Form
 * 
 * Vollständige DOM-Registrierung mit allen Kategorien aus der bereitgestellten Liste
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import { DomStep1, DomStep2, DomStep3 } from './ComprehensiveDomSteps';
import { DomStep4, DomStep5 } from './DomStepsPartTwo';
import { CommunicationStep, BDSMBasicsStep } from './SharedSteps';
import { DomSpecificStep1, DomSpecificStep2, DomSpecificStep3 } from './DomStepsSpecific';

// Zusätzliche Schritte für vollständige Abdeckung
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

// Lifestyle & Präferenzen + Community & Verifizierung
export const LifestyleCommunityStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Lifestyle & Community</CardTitle>
        <CardDescription>Lifestyle-Faktoren und Community-Integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lifestyle-Faktoren */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Allgemeine Lifestyle-Faktoren</h3>
          
          <div>
            <Label htmlFor="diet">Ernährung</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Omnivore', 'Vegetarisch', 'Vegan', 'Pescetarisch', 'Keto', 'Halal', 'Koscher', 'Glutenfrei', 'Laktosefrei', 'Andere Allergien'].map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${diet}`}
                    checked={formData.dietPreferences?.includes(diet) || false}
                    onCheckedChange={(checked) => {
                      const prefs = formData.dietPreferences || [];
                      if (checked) {
                        updateFormData({ dietPreferences: [...prefs, diet] });
                      } else {
                        updateFormData({ dietPreferences: prefs.filter((p: string) => p !== diet) });
                      }
                    }}
                  />
                  <Label htmlFor={`diet-${diet}`} className="text-sm">{diet}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="substanceUse">Substanzkonsum</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Kein Alkohol', 'Gelegentlich Alkohol', 'Regelmäßig Alkohol', 'Cannabis (legal)', 'Keine Drogen', 'Party-Drogen', 'Keine Substanzen beim BDSM', 'Substanzen OK'].map((substance) => (
                <div key={substance} className="flex items-center space-x-2">
                  <Checkbox
                    id={`substance-${substance}`}
                    checked={formData.substanceUse?.includes(substance) || false}
                    onCheckedChange={(checked) => {
                      const use = formData.substanceUse || [];
                      if (checked) {
                        updateFormData({ substanceUse: [...use, substance] });
                      } else {
                        updateFormData({ substanceUse: use.filter((u: string) => u !== substance) });
                      }
                    }}
                  />
                  <Label htmlFor={`substance-${substance}`} className="text-sm">{substance}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agePreferenceMin">Alters-Minimum</Label>
              <Input
                id="agePreferenceMin"
                type="number"
                min="18"
                max="80"
                value={formData.agePreferenceMin || ''}
                onChange={(e) => updateFormData({ agePreferenceMin: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="agePreferenceMax">Alters-Maximum</Label>
              <Input
                id="agePreferenceMax"
                type="number"
                min="18"
                max="80"
                value={formData.agePreferenceMax || ''}
                onChange={(e) => updateFormData({ agePreferenceMax: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label>Maximale Distanz (km): {formData.distanceLimit || 50}</Label>
            <Slider
              value={[formData.distanceLimit || 50]}
              onValueChange={(value) => updateFormData({ distanceLimit: value[0] })}
              max={500}
              min={5}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Mindest-Zeitinvestment (Stunden/Woche): {formData.timeInvestmentMinimum || 2}</Label>
            <Slider
              value={[formData.timeInvestmentMinimum || 2]}
              onValueChange={(value) => updateFormData({ timeInvestmentMinimum: value[0] })}
              max={40}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        {/* Community-Integration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Community-Integration</h3>
          
          <div>
            <Label htmlFor="communityInvolvement">Community-Involvement</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Munches besuchen', 'Workshops leiten/besuchen', 'Play Parties', 'Online-Communities', 'Mentoring anbieten', 'Mentoring suchen', 'Events organisieren', 'Kein Community-Interesse'].map((involvement) => (
                <div key={involvement} className="flex items-center space-x-2">
                  <Checkbox
                    id={`community-${involvement}`}
                    checked={formData.communityInvolvement?.includes(involvement) || false}
                    onCheckedChange={(checked) => {
                      const involvement_list = formData.communityInvolvement || [];
                      if (checked) {
                        updateFormData({ communityInvolvement: [...involvement_list, involvement] });
                      } else {
                        updateFormData({ communityInvolvement: involvement_list.filter((i: string) => i !== involvement) });
                      }
                    }}
                  />
                  <Label htmlFor={`community-${involvement}`} className="text-sm">{involvement}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="outingLevel">Öffentliches Outing-Level</Label>
            <Select value={formData.outingLevel || ''} onValueChange={(value) => updateFormData({ outingLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Outing-Level wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completely-private">Vollständig privat</SelectItem>
                <SelectItem value="close-friends">Nur enge Freunde</SelectItem>
                <SelectItem value="bdsm-community">BDSM-Community</SelectItem>
                <SelectItem value="selective-social">Selektiv sozial</SelectItem>
                <SelectItem value="open">Offen</SelectItem>
                <SelectItem value="public">Vollständig öffentlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fetLifeProfile">FetLife-Profil oder andere Plattformen</Label>
            <Input
              id="fetLifeProfile"
              value={formData.fetLifeProfile || ''}
              onChange={(e) => updateFormData({ fetLifeProfile: e.target.value })}
              placeholder="FetLife Username oder andere BDSM-Plattformen"
            />
          </div>

          <div>
            <Label htmlFor="skillsToShare">Spezifische Fertigkeiten (zum Teilen)</Label>
            <Textarea
              id="skillsToShare"
              value={formData.skillsToShare || ''}
              onChange={(e) => updateFormData({ skillsToShare: e.target.value })}
              placeholder="z.B. Shibari, Fireplay, Massage, Fotografie..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="literatureKnowledge">Literatur-Kenntnisse</Label>
            <Textarea
              id="literatureKnowledge"
              value={formData.literatureKnowledge || ''}
              onChange={(e) => updateFormData({ literatureKnowledge: e.target.value })}
              placeholder="Welche BDSM-Bücher, Ressourcen oder Autoren kennen Sie?"
              rows={2}
            />
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

// Beziehungsentwicklung
export const RelationshipDevelopmentStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev, isLast }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Beziehungsentwicklung</CardTitle>
        <CardDescription>Entwicklungsmodelle und Zielvorstellungen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="developmentModel">Entwicklungsmodell-Präferenz</Label>
          <RadioGroup 
            value={formData.developmentModel || ''} 
            onValueChange={(value) => updateFormData({ developmentModel: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="staged-model" id="staged-model" />
              <Label htmlFor="staged-model">Stufenmodell - Klare definierte Entwicklungsstufen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organic-development" id="organic-development" />
              <Label htmlFor="organic-development">Organische Entwicklung - Natürlicher Verlauf</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="goal-oriented" id="goal-oriented" />
              <Label htmlFor="goal-oriented">Zielorientiert - Auf bestimmtes Modell hinarbeiten</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible">Flexibel - Je nach Partner und Situation</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="targetRelationship">Zielvorstellung</Label>
          <Select value={formData.targetRelationship || ''} onValueChange={(value) => updateFormData({ targetRelationship: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Ziel wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual-play">Casual Play Partner</SelectItem>
              <SelectItem value="regular-dynamic">Regelmäßige Dynamik</SelectItem>
              <SelectItem value="committed-ds">Committed D/s</SelectItem>
              <SelectItem value="tpe-model-a">TPE/Modell A</SelectItem>
              <SelectItem value="24-7-lifestyle">24/7 Lifestyle</SelectItem>
              <SelectItem value="poly-network">Poly-Netzwerk</SelectItem>
              <SelectItem value="undecided">Noch unentschieden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="developmentSpeed">Entwicklungsgeschwindigkeit</Label>
          <RadioGroup 
            value={formData.developmentSpeed || ''} 
            onValueChange={(value) => updateFormData({ developmentSpeed: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-slow" id="very-slow" />
              <Label htmlFor="very-slow">Sehr langsam - Jahre für tiefe Verbindung</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="slow" id="slow" />
              <Label htmlFor="slow">Langsam - Monate für Vertiefung</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Moderat - Wochen bis Monate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fast" id="fast" />
              <Label htmlFor="fast">Schnell - Wochen für Intensivierung</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-fast" id="very-fast" />
              <Label htmlFor="very-fast">Sehr schnell - Tage bis Wochen</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="reflectionRhythm">Reflexionsrhythmus</Label>
          <Select value={formData.reflectionRhythm || ''} onValueChange={(value) => updateFormData({ reflectionRhythm: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Rhythmus wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Täglich</SelectItem>
              <SelectItem value="weekly">Wöchentlich</SelectItem>
              <SelectItem value="bi-weekly">Alle zwei Wochen</SelectItem>
              <SelectItem value="monthly">Monatlich</SelectItem>
              <SelectItem value="quarterly">Quartalsweise</SelectItem>
              <SelectItem value="as-needed">Bei Bedarf</SelectItem>
              <SelectItem value="rarely">Selten</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentationDepth">Dokumentationstiefe für Reflexion</Label>
          <RadioGroup 
            value={formData.documentationDepth || ''} 
            onValueChange={(value) => updateFormData({ documentationDepth: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="minimal" />
              <Label htmlFor="minimal">Minimal - Nur wichtige Meilensteine</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate-doc" />
              <Label htmlFor="moderate-doc">Moderat - Regelmäßige Notizen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed">Detailliert - Ausführliche Dokumentation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comprehensive" id="comprehensive" />
              <Label htmlFor="comprehensive">Umfassend - Vollständige Protokollierung</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="relationshipGoals">Langfristige Beziehungsziele</Label>
          <Textarea
            id="relationshipGoals"
            value={formData.relationshipGoals || ''}
            onChange={(e) => updateFormData({ relationshipGoals: e.target.value })}
            placeholder="Was möchten Sie langfristig in einer D/s-Beziehung erreichen?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="additionalNotes">Zusätzliche Informationen</Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes || ''}
            onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
            placeholder="Weitere wichtige Informationen, die Sie teilen möchten..."
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

// Vollständige DOM-Registrierung mit allen Schritten
export const completeDomRegistrationSteps = [
  { component: DomStep1, title: 'Basisdaten & Identität' },
  { component: DomStep2, title: 'Lebenssituation & Verfügbarkeit' },
  { component: DomStep3, title: 'Gesundheit' },
  { component: DomStep4, title: 'Beziehungsstatus & Historie' },
  { component: DomStep5, title: 'Persönlichkeit & Psychologie' },
  { component: CommunicationStep, title: 'Kommunikation & Dokumentation' },
  { component: BDSMBasicsStep, title: 'BDSM-Grundlagen & Sicherheit' },
  { component: LifestyleCommunityStep, title: 'Lifestyle & Community' },
  { component: DomSpecificStep1, title: 'Führung & Dominanz' },
  { component: DomSpecificStep2, title: 'Verantwortung & Kontrolle' },
  { component: DomSpecificStep3, title: 'Sadismus, Macht & Sexuelle Dominanz' },
  { component: RelationshipDevelopmentStep, title: 'Beziehungsentwicklung' }
];