/**
 * Form Registry
 * 
 * Centralized registry for all form components
 * Provides consistent form loading, validation, and submission patterns
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import React, { lazy, Suspense } from 'react';
import { FormType } from '../fab/types/formTypes';
import { Skeleton } from '../ui/skeleton';

// Lazy load form components for better performance
const AufgabenForm = lazy(() => import('../fab/forms/specific/AufgabenForm'));
const RegelnForm = lazy(() => import('../fab/forms/specific/RegelnForm'));
const ZieleForm = lazy(() => import('../fab/forms/specific/ZieleForm'));
const FaqForm = lazy(() => import('../fab/forms/specific/FaqForm'));
const GeistForm = lazy(() => import('../fab/forms/specific/GeistForm'));
const KeuschheitForm = lazy(() => import('../fab/forms/specific/KeuschheitForm'));
const NeueErkenntnisseForm = lazy(() => import('../fab/forms/specific/NeueErkenntnisseForm'));
const RueckfaelleForm = lazy(() => import('../fab/forms/specific/RueckfaelleForm'));
const StrafenForm = lazy(() => import('../fab/forms/specific/StrafenForm'));
const TpeForm = lazy(() => import('../fab/forms/specific/TpeForm'));
const TriggerForm = lazy(() => import('../fab/forms/specific/TriggerForm'));
const AllgemeineInformationenForm = lazy(() => import('../fab/forms/specific/AllgemeineInformationenForm'));
const StufenForm = lazy(() => import('../fab/forms/specific/StufenForm'));
const InitiationsritenForm = lazy(() => import('../fab/forms/specific/InitiationsritenForm'));
const PrivilegienForm = lazy(() => import('../fab/forms/specific/PrivilegienForm'));

export interface FormConfig {
  component: React.ComponentType<any>;
  title: string;
  description: string;
  category: 'entity' | 'system' | 'content';
  icon?: string;
  requiresAuth?: boolean;
  allowedRoles?: ('DOM' | 'SUB' | 'OBSERVER')[];
}

/**
 * Registry mapping form types to their configurations
 */
