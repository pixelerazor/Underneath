/**
 * Profile Store
 * 
 * Zustand Store for managing user profile completion state.
 * Handles profile data, progress tracking, and onboarding flow.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface ProfileProgress {
  progress: number;
  completed: string[];
  remaining: string[];
  isComplete: boolean;
}

interface ProfileState {
  // Profile data
  profileData: ProfileData | null;
  isProfileComplete: boolean;
  needsOnboarding: boolean;
  
  // Progress tracking
  progress: ProfileProgress | null;
  currentOnboardingStep: number;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  setProfileData: (data: ProfileData) => void;
  updateProfileData: (updates: Partial<ProfileData>) => void;
  setProgress: (progress: ProfileProgress) => void;
  setProfileComplete: (isComplete: boolean) => void;
  setNeedsOnboarding: (needs: boolean) => void;
  setCurrentOnboardingStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      // Initial state
      profileData: null,
      isProfileComplete: false,
      needsOnboarding: false,
      progress: null,
      currentOnboardingStep: 0,
      isLoading: false,
      isSaving: false,

      // Actions
      setProfileData: (data: ProfileData) =>
        set({ profileData: data }),

      updateProfileData: (updates: Partial<ProfileData>) =>
        set((state) => ({
          profileData: state.profileData
            ? { ...state.profileData, ...updates }
            : updates as ProfileData,
        })),

      setProgress: (progress: ProfileProgress) =>
        set({ progress }),

      setProfileComplete: (isComplete: boolean) =>
        set({ isProfileComplete: isComplete, needsOnboarding: !isComplete }),

      setNeedsOnboarding: (needs: boolean) =>
        set({ needsOnboarding: needs }),

      setCurrentOnboardingStep: (step: number) =>
        set({ currentOnboardingStep: step }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      setSaving: (saving: boolean) =>
        set({ isSaving: saving }),

      reset: () =>
        set({
          profileData: null,
          isProfileComplete: false,
          needsOnboarding: false,
          progress: null,
          currentOnboardingStep: 0,
          isLoading: false,
          isSaving: false,
        }),
    }),
    {
      name: 'profile-storage',
      // Only persist essential profile state
      partialize: (state) => ({
        profileData: state.profileData,
        isProfileComplete: state.isProfileComplete,
        needsOnboarding: state.needsOnboarding,
        currentOnboardingStep: state.currentOnboardingStep,
      }),
    }
  )
);

// Selector hooks for better performance
export const useProfileData = () => useProfileStore((state) => state.profileData);
export const useProfileComplete = () => useProfileStore((state) => state.isProfileComplete);
export const useNeedsOnboarding = () => useProfileStore((state) => state.needsOnboarding);
export const useProfileProgress = () => useProfileStore((state) => state.progress);
export const useOnboardingStep = () => useProfileStore((state) => state.currentOnboardingStep);
export const useProfileLoading = () => useProfileStore((state) => state.isLoading);
export const useProfileSaving = () => useProfileStore((state) => state.isSaving);