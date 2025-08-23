/**
 * Profile Overview Component
 * 
 * Zeigt eine Übersicht der wichtigsten Profildaten an
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ProfileService } from '@/services/profileService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProfileOverviewProps {
  shouldLoad?: boolean;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ shouldLoad = false }) => {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await ProfileService.getProfile();
        if (response.profile?.data) {
          setProfileData(response.profile.data);
        }
      } catch (error: any) {
        console.error('Error loading profile in overview:', error);
        
        // Handle authentication errors gracefully
        if (error.response?.status === 401) {
          console.warn('Authentication required for profile overview');
        } else if (error.response?.status === 400) {
          console.warn('Profile not found, showing empty state');
        }
        // Don't show user-facing errors for overview - it's not critical
      } finally {
        setLoading(false);
      }
    };

    if (shouldLoad && user?.profileCompleted && user.id) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-muted rounded"></div>;
  }

  const isDom = user?.role === 'DOM';
  const isSub = user?.role === 'SUB';

  return (
    <div className="space-y-4">
      {/* Grunddaten */}
      {(profileData.firstName || profileData.age || profileData.location) && (
        <Card>
          <CardHeader>
            <CardTitle>Grunddaten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.firstName && (
              <div>
                <span className="font-medium">Name:</span> {profileData.firstName} {profileData.lastName || ''}
              </div>
            )}
            {profileData.age && (
              <div>
                <span className="font-medium">Alter:</span> {profileData.age} Jahre
              </div>
            )}
            {profileData.location && (
              <div>
                <span className="font-medium">Wohnort:</span> {profileData.location}
              </div>
            )}
            {profileData.genderIdentity && (
              <div>
                <span className="font-medium">Geschlecht:</span> {profileData.genderIdentity}
              </div>
            )}
            {profileData.sexualOrientation && (
              <div>
                <span className="font-medium">Orientierung:</span> {profileData.sexualOrientation}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* BDSM-Erfahrung */}
      {(profileData.experienceLevel || profileData.bdsmExperience || profileData.yearsInScene) && (
        <Card>
          <CardHeader>
            <CardTitle>BDSM-Erfahrung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(profileData.experienceLevel || profileData.bdsmExperience) && (
              <div>
                <span className="font-medium">Level:</span>{' '}
                <Badge variant="secondary">
                  {profileData.experienceLevel || profileData.bdsmExperience}
                </Badge>
              </div>
            )}
            {profileData.yearsInScene !== undefined && (
              <div>
                <span className="font-medium">Jahre in der Szene:</span> {profileData.yearsInScene}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Role-spezifische Daten */}
      {isDom && profileData.dominanceStyles && (
        <Card>
          <CardHeader>
            <CardTitle>DOM-Eigenschaften</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Dominanz-Stile:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {profileData.dominanceStyles.map((style: string) => (
                  <Badge key={style} variant="outline" className="text-xs">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            {profileData.sadismIntensity !== undefined && (
              <div>
                <span className="font-medium">Sadismus-Intensität:</span> {profileData.sadismIntensity}/10
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isSub && profileData.submissionStyles && (
        <Card>
          <CardHeader>
            <CardTitle>SUB-Eigenschaften</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Sub-Stile:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {profileData.submissionStyles.map((style: string) => (
                  <Badge key={style} variant="outline" className="text-xs">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            {(profileData.painToleranceGeneral || profileData.painTolerance) && (
              <div>
                <span className="font-medium">Schmerztoleranz:</span> {profileData.painToleranceGeneral || profileData.painTolerance}/10
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interessen */}
      {(profileData.interests || profileData.preferredActivities) && (
        <Card>
          <CardHeader>
            <CardTitle>Interessen & Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {(profileData.interests || profileData.preferredActivities || []).map((interest: string) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verfügbarkeit */}
      {(profileData.availableDays || profileData.availableHours) && (
        <Card>
          <CardHeader>
            <CardTitle>Verfügbarkeit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.availableHours && (
              <div>
                <span className="font-medium">Stunden/Woche:</span> {profileData.availableHours}
              </div>
            )}
            {profileData.availableDays && (
              <div>
                <span className="font-medium">Verfügbare Tage:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profileData.availableDays.map((day: string) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!profileData.firstName && !profileData.experienceLevel && !profileData.interests && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Noch keine detaillierten Profildaten vorhanden. 
              Nutzen Sie den Tab "Detaillierte Daten" um Ihr Profil zu vervollständigen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};