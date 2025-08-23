/**
 * Profile Service
 * 
 * Frontend service for managing user profile completion and onboarding.
 * Handles API calls for profile management.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { apiClient } from './apiClient';
import { profileCache } from './profileCache';
import { useAuthStore } from '../store/useAuthStore';

export interface ProfileData {
  preferredName?: string;
  experienceLevel?: 'BEGINNER' | 'EXPERIENCED' | 'EXPERT';
  availability?: {
    days?: string[];
    timeSlots?: string[];
    timezone?: string;
  };
  preferences?: Record<string, any>;
  goals?: string;
  boundaries?: {
    hardLimits?: string[];
    softLimits?: string[];
    preferences?: string[];
  };
  communication?: {
    frequency?: string;
    style?: string;
    contactMethods?: string[];
    emergencyContact?: boolean;
  };
}

export interface ProfileUpdateData extends ProfileData {
  stepCompleted?: string;
}

export interface ProfileResponse {
  user: {
    id: string;
    email: string;
    role: string;
    displayName?: string;
    profileCompleted: boolean;
  };
  profile: {
    id?: string;
    userId?: string;
    preferredName?: string;
    experienceLevel?: string;
    availability?: any;
    timezone?: string;
    preferences?: any;
    goals?: string;
    boundaries?: any;
    communication?: any;
    data?: any;
    completedSteps: string[];
    createdAt?: string;
    updatedAt?: string;
  } | null;
  isNewProfile: boolean;
  isComplete: boolean;
  progress: number;
}

export interface ProfileProgress {
  progress: number;
  completed: string[];
  remaining: string[];
  isComplete: boolean;
}

export class ProfileService {
  /**
   * Get current user's profile with caching
   */
  static async getProfile(): Promise<ProfileResponse> {
    const { user } = useAuthStore.getState();
    if (!user?.id) {
      throw new Error('No authenticated user');
    }

    return profileCache.getProfile(user.id, async () => {
      const response = await apiClient.get('/profile');
      // Backend returns { success: true, data: {...} }
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch profile');
      }
    });
  }

  /**
   * Update user profile (partial updates allowed)
   */
  static async updateProfile(profileData: ProfileUpdateData): Promise<{
    profile: any;
    isComplete: boolean;
    nextSteps: string[];
  }> {
    const { user } = useAuthStore.getState();
    
    const response = await apiClient.put('/profile', profileData);
    
    // Clear cache after update
    if (user?.id) {
      profileCache.clearUserCache(user.id);
    }
    
    // Backend returns { success: true, data: {...} }
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to update profile');
    }
  }

  /**
   * Get profile completion progress
   */
  static async getProgress(): Promise<ProfileProgress> {
    const response = await apiClient.get('/profile/progress');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to get progress');
    }
  }

  /**
   * Mark profile as completed (if requirements are met)
   */
  static async completeProfile(): Promise<{ isComplete: boolean }> {
    const response = await apiClient.post('/profile/complete');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to complete profile');
    }
  }

  /**
   * Get profile template for role
   */
  static async getTemplate(role: string): Promise<any> {
    const response = await apiClient.get(`/profile/template/${role}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to get template');
    }
  }

  /**
   * Get user-friendly error message
   */
  static getErrorMessage(error: any): string {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.code === 'NETWORK_ERROR') {
      return 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
    }
    
    return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
  }

  /**
   * Get role-specific onboarding steps configuration
   */
  static getOnboardingSteps(role: string): Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
  }> {
    const baseSteps = [
      {
        id: 'basic_info',
        title: 'Grundinformationen',
        description: 'Anzeigename und Erfahrungslevel',
        required: true,
      },
      {
        id: 'preferences',
        title: 'Präferenzen',
        description: 'Ihre persönlichen Einstellungen',
        required: true,
      },
      {
        id: 'communication',
        title: 'Kommunikation',
        description: 'Kontakt- und Kommunikationseinstellungen',
        required: true,
      },
    ];

    switch (role) {
      case 'DOM':
        return [
          ...baseSteps,
          {
            id: 'leadership_style',
            title: 'Führungsstil',
            description: 'Ihre Präferenzen für Führung und Management',
            required: true,
          },
        ];
      case 'SUB':
        return [
          ...baseSteps,
          {
            id: 'goals_boundaries',
            title: 'Ziele & Grenzen',
            description: 'Persönliche Entwicklungsziele und Grenzen',
            required: true,
          },
        ];
      case 'OBSERVER':
        return [
          ...baseSteps,
          {
            id: 'professional_info',
            title: 'Professionelle Informationen',
            description: 'Ihre Rolle und fachlicher Hintergrund',
            required: true,
          },
        ];
      default:
        return baseSteps;
    }
  }

  /**
   * Get role-specific form configuration
   */
  static getRoleFormConfig(role: string): any {
    switch (role) {
      case 'DOM':
        return {
          preferences: {
            leadershipStyle: {
              type: 'select',
              label: 'Führungsstil',
              options: [
                { value: 'structured', label: 'Strukturiert & Detailorientiert' },
                { value: 'supportive', label: 'Unterstützend & Entwicklungsorientiert' },
                { value: 'result_focused', label: 'Ergebnisorientiert' },
                { value: 'flexible', label: 'Flexibel & Situativ' },
              ],
            },
            focus: {
              type: 'multiselect',
              label: 'Schwerpunkte',
              options: [
                { value: 'discipline', label: 'Disziplin & Struktur' },
                { value: 'development', label: 'Persönliche Entwicklung' },
                { value: 'tasks', label: 'Aufgaben & Ziele' },
                { value: 'rituals', label: 'Rituale & Routinen' },
                { value: 'communication', label: 'Kommunikation' },
              ],
            },
            rewardTypes: {
              type: 'multiselect',
              label: 'Bevorzugte Belohnungsarten',
              options: [
                { value: 'praise', label: 'Lob & Anerkennung' },
                { value: 'privileges', label: 'Besondere Privilegien' },
                { value: 'activities', label: 'Gemeinsame Aktivitäten' },
                { value: 'material', label: 'Materielle Belohnungen' },
              ],
            },
          },
        };
      case 'SUB':
        return {
          preferences: {
            motivation: {
              type: 'multiselect',
              label: 'Was motiviert Sie?',
              options: [
                { value: 'structure', label: 'Klare Struktur' },
                { value: 'growth', label: 'Persönliches Wachstum' },
                { value: 'discipline', label: 'Disziplin & Regeln' },
                { value: 'recognition', label: 'Anerkennung' },
                { value: 'challenges', label: 'Herausforderungen' },
              ],
            },
            learningStyle: {
              type: 'select',
              label: 'Bevorzugter Lernstil',
              options: [
                { value: 'visual', label: 'Visuell (sehen, lesen)' },
                { value: 'auditory', label: 'Auditiv (hören, besprechen)' },
                { value: 'practical', label: 'Praktisch (ausprobieren)' },
                { value: 'step_by_step', label: 'Schritt-für-Schritt' },
              ],
            },
            taskTypes: {
              type: 'multiselect',
              label: 'Bevorzugte Aufgabenarten',
              options: [
                { value: 'creative', label: 'Kreativ' },
                { value: 'analytical', label: 'Analytisch' },
                { value: 'physical', label: 'Körperlich' },
                { value: 'routine', label: 'Routineaufgaben' },
                { value: 'challenging', label: 'Herausfordernd' },
              ],
            },
          },
        };
      case 'OBSERVER':
        return {
          preferences: {
            relationship: {
              type: 'select',
              label: 'Beziehung zu den Beteiligten',
              options: [
                { value: 'therapist', label: 'Therapeut/in' },
                { value: 'mediator', label: 'Mediator/in' },
                { value: 'coach', label: 'Coach' },
                { value: 'friend', label: 'Freund/in' },
                { value: 'mentor', label: 'Mentor/in' },
                { value: 'other', label: 'Andere' },
              ],
            },
            background: {
              type: 'select',
              label: 'Fachlicher Hintergrund',
              options: [
                { value: 'psychology', label: 'Psychologie' },
                { value: 'therapy', label: 'Therapie/Beratung' },
                { value: 'coaching', label: 'Coaching' },
                { value: 'peer', label: 'Peer/Erfahrungsaustausch' },
                { value: 'other', label: 'Andere' },
              ],
            },
            observationRole: {
              type: 'select',
              label: 'Beobachtungsrolle',
              options: [
                { value: 'passive', label: 'Passiv beobachtend' },
                { value: 'advisory', label: 'Beratend' },
                { value: 'supportive', label: 'Unterstützend' },
                { value: 'mediating', label: 'Vermittelnd' },
              ],
            },
          },
        };
      default:
        return {};
    }
  }
}