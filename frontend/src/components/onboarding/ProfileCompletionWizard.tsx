/**
 * Profile Completion Wizard
 * 
 * Multi-step wizard for completing user profile after registration.
 * Adapts form steps based on user role (DOM/SUB/OBSERVER).
 * 
 * @component ProfileCompletionWizard
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, User, Settings, MessageCircle, Target } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileService, ProfileResponse } from '@/services/profileService';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { CommunicationStep } from './steps/CommunicationStep';
import { RoleSpecificStep } from './steps/RoleSpecificStep';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  required: boolean;
}

export default function ProfileCompletionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [, setProfileResponse] = useState<ProfileResponse | null>(null);
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Get role-specific steps configuration
  const getSteps = (role: string): WizardStep[] => {
    const baseSteps: WizardStep[] = [
      {
        id: 'basic_info',
        title: 'Grundinformationen',
        description: 'Wie möchten Sie angesprochen werden?',
        icon: User,
        component: BasicInfoStep,
        required: true,
      },
      {
        id: 'preferences',
        title: 'Präferenzen',
        description: 'Ihre persönlichen Einstellungen',
        icon: Settings,
        component: PreferencesStep,
        required: true,
      },
      {
        id: 'communication',
        title: 'Kommunikation',
        description: 'Wie möchten Sie kontaktiert werden?',
        icon: MessageCircle,
        component: CommunicationStep,
        required: true,
      },
    ];

    // Add role-specific step
    const roleSpecificStep: WizardStep = {
      id: role === 'DOM' ? 'leadership_style' : role === 'SUB' ? 'goals_boundaries' : 'professional_info',
      title: role === 'DOM' ? 'Führungsstil' : role === 'SUB' ? 'Ziele & Grenzen' : 'Professionelle Informationen',
      description: role === 'DOM' ? 'Ihr Führungsansatz' : role === 'SUB' ? 'Was möchten Sie erreichen?' : 'Ihre Rolle und Expertise',
      icon: Target,
      component: RoleSpecificStep,
      required: true,
    };

    return [...baseSteps, roleSpecificStep];
  };

  const steps = user ? getSteps(user.role) : [];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setInitialLoading(true);
    try {
      const response = await ProfileService.getProfile();
      setProfileResponse(response);
      
      // Pre-fill form data if profile exists
      if (!response.isNewProfile && response.profile) {
        setProfileData({
          preferredName: response.profile.preferredName || '',
          experienceLevel: response.profile.experienceLevel || '',
          availability: response.profile.availability || {},
          preferences: response.profile.preferences || {},
          goals: response.profile.goals || '',
          boundaries: response.profile.boundaries || {},
          communication: response.profile.communication || {},
        });

        // Set current step based on completed steps
        const completedSteps = response.profile.completedSteps || [];
        const nextStepIndex = steps.findIndex(step => !completedSteps.includes(step.id));
        if (nextStepIndex > 0) {
          setCurrentStep(nextStepIndex);
        }
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      const errorMessage = ProfileService.getErrorMessage(error);
      toast.error(`Fehler beim Laden des Profils: ${errorMessage}`);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      await saveCurrentStep();
      setCurrentStep(currentStep + 1);
    } else {
      await completeProfile();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveCurrentStep = async () => {
    setLoading(true);
    try {
      const currentStepData = {
        ...profileData,
        stepCompleted: steps[currentStep].id,
      };

      await ProfileService.updateProfile(currentStepData);
      toast.success('Schritt gespeichert');
    } catch (error: any) {
      console.error('Error saving step:', error);
      const errorMessage = ProfileService.getErrorMessage(error);
      toast.error(`Fehler beim Speichern: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async () => {
    setLoading(true);
    try {
      // Save final step
      await ProfileService.updateProfile({
        ...profileData,
        stepCompleted: steps[currentStep].id,
      });

      // Mark profile as complete
      const result = await ProfileService.completeProfile();
      
      if (result.isComplete) {
        toast.success('Profil erfolgreich vervollständigt!');
        // Redirect to appropriate dashboard based on role
        const dashboardPath = user?.role === 'DOM' ? '/dashboard/overview' : 
                              user?.role === 'SUB' ? '/sub/dashboard' : 
                              '/dashboard/overview';
        navigate(dashboardPath);
      } else {
        toast.error('Profil konnte nicht als vollständig markiert werden. Bitte überprüfen Sie alle Angaben.');
      }
    } catch (error: any) {
      console.error('Error completing profile:', error);
      const errorMessage = ProfileService.getErrorMessage(error);
      toast.error(`Fehler beim Abschließen: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = (data: any) => {
    setProfileData((prev: any) => ({ ...prev, ...data }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Lade Profildaten...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || steps.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">Fehler beim Laden der Profil-Konfiguration.</p>
              <Button onClick={() => navigate('/login')}>
                Zur Anmeldung
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Profil vervollständigen</h1>
          <p className="text-muted-foreground">
            Willkommen bei Underneath! Helfen Sie uns, Ihre Erfahrung zu personalisieren.
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user.role}</Badge>
                <span className="text-sm text-muted-foreground">
                  Schritt {currentStep + 1} von {steps.length}
                </span>
              </div>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                    isCurrent ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <Separator className="w-8 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentStepConfig.icon className="h-5 w-5" />
              {currentStepConfig.title}
            </CardTitle>
            <CardDescription>
              {currentStepConfig.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepComponent
              data={profileData}
              onChange={updateProfileData}
              userRole={user.role}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/overview')}
            >
              Später vervollständigen
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
              ) : currentStep === steps.length - 1 ? null : (
                <ChevronRight className="h-4 w-4 ml-2" />
              )}
              {currentStep === steps.length - 1 ? 'Profil abschließen' : 'Weiter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}