/**
 * Comprehensive Profile Editor
 * 
 * Vollständige Profil-Bearbeitungskomponente mit allen Registrierungsdaten
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ProfileService } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ProfileData {
  [key: string]: any;
}

export const ComprehensiveProfileEditor: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash.replace('#', '') || 'basic');

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await ProfileService.getProfile();
        if (response.profile?.data) {
          setProfileData(response.profile.data);
        }
      } catch (error: any) {
        console.error('Error loading profile in editor:', error);
        
        // Handle different error types
        if (error.response?.status === 401) {
          console.warn('User not authenticated for profile access');
          // Don't show error for authentication issues - user might need to login
        } else if (error.response?.status === 400) {
          console.warn('Profile request invalid, using empty profile');
          // Profile might not exist yet, that's okay
        } else {
          // Only show toast for actual server errors
          toast.error('Fehler beim Laden des Profils. Versuchen Sie es später erneut.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Listen for location changes (including hash)
  useEffect(() => {
    const newHash = location.hash.replace('#', '') || 'basic';
    console.log('ComprehensiveProfileEditor: Location changed, hash is:', newHash);
    setCurrentHash(newHash);
  }, [location.hash]);

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formattedData = {
        preferredName: profileData.firstName || '',
        data: profileData,
        experienceLevel: profileData.bdsmExperience || profileData.experienceLevel || 'beginner',
        availability: {
          days: profileData.availableDays || [],
          timePreference: profileData.timePreference || 'flexible',
          frequency: profileData.sessionFrequency || 'weekly'
        },
        preferences: {
          communication: profileData.communicationStyles || [],
          activities: profileData.preferredActivities || profileData.interests || [],
          relationshipType: profileData.relationshipType || 'undecided'
        },
        goals: profileData.personalGoals?.join(', ') || profileData.learningInterests || profileData.relationshipGoalsSub || '',
        boundaries: {
          hardLimits: profileData.hardLimits || '',
          softLimits: profileData.softLimits || '',
          healthNotes: profileData.healthNotes || ''
        },
        communication: {
          style: profileData.communicationStyles || [],
          frequency: 'regular',
          channels: profileData.preferredChannels || ['app']
        }
      };

      await ProfileService.updateProfile(formattedData);
      toast.success('Profil erfolgreich aktualisiert');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Fehler beim Speichern des Profils');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isDom = user?.role === 'DOM';
  const isSub = user?.role === 'SUB';
  
  console.log('ComprehensiveProfileEditor rendering with currentHash:', currentHash);
  
  return (
    <div className="space-y-6">

        {/* Basisdaten & Identität */}
        {currentHash === 'basic' && (
          <div id="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Identität</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName || ''}
                    onChange={(e) => updateProfileData({ firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName || ''}
                    onChange={(e) => updateProfileData({ lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Alter</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    value={profileData.age || ''}
                    onChange={(e) => updateProfileData({ age: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="genderIdentity">Geschlechtsidentität</Label>
                  <Select value={profileData.genderIdentity || ''} onValueChange={(value) => updateProfileData({ genderIdentity: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Geschlecht wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agender">Agender</SelectItem>
                      <SelectItem value="agenderflux">Agenderflux</SelectItem>
                      <SelectItem value="androgyn">Androgyn</SelectItem>
                      <SelectItem value="bear">Bear</SelectItem>
                      <SelectItem value="bigender">Bigender</SelectItem>
                      <SelectItem value="boyflux">BoyFlux</SelectItem>
                      <SelectItem value="butch">Butch</SelectItem>
                      <SelectItem value="cis-frau">Cis-Frau</SelectItem>
                      <SelectItem value="cis-mann">Cis-Mann</SelectItem>
                      <SelectItem value="chubby">Chubby</SelectItem>
                      <SelectItem value="demiboy">Demiboy</SelectItem>
                      <SelectItem value="demigirl">Demigirl</SelectItem>
                      <SelectItem value="femme">Femme</SelectItem>
                      <SelectItem value="frau">Frau</SelectItem>
                      <SelectItem value="genderfae">Genderfae</SelectItem>
                      <SelectItem value="genderfaun">Genderfaun</SelectItem>
                      <SelectItem value="genderflor">Genderflor</SelectItem>
                      <SelectItem value="girlflux">GirlFlux</SelectItem>
                      <SelectItem value="genderqueer">Genderqueer</SelectItem>
                      <SelectItem value="intergender">Intergender</SelectItem>
                      <SelectItem value="lesbe">Lesbe</SelectItem>
                      <SelectItem value="libragender">Libragender</SelectItem>
                      <SelectItem value="librafeminin">Librafeminin</SelectItem>
                      <SelectItem value="libraflux">Libraflux</SelectItem>
                      <SelectItem value="libramaskulin">Libramaskulin</SelectItem>
                      <SelectItem value="mann">Mann</SelectItem>
                      <SelectItem value="maxigender">Maxigender</SelectItem>
                      <SelectItem value="monogender">Monogender</SelectItem>
                      <SelectItem value="neurogender">Neurogender</SelectItem>
                      <SelectItem value="neutrois">Neutrois</SelectItem>
                      <SelectItem value="non-binary">Non-Binary</SelectItem>
                      <SelectItem value="omnigender">Omnigender</SelectItem>
                      <SelectItem value="pangender">Pangender</SelectItem>
                      <SelectItem value="polygender">Polygender</SelectItem>
                      <SelectItem value="queer">Queer</SelectItem>
                      <SelectItem value="third-gender">Third Gender</SelectItem>
                      <SelectItem value="tomboy">Tomboy</SelectItem>
                      <SelectItem value="trans-frau">Trans-Frau</SelectItem>
                      <SelectItem value="trans-mann">Trans-Mann</SelectItem>
                      <SelectItem value="trigender">Trigender</SelectItem>
                      <SelectItem value="xenogender">Xenogender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pronouns">Pronomen</Label>
                  <Select value={profileData.pronouns || ''} onValueChange={(value) => updateProfileData({ pronouns: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pronomen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="er">er/ihm</SelectItem>
                      <SelectItem value="sie">sie/ihr</SelectItem>
                      <SelectItem value="they">they/them</SelectItem>
                      <SelectItem value="xier">xier/xiem</SelectItem>
                      <SelectItem value="custom">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sexualOrientation">Sexuelle Orientierung</Label>
                  <Select value={profileData.sexualOrientation || ''} onValueChange={(value) => updateProfileData({ sexualOrientation: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Orientierung" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heterosexual">Heterosexuell</SelectItem>
                      <SelectItem value="homosexual">Homosexuell</SelectItem>
                      <SelectItem value="bisexual">Bisexuell</SelectItem>
                      <SelectItem value="pansexual">Pansexuell</SelectItem>
                      <SelectItem value="demisexual">Demisexuell</SelectItem>
                      <SelectItem value="asexual">Asexuell</SelectItem>
                      <SelectItem value="other">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="romanticOrientation">Romantische Orientierung</Label>
                  <Select value={profileData.romanticOrientation || ''} onValueChange={(value) => updateProfileData({ romanticOrientation: value })}>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Wohnort</Label>
                  <Input
                    id="location"
                    value={profileData.location || ''}
                    onChange={(e) => updateProfileData({ location: e.target.value })}
                    placeholder="Stadt, Region"
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Sprachen</Label>
                  <Input
                    id="languages"
                    value={profileData.languages || ''}
                    onChange={(e) => updateProfileData({ languages: e.target.value })}
                    placeholder="z.B. Deutsch, Englisch"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persönlichkeit & Werte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="attachmentStyle">Bindungsstil</Label>
                <Select value={profileData.attachmentStyle || ''} onValueChange={(value) => updateProfileData({ attachmentStyle: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bindungsstil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secure">Sicher</SelectItem>
                    <SelectItem value="anxious">Ängstlich</SelectItem>
                    <SelectItem value="avoidant">Vermeidend</SelectItem>
                    <SelectItem value="disorganized">Desorganisiert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="coreValues">Wichtigste Werte</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Authentizität', 'Respekt', 'Autonomie', 'Tiefgang', 'Rationalität', 'Loyalität', 'Ehrlichkeit', 'Kreativität', 'Sicherheit'].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`value-${value}`}
                        checked={profileData.coreValues?.includes(value) || false}
                        onCheckedChange={(checked) => {
                          const values = profileData.coreValues || [];
                          if (checked) {
                            updateProfileData({ coreValues: [...values, value] });
                          } else {
                            updateProfileData({ coreValues: values.filter((v: string) => v !== value) });
                          }
                        }}
                      />
                      <Label htmlFor={`value-${value}`} className="text-sm">{value}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Lebenssituation */}
        {currentHash === 'lifestyle' && (
          <div id="lifestyle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lebenssituation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profession">Berufliche Situation</Label>
                  <Select value={profileData.profession || ''} onValueChange={(value) => updateProfileData({ profession: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Beruf" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Vollzeit</SelectItem>
                      <SelectItem value="part-time">Teilzeit</SelectItem>
                      <SelectItem value="freelance">Freiberuflich</SelectItem>
                      <SelectItem value="student">Student/in</SelectItem>
                      <SelectItem value="unemployed">Arbeitssuchend</SelectItem>
                      <SelectItem value="retired">Rentner/in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="livingSituation">Wohnsituation</Label>
                  <Select value={profileData.livingSituation || ''} onValueChange={(value) => updateProfileData({ livingSituation: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wohnsituation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alone">Alleine</SelectItem>
                      <SelectItem value="with-partner">Mit Partner/in</SelectItem>
                      <SelectItem value="with-family">Bei Familie</SelectItem>
                      <SelectItem value="shared-flat">WG</SelectItem>
                      <SelectItem value="other">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Verfügbare Stunden pro Woche: {profileData.availableHours || 5}</Label>
                <Slider
                  value={[profileData.availableHours || 5]}
                  onValueChange={(value) => updateProfileData({ availableHours: value[0] })}
                  max={40}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="availableDays">Verfügbare Tage</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={profileData.availableDays?.includes(day) || false}
                        onCheckedChange={(checked) => {
                          const days = profileData.availableDays || [];
                          if (checked) {
                            updateProfileData({ availableDays: [...days, day] });
                          } else {
                            updateProfileData({ availableDays: days.filter((d: string) => d !== day) });
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day}`} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gesundheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="healthNotes">Gesundheitshinweise</Label>
                <Textarea
                  id="healthNotes"
                  value={profileData.healthNotes || ''}
                  onChange={(e) => updateProfileData({ healthNotes: e.target.value })}
                  placeholder="Relevante Gesundheitsinformationen..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="allergies">Allergien & Unverträglichkeiten</Label>
                <Textarea
                  id="allergies"
                  value={profileData.allergies || ''}
                  onChange={(e) => updateProfileData({ allergies: e.target.value })}
                  placeholder="Allergien, Medikamenteninteraktionen..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* BDSM & Grenzen */}
        {currentHash === 'bdsm' && (
          <div id="bdsm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>BDSM-Erfahrung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experienceLevel">Erfahrungslevel</Label>
                <Select value={profileData.experienceLevel || profileData.bdsmExperience || ''} onValueChange={(value) => updateProfileData({ experienceLevel: value, bdsmExperience: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curious">Neugierig</SelectItem>
                    <SelectItem value="beginner">Anfänger</SelectItem>
                    <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                    <SelectItem value="experienced">Erfahren</SelectItem>
                    <SelectItem value="expert">Experte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Jahre in der Szene: {profileData.yearsInScene || 0}</Label>
                <Slider
                  value={[profileData.yearsInScene || 0]}
                  onValueChange={(value) => updateProfileData({ yearsInScene: value[0] })}
                  max={30}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grenzen & Sicherheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hardLimits">Hard Limits</Label>
                <Textarea
                  id="hardLimits"
                  value={profileData.hardLimits || ''}
                  onChange={(e) => updateProfileData({ hardLimits: e.target.value })}
                  placeholder="Absolute Grenzen..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="softLimits">Soft Limits</Label>
                <Textarea
                  id="softLimits"
                  value={profileData.softLimits || ''}
                  onChange={(e) => updateProfileData({ softLimits: e.target.value })}
                  placeholder="Weiche Grenzen..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="safewordGreen">Grün (Weiter)</Label>
                  <Input
                    id="safewordGreen"
                    value={profileData.safewordGreen || ''}
                    onChange={(e) => updateProfileData({ safewordGreen: e.target.value })}
                    placeholder="z.B. Grün"
                  />
                </div>
                <div>
                  <Label htmlFor="safewordYellow">Gelb (Langsamer)</Label>
                  <Input
                    id="safewordYellow"
                    value={profileData.safewordYellow || ''}
                    onChange={(e) => updateProfileData({ safewordYellow: e.target.value })}
                    placeholder="z.B. Gelb"
                  />
                </div>
                <div>
                  <Label htmlFor="safewordRed">Rot (Stopp)</Label>
                  <Input
                    id="safewordRed"
                    value={profileData.safewordRed || ''}
                    onChange={(e) => updateProfileData({ safewordRed: e.target.value })}
                    placeholder="z.B. Rot"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interessen & Aktivitäten</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="interests">Bevorzugte Aktivitäten</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    'Bondage', 'Impact Play', 'Sensation Play', 'Rope Play', 'Wax Play',
                    'Temperature Play', 'Pet Play', 'Age Play', 'Role Play', 'Humiliation',
                    'Praise', 'Service', 'Protocol', 'Orgasm Control', 'Chastity'
                  ].map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`activity-${activity}`}
                        checked={(profileData.interests || profileData.preferredActivities || []).includes(activity)}
                        onCheckedChange={(checked) => {
                          const activities = profileData.interests || profileData.preferredActivities || [];
                          const newActivities = checked 
                            ? [...activities, activity]
                            : activities.filter((a: string) => a !== activity);
                          updateProfileData({ 
                            interests: newActivities, 
                            preferredActivities: newActivities 
                          });
                        }}
                      />
                      <Label htmlFor={`activity-${activity}`} className="text-sm">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Role-specific content */}
      {currentHash === 'role' && (
        <div id="role" className="space-y-6">
          {isDom && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>DOM-Spezifische Eigenschaften</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dominanceStyles">Dominanz-Stile</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['Streng/Strict', 'Fürsorgend/Caring', 'Spielerisch/Playful', 'Sadistisch/Sadistic', 'Daddy/Mommy', 'Master/Mistress', 'Owner', 'Trainer'].map((style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dom-style-${style}`}
                            checked={profileData.dominanceStyles?.includes(style) || false}
                            onCheckedChange={(checked) => {
                              const styles = profileData.dominanceStyles || [];
                              if (checked) {
                                updateProfileData({ dominanceStyles: [...styles, style] });
                              } else {
                                updateProfileData({ dominanceStyles: styles.filter((s: string) => s !== style) });
                              }
                            }}
                          />
                          <Label htmlFor={`dom-style-${style}`} className="text-sm">{style}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Sadismus-Intensität: {profileData.sadismIntensity || 0}/10</Label>
                    <Slider
                      value={[profileData.sadismIntensity || 0]}
                      onValueChange={(value) => updateProfileData({ sadismIntensity: value[0] })}
                      max={10}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Aftercare-Kompetenz: {profileData.aftercareCompetence || 5}/10</Label>
                    <Slider
                      value={[profileData.aftercareCompetence || 5]}
                      onValueChange={(value) => updateProfileData({ aftercareCompetence: value[0] })}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {isSub && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>SUB-Spezifische Eigenschaften</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="submissionStyles">Sub-Stile</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['Bratty', 'Gehorsam', 'Service-orientiert', 'Little/Middle', 'Pet/Puppy', 'Masochistisch', 'Sensual', 'Good Girl/Boy'].map((style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sub-style-${style}`}
                            checked={profileData.submissionStyles?.includes(style) || false}
                            onCheckedChange={(checked) => {
                              const styles = profileData.submissionStyles || [];
                              if (checked) {
                                updateProfileData({ submissionStyles: [...styles, style] });
                              } else {
                                updateProfileData({ submissionStyles: styles.filter((s: string) => s !== style) });
                              }
                            }}
                          />
                          <Label htmlFor={`sub-style-${style}`} className="text-sm">{style}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Schmerztoleranz: {profileData.painToleranceGeneral || profileData.painTolerance || 5}/10</Label>
                    <Slider
                      value={[profileData.painToleranceGeneral || profileData.painTolerance || 5]}
                      onValueChange={(value) => updateProfileData({ 
                        painToleranceGeneral: value[0], 
                        painTolerance: value[0] 
                      })}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="desiredDomTypes">Gewünschter Dom-Typ</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['Streng/Strict', 'Fürsorgend/Caring', 'Erfahren', 'Geduldig', 'Daddy/Mommy', 'Master/Mistress', 'Experimentierfreudig', 'Verständnisvoll'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`desired-dom-${type}`}
                            checked={profileData.desiredDomTypes?.includes(type) || profileData.seekingDomTypes?.includes(type) || false}
                            onCheckedChange={(checked) => {
                              const types = profileData.desiredDomTypes || profileData.seekingDomTypes || [];
                              if (checked) {
                                updateProfileData({ 
                                  desiredDomTypes: [...types, type],
                                  seekingDomTypes: [...types, type]
                                });
                              } else {
                                const newTypes = types.filter((t: string) => t !== type);
                                updateProfileData({ 
                                  desiredDomTypes: newTypes,
                                  seekingDomTypes: newTypes
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`desired-dom-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Regressionsfähigkeit: {profileData.regressionCapacity || 0}/10</Label>
                    <Slider
                      value={[profileData.regressionCapacity || 0]}
                      onValueChange={(value) => updateProfileData({ regressionCapacity: value[0] })}
                      max={10}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Beziehungsziele</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="relationshipType">Gewünschte Beziehungsart</Label>
                <Select value={profileData.relationshipType || ''} onValueChange={(value) => updateProfileData({ relationshipType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Beziehungsart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Gelegentliche Sessions</SelectItem>
                    <SelectItem value="regular">Regelmäßige Partnerschaft</SelectItem>
                    <SelectItem value="exclusive">Exklusive Beziehung</SelectItem>
                    <SelectItem value="24-7">24/7 Lifestyle</SelectItem>
                    <SelectItem value="poly">Polyamorie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="relationshipGoals">Beziehungsziele</Label>
                <Textarea
                  id="relationshipGoals"
                  value={profileData.relationshipGoals || profileData.relationshipGoalsSub || ''}
                  onChange={(e) => updateProfileData({ 
                    relationshipGoals: e.target.value,
                    relationshipGoalsSub: e.target.value
                  })}
                  placeholder="Was möchten Sie in einer D/s-Beziehung erreichen?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Speichern...' : 'Alle Änderungen speichern'}
        </Button>
      </div>
    </div>
  );
};