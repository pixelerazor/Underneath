/**
 * Form Types and Interfaces
 * 
 * Central type definitions for the dynamic form system
 */

// Available form types
export type FormType = 
  // German form types (primary system)
  | 'allgemeine_informationen'
  | 'aufgaben'
  | 'faq'
  | 'geist'
  | 'initiationsriten'
  | 'keuschheit'
  | 'neue_erkenntnisse'
  | 'neue_stufe'
  | 'privilegien'
  | 'regeln'
  | 'rueckfaelle'
  | 'strafen'
  | 'stufen'
  | 'tpe'
  | 'trigger'
  | 'ziele'
  // Legacy English form types (backward compatibility)
  | 'task'
  | 'note'
  | 'rule'
  | 'punishment'
  | 'reward'
  | 'appointment'
  | 'achievement';

// Form type configuration
export interface FormTypeConfig {
  id: FormType;
  label: string;
  description: string;
  icon?: string;
}

// Available form types with their configurations
export const FORM_TYPES: FormTypeConfig[] = [
  {
    id: 'allgemeine_informationen',
    label: 'Allgemeine Informationen',
    description: 'Allgemeine Informationen hinzufügen',
  },
  {
    id: 'aufgaben',
    label: 'Aufgaben',
    description: 'Neue Aufgabe erstellen',
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Häufige Frage hinzufügen',
  },
  {
    id: 'geist',
    label: 'Geist',
    description: 'Geistiges Wohlbefinden dokumentieren',
  },
  {
    id: 'initiationsriten',
    label: 'Initiationsriten',
    description: 'Initiationsritus definieren',
  },
  {
    id: 'keuschheit',
    label: 'Keuschheit',
    description: 'Keuschheit dokumentieren',
  },
  {
    id: 'neue_erkenntnisse',
    label: 'Neue Erkenntnisse',
    description: 'Erkenntnis festhalten',
  },
  {
    id: 'neue_stufe',
    label: 'Neue Stufe',
    description: 'Neue Stufe zum System hinzufügen',
  },
  {
    id: 'privilegien',
    label: 'Privilegien',
    description: 'Privileg definieren',
  },
  {
    id: 'regeln',
    label: 'Regeln',
    description: 'Neue Regel definieren',
  },
  {
    id: 'rueckfaelle',
    label: 'Rückfälle',
    description: 'Rückfall dokumentieren',
  },
  {
    id: 'strafen',
    label: 'Strafen',
    description: 'Strafe dokumentieren',
  },
  {
    id: 'stufen',
    label: 'Stufen',
    description: 'Stufenplan-Eintrag erstellen',
  },
  {
    id: 'tpe',
    label: 'TPE',
    description: 'TPE-Eintrag dokumentieren',
  },
  {
    id: 'trigger',
    label: 'Trigger',
    description: 'Trigger identifizieren',
  },
  {
    id: 'ziele',
    label: 'Ziel',
    description: 'SMART-Ziel definieren',
  },
];

// Base form data interface
export interface BaseFormData {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Specific form data interfaces
export interface TaskFormData extends BaseFormData {
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  assignedTo?: string;
}

export interface NoteFormData extends BaseFormData {
  category: 'general' | 'insight' | 'trigger' | 'relapse';
  tags?: string[];
  mood?: number; // 1-10 scale
}

export interface RuleFormData extends BaseFormData {
  category: 'behavior' | 'routine' | 'restriction';
  severity: 'info' | 'warning' | 'strict';
  consequences?: string;
}

export interface PunishmentFormData extends BaseFormData {
  severity: 'light' | 'medium' | 'severe';
  reason: string;
  duration?: string;
  completedAt?: Date;
}

export interface RewardFormData extends BaseFormData {
  category: 'privilege' | 'gift' | 'experience';
  earnedFor: string;
  givenAt: Date;
}

export interface AppointmentFormData extends BaseFormData {
  startDate: Date;
  endDate?: Date;
  location?: string;
  attendees?: string[];
  type: 'session' | 'meeting' | 'event';
}

export interface AchievementFormData extends BaseFormData {
  category: 'milestone' | 'goal' | 'improvement';
  points?: number;
  badge?: string;
  achievedAt: Date;
}

// Union type for all form data
export type FormData = 
  | TaskFormData
  | NoteFormData
  | RuleFormData
  | PunishmentFormData
  | RewardFormData
  | AppointmentFormData
  | AchievementFormData;