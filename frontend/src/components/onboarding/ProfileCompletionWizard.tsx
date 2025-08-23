/**
 * Profile Completion Wizard
 * 
 * Multi-step wizard for completing user profile after registration.
 * Adapts form steps based on user role (DOM/SUB).
 * 
 * @component ProfileCompletionWizard
 * @author Underneath Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProfileService, ProfileResponse } from '@/services/profileService';
import { useAuthStore } from '@/store/useAuthStore';
import NotificationService from '@/services/notificationService';
import { Button } from '@/components/ui/button';
import { completeDomRegistrationSteps } from './forms/CompleteDomRegistration';
import { completeSubRegistrationSteps } from './forms/CompleteSubRegistration';
import { FormProgress } from './FormProgress';

export default function ProfileCompletionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileResponse, setProfileResponse] = useState<ProfileResponse | null>(null);
  
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  // Get role-specific steps
  const steps = user?.role === 'DOM' ? completeDomRegistrationSteps : completeSubRegistrationSteps;
  const totalSteps = steps.length;
  const stepTitles = steps.map(step => step.title);

  useEffect(() => {
    let isMounted = true;
    
    if (user?.id && !profileResponse && !initialLoading) {
      console.log('Loading profile for user:', user.email);
      
      // Start loading immediately
      loadProfileSafe(isMounted);
      
      // Emergency fallback after 3 seconds (increased timeout)
      const emergencyTimeout = setTimeout(() => {
        if (isMounted && !profileResponse) {
          console.log('Emergency timeout - forcing fallback profile creation');
          createFallbackProfile();
        }
      }, 3000);
      
      return () => {
        isMounted = false;
        clearTimeout(emergencyTimeout);
      };
    }
  }, [user?.id, profileResponse, initialLoading]);
  
  const loadProfileSafe = async (isMounted: boolean) => {
    if (!isMounted) return;
    
    try {
      console.log('Attempting to fetch profile...');
      const response = await ProfileService.getProfile();
      
      if (isMounted) {
        console.log('Profile response received:', response);
        setProfileResponse(response);
        setInitialLoading(false);
        
        // Pre-fill form data if profile exists
        if (!response.isNewProfile && response.profile?.data) {
          setFormData(response.profile.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (isMounted) {
        createFallbackProfile();
      }
    }
  };

  const createFallbackProfile = () => {
    console.log('Creating fallback profile...');
    setProfileResponse({
      user: {
        id: user?.id || '',
        email: user?.email || '',
        role: user?.role || '',
        displayName: user?.displayName,
        profileCompleted: false
      },
      isNewProfile: true,
      profile: null,
      isComplete: false,
      progress: 0
    });
    setInitialLoading(false);
  };

  const updateFormData = (newData: Partial<any>) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      console.log('Completing profile with data:', formData);
      
      // Update profile with comprehensive data
      const profileData = {
        preferredName: formData.firstName || '',
        data: formData,
        experienceLevel: formData.bdsmExperience || 'beginner',
        availability: {
          days: formData.availableDays || [],
          timePreference: formData.timePreference || 'flexible',
          frequency: formData.sessionFrequency || 'weekly'
        },
        preferences: {
          communication: formData.communicationStyles || [],
          activities: formData.preferredActivities || formData.interests || [],
          relationshipType: formData.relationshipType || 'undecided'
        },
        goals: formData.personalGoals?.join(', ') || formData.learningInterests || '',
        boundaries: {
          hardLimits: formData.hardLimits || '',
          softLimits: formData.softLimits || '',
          healthNotes: formData.healthNotes || ''
        },
        communication: {
          style: formData.communicationStyles || [],
          frequency: 'regular',
          channels: ['app']
        }
      };

      const response = await ProfileService.updateProfile(profileData);
      
      if (response) {
        console.log('Profile updated successfully');
        
        // Update user status
        if (user) {
          updateUser({ ...user, profileCompleted: true });
        }

        // Send sequential push notifications
        console.log('Sending sequential notifications...');
        
        // 1. Erste Push-Nachricht: Profil erfolgreich vervollständigt
        setTimeout(() => {
          console.log('Sending first notification: Profile completed');
          NotificationService.showNotification({
            title: 'Profil erfolgreich vervollständigt',
            body: 'Alle Schritte wurden abgeschlossen.',
            type: 'success'
          });
        }, 500);
        
        // 2. Zweite Push-Nachricht: Willkommen
        setTimeout(() => {
          console.log('Sending second notification: Welcome');
          NotificationService.sendProfileCompletedNotification();
        }, 1500);
        
        // 3. Dritte Push-Nachricht: Navigation
        setTimeout(() => {
          console.log('Sending third notification: Navigation');
          NotificationService.showNotification({
            title: 'Weiterleitung zum Dashboard',
            body: 'Sie werden automatisch weitergeleitet...',
            url: '/dashboard/direct',
            type: 'navigation'
          });
        }, 2500);

        // Navigate after notifications
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          navigate('/dashboard/direct');
        }, 3500);
      }
      
    } catch (error) {
      console.error('Failed to complete profile:', error);
      toast.error('Fehler beim Speichern des Profils');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    console.log('User chose to skip profile completion');
    navigate('/dashboard/overview?skip_onboarding=true');
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">Lade Profildaten...</p>
          
          {/* Emergency escape buttons */}
          <div className="space-y-2 mt-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/direct')}
              className="block mx-auto"
            >
              🚨 Notfall-Weiterleitung
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/escape')}
              className="block mx-auto text-xs"
            >
              Alternative Route
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main wizard content
  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <FormProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitles={stepTitles}
          userRole={user?.role as 'DOM' | 'SUB'}
        />

        {/* Current step */}
        {CurrentStepComponent && (
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentStep === 0}
            isLast={currentStep === totalSteps - 1}
          />
        )}

        {/* Skip option for first step */}
        {currentStep === 0 && (
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              disabled={loading}
            >
              Später vervollständigen
            </Button>
          </div>
        )}

        {/* Emergency buttons */}
        <div className="text-center mt-8 space-y-2">
          <div className="text-xs text-muted-foreground">
            Probleme? Nutzen Sie die Notfall-Optionen:
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/direct')}
            >
              Direkt zum Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/escape')}
            >
              Alternative Route
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}