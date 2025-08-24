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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Geburtsdatum</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !profileData.birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {profileData.birthDate ? (
                          format(new Date(profileData.birthDate), "dd.MM.yyyy", { locale: de })
                        ) : (
                          "Geburtsdatum wählen"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={profileData.birthDate ? new Date(profileData.birthDate) : undefined}
                        onSelect={(date) => updateProfileData({ birthDate: date?.toISOString() })}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <Select value={profileData.religion || ''} onValueChange={(value) => updateProfileData({ religion: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Religion (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keine">Keine / Atheismus</SelectItem>
                      <SelectItem value="agnostizismus">Agnostizismus</SelectItem>
                      <SelectItem value="alevitentum">Alevitentum</SelectItem>
                      <SelectItem value="bahaitum">Bahaitum</SelectItem>
                      <SelectItem value="buddhismus">Buddhismus (z. B. Theravada, Mahayana, Vajrayana)</SelectItem>
                      <SelectItem value="christentum">Christentum (z. B. Katholizismus, Orthodoxie, Protestantismus, Freikirchen)</SelectItem>
                      <SelectItem value="daoismus">Daoismus (Taoismus)</SelectItem>
                      <SelectItem value="druidentum">Druidentum / Neodruidismus</SelectItem>
                      <SelectItem value="hinduismus">Hinduismus (z. B. Vaishnavismus, Shaivismus, Shaktismus)</SelectItem>
                      <SelectItem value="islam">Islam (z. B. Sunniten, Schiiten, Ibaditen, Sufismus)</SelectItem>
                      <SelectItem value="jainismus">Jainismus</SelectItem>
                      <SelectItem value="judentum">Judentum (z. B. Orthodox, Konservativ, Reformiert, Chassidisch)</SelectItem>
                      <SelectItem value="konfuzianismus">Konfuzianismus</SelectItem>
                      <SelectItem value="paganismus">Paganismus (moderne Neuheiden, z. B. Wicca, Ásatrú)</SelectItem>
                      <SelectItem value="rastafari">Rastafari-Bewegung</SelectItem>
                      <SelectItem value="schamanismus">Schamanismus (verschiedene indigene Traditionen weltweit)</SelectItem>
                      <SelectItem value="shinto">Shinto</SelectItem>
                      <SelectItem value="sikhismus">Sikhismus</SelectItem>
                      <SelectItem value="spiritismus">Spiritismus</SelectItem>
                      <SelectItem value="voodoo">Voodoo (z. B. Haitianischer Vodou, Louisiana Voodoo)</SelectItem>
                      <SelectItem value="zoroastrismus">Zoroastrismus (Parsismus)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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


              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="motherTongue">Muttersprache</Label>
                  <Select value={profileData.motherTongue || ''} onValueChange={(value) => updateProfileData({ motherTongue: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Muttersprache" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arabisch">Arabisch</SelectItem>
                      <SelectItem value="bulgarisch">Bulgarisch</SelectItem>
                      <SelectItem value="chinesisch-vereinfacht">Chinesisch vereinfacht</SelectItem>
                      <SelectItem value="chinesisch-traditionell">Chinesisch traditionell</SelectItem>
                      <SelectItem value="daenisch">Dänisch</SelectItem>
                      <SelectItem value="deutsch">Deutsch</SelectItem>
                      <SelectItem value="englisch">Englisch</SelectItem>
                      <SelectItem value="estnisch">Estnisch</SelectItem>
                      <SelectItem value="finnisch">Finnisch</SelectItem>
                      <SelectItem value="franzoesisch">Französisch</SelectItem>
                      <SelectItem value="griechisch">Griechisch</SelectItem>
                      <SelectItem value="hebraeisch">Hebräisch</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="indonesisch">Indonesisch</SelectItem>
                      <SelectItem value="italienisch">Italienisch</SelectItem>
                      <SelectItem value="japanisch">Japanisch</SelectItem>
                      <SelectItem value="koreanisch">Koreanisch</SelectItem>
                      <SelectItem value="kroatisch">Kroatisch</SelectItem>
                      <SelectItem value="lettisch">Lettisch</SelectItem>
                      <SelectItem value="litauisch">Litauisch</SelectItem>
                      <SelectItem value="malaiisch">Malaiisch</SelectItem>
                      <SelectItem value="niederlaendisch">Niederländisch</SelectItem>
                      <SelectItem value="norwegisch">Norwegisch</SelectItem>
                      <SelectItem value="polnisch">Polnisch</SelectItem>
                      <SelectItem value="portugiesisch">Portugiesisch</SelectItem>
                      <SelectItem value="rumaenisch">Rumänisch</SelectItem>
                      <SelectItem value="russisch">Russisch</SelectItem>
                      <SelectItem value="schwedisch">Schwedisch</SelectItem>
                      <SelectItem value="slowakisch">Slowakisch</SelectItem>
                      <SelectItem value="slowenisch">Slowenisch</SelectItem>
                      <SelectItem value="spanisch">Spanisch</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="tschechisch">Tschechisch</SelectItem>
                      <SelectItem value="tuerkisch">Türkisch</SelectItem>
                      <SelectItem value="ukrainisch">Ukrainisch</SelectItem>
                      <SelectItem value="ungarisch">Ungarisch</SelectItem>
                      <SelectItem value="vietnamesisch">Vietnamesisch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="secondLanguage">Zweitsprache</Label>
                  <Select value={profileData.secondLanguage || ''} onValueChange={(value) => updateProfileData({ secondLanguage: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zweitsprache (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keine">Keine</SelectItem>
                      <SelectItem value="arabisch">Arabisch</SelectItem>
                      <SelectItem value="bulgarisch">Bulgarisch</SelectItem>
                      <SelectItem value="chinesisch-vereinfacht">Chinesisch vereinfacht</SelectItem>
                      <SelectItem value="chinesisch-traditionell">Chinesisch traditionell</SelectItem>
                      <SelectItem value="daenisch">Dänisch</SelectItem>
                      <SelectItem value="deutsch">Deutsch</SelectItem>
                      <SelectItem value="englisch">Englisch</SelectItem>
                      <SelectItem value="estnisch">Estnisch</SelectItem>
                      <SelectItem value="finnisch">Finnisch</SelectItem>
                      <SelectItem value="franzoesisch">Französisch</SelectItem>
                      <SelectItem value="griechisch">Griechisch</SelectItem>
                      <SelectItem value="hebraeisch">Hebräisch</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="indonesisch">Indonesisch</SelectItem>
                      <SelectItem value="italienisch">Italienisch</SelectItem>
                      <SelectItem value="japanisch">Japanisch</SelectItem>
                      <SelectItem value="koreanisch">Koreanisch</SelectItem>
                      <SelectItem value="kroatisch">Kroatisch</SelectItem>
                      <SelectItem value="lettisch">Lettisch</SelectItem>
                      <SelectItem value="litauisch">Litauisch</SelectItem>
                      <SelectItem value="malaiisch">Malaiisch</SelectItem>
                      <SelectItem value="niederlaendisch">Niederländisch</SelectItem>
                      <SelectItem value="norwegisch">Norwegisch</SelectItem>
                      <SelectItem value="polnisch">Polnisch</SelectItem>
                      <SelectItem value="portugiesisch">Portugiesisch</SelectItem>
                      <SelectItem value="rumaenisch">Rumänisch</SelectItem>
                      <SelectItem value="russisch">Russisch</SelectItem>
                      <SelectItem value="schwedisch">Schwedisch</SelectItem>
                      <SelectItem value="slowakisch">Slowakisch</SelectItem>
                      <SelectItem value="slowenisch">Slowenisch</SelectItem>
                      <SelectItem value="spanisch">Spanisch</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="tschechisch">Tschechisch</SelectItem>
                      <SelectItem value="tuerkisch">Türkisch</SelectItem>
                      <SelectItem value="ukrainisch">Ukrainisch</SelectItem>
                      <SelectItem value="ungarisch">Ungarisch</SelectItem>
                      <SelectItem value="vietnamesisch">Vietnamesisch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="languageProficiency">Sprachniveau Zweitsprache</Label>
                  <Select 
                    value={profileData.languageProficiency || ''} 
                    onValueChange={(value) => updateProfileData({ languageProficiency: value })}
                    disabled={!profileData.secondLanguage || profileData.secondLanguage === 'keine'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sprachniveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a1">A1 Anfänger</SelectItem>
                      <SelectItem value="a2">A2 Grundlegende Kenntnisse</SelectItem>
                      <SelectItem value="b1">B1 Fortgeschrittene Sprachverwendung</SelectItem>
                      <SelectItem value="b2">B2 Selbstständige Sprachbeherrschung</SelectItem>
                      <SelectItem value="c1">C1 Fortgeschrittenes Niveau</SelectItem>
                      <SelectItem value="c2">C2 Annähernd muttersprachliche Kenntnisse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Adresse</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <Label htmlFor="street">Straße</Label>
                    <Input
                      id="street"
                      value={profileData.street || ''}
                      onChange={(e) => updateProfileData({ street: e.target.value })}
                      placeholder="Straßenname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="houseNumber">Hausnummer</Label>
                    <Input
                      id="houseNumber"
                      value={profileData.houseNumber || ''}
                      onChange={(e) => updateProfileData({ houseNumber: e.target.value })}
                      placeholder="Nr."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postleitzahl</Label>
                    <Input
                      id="postalCode"
                      value={profileData.postalCode || ''}
                      onChange={(e) => updateProfileData({ postalCode: e.target.value })}
                      placeholder="PLZ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      value={profileData.city || ''}
                      onChange={(e) => updateProfileData({ city: e.target.value })}
                      placeholder="Stadt"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persönlichkeit</CardTitle>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sexualOrientation">Sexuelle Orientierung</Label>
                  <Select value={profileData.sexualOrientation || ''} onValueChange={(value) => updateProfileData({ sexualOrientation: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Orientierung" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asexuell">Asexuell</SelectItem>
                      <SelectItem value="autosexuell">Autosexuell</SelectItem>
                      <SelectItem value="androsexuell">Androsexuell</SelectItem>
                      <SelectItem value="bisexuell">Bisexuell</SelectItem>
                      <SelectItem value="demisexuell">Demisexuell</SelectItem>
                      <SelectItem value="grausexuell">Grausexuell</SelectItem>
                      <SelectItem value="gynosexuell">Gynosexuell</SelectItem>
                      <SelectItem value="heterosexuell">Heterosexuell</SelectItem>
                      <SelectItem value="homosexuell">Homosexuell</SelectItem>
                      <SelectItem value="pansexuell">Pansexuell</SelectItem>
                      <SelectItem value="phallussexuell">Phallussexuell</SelectItem>
                      <SelectItem value="sapiosexuell">Sapiosexuell</SelectItem>
                      <SelectItem value="polysexuell">Polysexuell</SelectItem>
                      <SelectItem value="tribadiesexuell">Tribadiesexuell</SelectItem>
                      <SelectItem value="monosexuell">Monosexuell</SelectItem>
                      <SelectItem value="paedosexuell">Pädosexuell</SelectItem>
                      <SelectItem value="psychosexuell">Psychosexuell</SelectItem>
                      <SelectItem value="nomosexuell">Nomosexuell</SelectItem>
                      <SelectItem value="nowomasexuell">Nowomasexuell</SelectItem>
                      <SelectItem value="girlfagsexuell">Girlfagsexuell</SelectItem>
                      <SelectItem value="guydykesexuell">Guydykesexuell</SelectItem>
                      <SelectItem value="pomosexuell">Pomosexuell</SelectItem>
                      <SelectItem value="skoliosexuell">Skoliosexuell</SelectItem>
                      <SelectItem value="abrosexuell">Abrosexuell</SelectItem>
                      <SelectItem value="ageosexuell">Ageosexuell</SelectItem>
                      <SelectItem value="akoisexuell">Akoisexuell</SelectItem>
                      <SelectItem value="allosexuell">Allosexuell</SelectItem>
                      <SelectItem value="apothisexuell">Apothisexuell</SelectItem>
                      <SelectItem value="bellusexuell">Bellusexuell</SelectItem>
                      <SelectItem value="quoisexuell">Quoisexuell</SelectItem>
                      <SelectItem value="caedosexuell">Caedosexuell</SelectItem>
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
                      <SelectItem value="aromantisch">Aromantisch</SelectItem>
                      <SelectItem value="biromantisch">Biromantisch</SelectItem>
                      <SelectItem value="demiromantisch">Demiromantisch</SelectItem>
                      <SelectItem value="grauromaantisch">Grauromantisch</SelectItem>
                      <SelectItem value="heteroromantisch">Heteroromantisch</SelectItem>
                      <SelectItem value="homoromantisch">Homoromantisch</SelectItem>
                      <SelectItem value="panromantisch">Panromantisch</SelectItem>
                      <SelectItem value="polyromantisch">Polyromantisch</SelectItem>
                      <SelectItem value="quoiromantisch">Quoiromantisch</SelectItem>
                      <SelectItem value="skolioromantisch">Skolioromantisch</SelectItem>
                      <SelectItem value="lithromantisch">Lithromantisch</SelectItem>
                      <SelectItem value="autoromantisch">Autoromantisch</SelectItem>
                      <SelectItem value="androromantisch">Androromantisch</SelectItem>
                      <SelectItem value="gynoromantisch">Gynoromantisch</SelectItem>
                      <SelectItem value="abroromantisch">Abroromantisch</SelectItem>
                      <SelectItem value="aegoromantisch">Aegoromantisch</SelectItem>
                      <SelectItem value="akoiromantisch">Akoiromantisch</SelectItem>
                      <SelectItem value="alloromantisch">Alloromantisch</SelectItem>
                      <SelectItem value="apothiromantisch">Apothiromantisch</SelectItem>
                      <SelectItem value="belluromantisch">Belluromantisch</SelectItem>
                      <SelectItem value="caedoromantisch">Caedoromantisch</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discretion">Diskretion & Identitätsschutz</Label>
                  <Select value={profileData.discretion || ''} onValueChange={(value) => updateProfileData({ discretion: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Diskretionsgrad auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Hohe Diskretion & Identitätsschutz erforderlich (z. B. berufliche Risiken, outing-gefährdet)</SelectItem>
                      <SelectItem value="medium">Mittlere Diskretion & Identitätsschutz (z. B. im privaten Umfeld offen, aber nicht öffentlich)</SelectItem>
                      <SelectItem value="low">Geringe Diskretion & Identitätsschutz (z. B. öffentlich bekannte Szene-Person)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Ort & Umfeld</Label>
                  <Select value={profileData.locationEnvironment || ''} onValueChange={(value) => updateProfileData({ locationEnvironment: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ort & Umfeld auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutraler Ort (z. B. gemieteter Playroom, Studio)</SelectItem>
                      <SelectItem value="private">Privatwohnung</SelectItem>
                      <SelectItem value="semi-public">Öffentlich halbgeschützt (z. B. Outdoor-Spiele, aber ohne Publikum)</SelectItem>
                      <SelectItem value="public">Öffentlich sichtbar (bewusste Zurschaustellung, Fetisch-Events)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelDistance">Reisebereitschaft bis zu (km)</Label>
                  <Input
                    id="travelDistance"
                    type="text"
                    value={profileData.travelDistance || ''}
                    onChange={(e) => updateProfileData({ travelDistance: e.target.value })}
                    placeholder="z.B. 50"
                  />
                </div>
                <div>
                  <Label htmlFor="relationshipStatus">Aktueller Beziehungsstatus</Label>
                  <Select value={profileData.relationshipStatus || ''} onValueChange={(value) => updateProfileData({ relationshipStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Beziehungsstatus auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="taken">Vergeben</SelectItem>
                      <SelectItem value="married">Verheiratet</SelectItem>
                      <SelectItem value="polyamorous">Polyamor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exclusivity">Exklusivität</Label>
                  <Select value={profileData.exclusivity || ''} onValueChange={(value) => updateProfileData({ exclusivity: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Exklusivität auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Exklusiv</SelectItem>
                      <SelectItem value="open">Offen</SelectItem>
                    </SelectContent>
                  </Select>
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
                  placeholder="Für diese Beziehung relevante Gesundheitsinformationen, wie z.B. Krankheiten, Therapien, Medikamente, Allergien ..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Grenzen & Sicherheit */}
        {currentHash === 'bdsm' && (
          <div id="bdsm" className="space-y-6">
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

              <div>
                <Label htmlFor="dealBreakers">Deal-Breaker (absolute No-Gos)</Label>
                <Textarea
                  id="dealBreakers"
                  value={profileData.dealBreakers || ''}
                  onChange={(e) => updateProfileData({ dealBreakers: e.target.value })}
                  placeholder="Absolute No-Gos, die eine Beziehung ausschließen würden..."
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

              <div className="space-y-4 mt-6 border-t pt-4">
                <h4 className="text-sm font-medium">Notfallkontakt</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Name des Notfallkontakts</Label>
                    <Input
                      id="emergencyContactName"
                      value={profileData.emergencyContactName || ''}
                      onChange={(e) => updateProfileData({ emergencyContactName: e.target.value })}
                      placeholder="Vollständiger Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactRelation">Beziehung</Label>
                    <Input
                      id="emergencyContactRelation"
                      value={profileData.emergencyContactRelation || ''}
                      onChange={(e) => updateProfileData({ emergencyContactRelation: e.target.value })}
                      placeholder="z.B. Partner/in, Freund/in, Familie"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactPhone">Telefonnummer</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={profileData.emergencyContactPhone || ''}
                      onChange={(e) => updateProfileData({ emergencyContactPhone: e.target.value })}
                      placeholder="+49 xxx xxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactEmail">E-Mail (optional)</Label>
                    <Input
                      id="emergencyContactEmail"
                      type="email"
                      value={profileData.emergencyContactEmail || ''}
                      onChange={(e) => updateProfileData({ emergencyContactEmail: e.target.value })}
                      placeholder="name@example.com"
                    />
                  </div>
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