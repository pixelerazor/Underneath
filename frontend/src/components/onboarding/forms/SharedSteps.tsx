/**
 * Shared Steps for both DOM and SUB
 * Kommunikation, BDSM-Grundlagen, Lifestyle, Community, Beziehungsentwicklung
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

// Kommunikation & Dokumentation
export const CommunicationStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Kommunikation & Dokumentation</CardTitle>
        <CardDescription>Kommunikationspräferenzen und digitale Sicherheit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Kommunikationspräferenzen */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Kommunikationspräferenzen</h3>
          
          <div>
            <Label htmlFor="communicationStyle">Kommunikationsstil</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Direkt & ehrlich', 'Diplomatisch & taktfühl', 'Häufig & regelmäßig', 'Nach Bedarf', 'Verbal/mündlich', 'Schriftlich bevorzugt', 'Nonverbal sensibel', 'Strukturiert'].map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={`comm-style-${style}`}
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
                  <Label htmlFor={`comm-style-${style}`} className="text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Reflexionsbedürfnis: {formData.reflectionNeed || 5}/10</Label>
            <Slider
              value={[formData.reflectionNeed || 5]}
              onValueChange={(value) => updateFormData({ reflectionNeed: value[0] })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="preferredChannels">Bevorzugte Kommunikationskanäle</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Text/Chat', 'Sprach-Nachrichten', 'Telefon', 'Video-Calls', 'E-Mail', 'Briefe/Post', 'In Person', 'App-Nachrichten'].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${channel}`}
                    checked={formData.preferredChannels?.includes(channel) || false}
                    onCheckedChange={(checked) => {
                      const channels = formData.preferredChannels || [];
                      if (checked) {
                        updateFormData({ preferredChannels: [...channels, channel] });
                      } else {
                        updateFormData({ preferredChannels: channels.filter((c: string) => c !== channel) });
                      }
                    }}
                  />
                  <Label htmlFor={`channel-${channel}`} className="text-sm">{channel}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="responseTimeExpectations">Response-Zeit-Erwartungen</Label>
            <Select value={formData.responseTimeExpectations || ''} onValueChange={(value) => updateFormData({ responseTimeExpectations: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Response-Zeit wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Sofort (wenige Minuten)</SelectItem>
                <SelectItem value="within-hour">Innerhalb einer Stunde</SelectItem>
                <SelectItem value="same-day">Am selben Tag</SelectItem>
                <SelectItem value="within-24h">Innerhalb 24 Stunden</SelectItem>
                <SelectItem value="flexible">Flexibel</SelectItem>
                <SelectItem value="scheduled">Nur zu vereinbarten Zeiten</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Digitale Präferenzen & Sicherheit */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Digitale Präferenzen & Sicherheit</h3>
          
          <div>
            <Label htmlFor="privacyNeeds">Privatsphäre-Bedürfnisse</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['End-zu-End Verschlüsselung', 'Anonymität wichtig', 'Separate BDSM-Accounts', 'Diskrete Kommunikation', 'Keine Foto-Speicherung', 'Löschbare Nachrichten'].map((need) => (
                <div key={need} className="flex items-center space-x-2">
                  <Checkbox
                    id={`privacy-${need}`}
                    checked={formData.privacyNeeds?.includes(need) || false}
                    onCheckedChange={(checked) => {
                      const needs = formData.privacyNeeds || [];
                      if (checked) {
                        updateFormData({ privacyNeeds: [...needs, need] });
                      } else {
                        updateFormData({ privacyNeeds: needs.filter((n: string) => n !== need) });
                      }
                    }}
                  />
                  <Label htmlFor={`privacy-${need}`} className="text-sm">{need}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="socialMediaLimits">Social Media Präsenz/Grenzen</Label>
            <Textarea
              id="socialMediaLimits"
              value={formData.socialMediaLimits || ''}
              onChange={(e) => updateFormData({ socialMediaLimits: e.target.value })}
              placeholder="Wie möchten Sie in sozialen Medien dargestellt werden? Welche Grenzen gibt es?"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="photoVideoConsent">Foto-/Video-Consent</Label>
            <RadioGroup 
              value={formData.photoVideoConsent || ''} 
              onValueChange={(value) => updateFormData({ photoVideoConsent: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-consent" id="full-consent" />
                <Label htmlFor="full-consent">Vollständige Zustimmung</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited-consent" id="limited-consent" />
                <Label htmlFor="limited-consent">Eingeschränkt nach Absprache</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="face-hidden" id="face-hidden" />
                <Label htmlFor="face-hidden">Nur mit verdecktem Gesicht</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-photos" id="no-photos" />
                <Label htmlFor="no-photos">Keine Fotos/Videos</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="journalingPreference">Journaling-Präferenz</Label>
            <Select value={formData.journalingPreference || ''} onValueChange={(value) => updateFormData({ journalingPreference: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Journaling wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="after-sessions">Nach Sessions</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="when-needed">Bei Bedarf</SelectItem>
                <SelectItem value="shared">Geteiltes Journal</SelectItem>
                <SelectItem value="private">Nur privat</SelectItem>
                <SelectItem value="none">Kein Journal</SelectItem>
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

// BDSM-Grundlagen & Sicherheit
export const BDSMBasicsStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>BDSM-Grundlagen & Sicherheit</CardTitle>
        <CardDescription>Sicherheitsmechanismen, Grenzen und Praktiken</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sicherheitsmechanismen */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sicherheitsmechanismen</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="safewordGreen">Grün (Weiter)</Label>
              <Input
                id="safewordGreen"
                value={formData.safewordGreen || ''}
                onChange={(e) => updateFormData({ safewordGreen: e.target.value })}
                placeholder="z.B. Grün"
              />
            </div>
            <div>
              <Label htmlFor="safewordYellow">Gelb (Langsamer)</Label>
              <Input
                id="safewordYellow"
                value={formData.safewordYellow || ''}
                onChange={(e) => updateFormData({ safewordYellow: e.target.value })}
                placeholder="z.B. Gelb"
              />
            </div>
            <div>
              <Label htmlFor="safewordRed">Rot (Stopp)</Label>
              <Input
                id="safewordRed"
                value={formData.safewordRed || ''}
                onChange={(e) => updateFormData({ safewordRed: e.target.value })}
                placeholder="z.B. Rot"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nonverbalSafewords">Nonverbale Safewords</Label>
            <Input
              id="nonverbalSafewords"
              value={formData.nonverbalSafewords || ''}
              onChange={(e) => updateFormData({ nonverbalSafewords: e.target.value })}
              placeholder="z.B. Handsignale, Gegenstände fallen lassen..."
            />
          </div>

          <div>
            <Label htmlFor="emergencyContact">Notfallkontakte</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact || ''}
              onChange={(e) => updateFormData({ emergencyContact: e.target.value })}
              placeholder="Name und Telefonnummer für Notfälle"
            />
          </div>
        </div>

        {/* Grenzen & Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Grenzen & Limits</h3>
          
          <div>
            <Label htmlFor="hardLimits">Hard Limits (unveränderliche Tabus)</Label>
            <Textarea
              id="hardLimits"
              value={formData.hardLimits || ''}
              onChange={(e) => updateFormData({ hardLimits: e.target.value })}
              placeholder="Aktivitäten, die Sie niemals durchführen möchten..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="softLimits">Soft Limits (verhandelbare Grenzen)</Label>
            <Textarea
              id="softLimits"
              value={formData.softLimits || ''}
              onChange={(e) => updateFormData({ softLimits: e.target.value })}
              placeholder="Aktivitäten, bei denen Sie vorsichtig sein möchten..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="limitEvolution">Limit-Evolution über Zeit</Label>
            <RadioGroup 
              value={formData.limitEvolution || ''} 
              onValueChange={(value) => updateFormData({ limitEvolution: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="limits-fixed" />
                <Label htmlFor="limits-fixed">Meine Limits sind fest und ändern sich nicht</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradual" id="limits-gradual" />
                <Label htmlFor="limits-gradual">Ich erweitere Limits graduell mit Erfahrung</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exploratory" id="limits-exploratory" />
                <Label htmlFor="limits-exploratory">Ich erkunde gerne neue Grenzen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="context-dependent" id="limits-context" />
                <Label htmlFor="limits-context">Abhängig von Partner und Kontext</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="dealBreakers">Deal-Breaker (absolute No-Gos)</Label>
            <Textarea
              id="dealBreakers"
              value={formData.dealBreakers || ''}
              onChange={(e) => updateFormData({ dealBreakers: e.target.value })}
              placeholder="Verhaltensweisen oder Eigenschaften, die für Sie inakzeptabel sind..."
              rows={3}
            />
          </div>
        </div>

        {/* Praktiken & Präferenzen */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Praktiken & Präferenzen</h3>
          
          <div>
            <Label htmlFor="playTypes">Spielarten-Präferenzen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                'Impact Play', 'Bondage/Fesselung', 'Sensation Play', 'Edge Play',
                'Psychological Play', 'Service/Protocol', 'Pet Play', 'Age Play',
                'Role Play', 'Humiliation', 'Worship', 'Orgasm Control'
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`play-${type}`}
                    checked={formData.playTypes?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      const types = formData.playTypes || [];
                      if (checked) {
                        updateFormData({ playTypes: [...types, type] });
                      } else {
                        updateFormData({ playTypes: types.filter((t: string) => t !== type) });
                      }
                    }}
                  />
                  <Label htmlFor={`play-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="intensityPreference">24/7 vs. Session-basiert</Label>
            <RadioGroup 
              value={formData.intensityPreference || ''} 
              onValueChange={(value) => updateFormData({ intensityPreference: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="session-only" id="session-only" />
                <Label htmlFor="session-only">Nur während Sessions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily-elements" id="daily-elements" />
                <Label htmlFor="daily-elements">Tägliche Elemente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial-24-7" id="partial-24-7" />
                <Label htmlFor="partial-24-7">Teilzeit 24/7</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-24-7" id="full-24-7" />
                <Label htmlFor="full-24-7">Vollzeit 24/7</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="protocolLevel">Protokoll-Ebenen</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['High Protocol - Formelle Regeln', 'Low Protocol - Entspannte Regeln', 'Öffentliches Protocol', 'Privates Protocol', 'Situatives Protocol', 'Kein Protocol'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`protocol-${level}`}
                    checked={formData.protocolLevels?.includes(level) || false}
                    onCheckedChange={(checked) => {
                      const levels = formData.protocolLevels || [];
                      if (checked) {
                        updateFormData({ protocolLevels: [...levels, level] });
                      } else {
                        updateFormData({ protocolLevels: levels.filter((l: string) => l !== level) });
                      }
                    }}
                  />
                  <Label htmlFor={`protocol-${level}`} className="text-sm">{level}</Label>
                </div>
              ))}
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