export const FORM_REGISTRY: Record<FormType, FormConfig> = {
  // Core entities
  'aufgaben': {
    component: AufgabenForm,
    title: 'Neue Aufgabe',
    description: 'Erstelle eine neue Aufgabe mit Zielen und Belohnungen',
    category: 'entity',
    icon: 'CheckSquare',
    allowedRoles: ['DOM', 'SUB']
  },
  'regeln': {
    component: RegelnForm,
    title: 'Neue Regel',
    description: 'Definiere eine neue Regel mit Strafen und Bedingungen',
    category: 'entity',
    icon: 'BookOpen',
    allowedRoles: ['DOM']
  },
  'ziele': {
    component: ZieleForm,
    title: 'Neues Ziel',
    description: 'Setze ein neues Ziel mit Belohnungen und Deadlines',
    category: 'entity',
    icon: 'Target',
    allowedRoles: ['DOM', 'SUB']
  },
  
  // Content forms
  'faq': {
    component: FaqForm,
    title: 'FAQ Eintrag',
    description: 'Erstelle einen neuen FAQ Eintrag',
    category: 'content',
    icon: 'HelpCircle',
    allowedRoles: ['DOM']
  },
  'allgemeine_informationen': {
    component: AllgemeineInformationenForm,
    title: 'Information',
    description: 'Erstelle eine allgemeine Information',
    category: 'content',
    icon: 'Info',
    allowedRoles: ['DOM']
  },
  
  // Personal tracking
  'geist': {
    component: GeistForm,
    title: 'Geistliches Wohlbefinden',
    description: 'Dokumentiere dein geistliches Wohlbefinden',
    category: 'entity',
    icon: 'Brain',
    allowedRoles: ['SUB']
  },
  'keuschheit': {
    component: KeuschheitForm,
    title: 'Keuschheit Eintrag',
    description: 'Dokumentiere Keuschheits-bezogene Aktivitäten',
    category: 'entity',
    icon: 'Lock',
    allowedRoles: ['SUB']
  },
  'neue_erkenntnisse': {
    component: NeueErkenntnisseForm,
    title: 'Neue Erkenntnis',
    description: 'Teile eine neue Erkenntnis oder Lernmoment',
    category: 'entity',
    icon: 'Lightbulb',
    allowedRoles: ['SUB']
  },
  'rueckfaelle': {
    component: RueckfaelleForm,
    title: 'Rückfall dokumentieren',
    description: 'Dokumentiere einen Rückfall für Analyse und Verbesserung',
    category: 'entity',
    icon: 'AlertTriangle',
    allowedRoles: ['SUB']
  },
  'strafen': {
    component: StrafenForm,
    title: 'Strafe dokumentieren',
    description: 'Dokumentiere eine Strafe oder Disziplinarmaßnahme',
    category: 'entity',
    icon: 'Zap',
    allowedRoles: ['DOM']
  },
  'tpe': {
    component: TpeForm,
    title: 'TPE Eintrag',
    description: 'Dokumentiere TPE-bezogene Aktivitäten',
    category: 'entity',
    icon: 'Crown',
    allowedRoles: ['DOM', 'SUB']
  },
  'trigger': {
    component: TriggerForm,
    title: 'Trigger dokumentieren',
    description: 'Dokumentiere Trigger und Reaktionen',
    category: 'entity',
    icon: 'AlertCircle',
    allowedRoles: ['SUB']
  },
  
  // System forms
  'neue_stufe': {
    component: StufenForm,
    title: 'Neue Stufe',
    description: 'Erstelle eine neue Stufe im Stufenplan',
    category: 'system',
    icon: 'TrendingUp',
    allowedRoles: ['DOM']
  },
  'initiationsriten': {
    component: InitiationsritenForm,
    title: 'Initiationsritus',
    description: 'Erstelle einen neuen Initiationsritus',
    category: 'system',
    icon: 'Award',
    allowedRoles: ['DOM']
  },
  'privilegien': {
    component: PrivilegienForm,
    title: 'Privileg',
    description: 'Erstelle ein neues Privileg',
    category: 'system',
    icon: 'Gift',
    allowedRoles: ['DOM']
  }
};

/**
 * Form component props interface
 */
export interface FormComponentProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

/**
 * Loading component for lazy-loaded forms
 */
const FormSkeleton: React.FC = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

/**
 * Dynamic form loader component
 */
export const FormLoader: React.FC<{
  formType: FormType;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}> = ({ formType, data, onChange, onSubmit, onCancel }) => {
  const config = FORM_REGISTRY[formType];
  
  if (!config) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Form type "{formType}" not found</p>
      </div>
    );
  }
  
  const FormComponent = config.component;
  
  return (
    <Suspense fallback={<FormSkeleton />}>
      <FormComponent 
        data={data}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Suspense>
  );
};

/**
 * Get form configuration by type
 */
export const getFormConfig = (formType: FormType): FormConfig | null => {
  return FORM_REGISTRY[formType] || null;
};

/**
 * Get available forms for user role
 */
export const getAvailableFormsForRole = (userRole: 'DOM' | 'SUB' | 'OBSERVER'): Array<{
  type: FormType;
  config: FormConfig;
}> => {
  return Object.entries(FORM_REGISTRY)
    .filter(([_, config]) => !config.allowedRoles || config.allowedRoles.includes(userRole))
    .map(([type, config]) => ({
      type: type as FormType,
      config
    }));
};

/**
 * Get forms by category
 */
export const getFormsByCategory = (category: FormConfig['category']): Array<{
  type: FormType;
  config: FormConfig;
}> => {
  return Object.entries(FORM_REGISTRY)
    .filter(([_, config]) => config.category === category)
    .map(([type, config]) => ({
      type: type as FormType,
      config
    }));
};