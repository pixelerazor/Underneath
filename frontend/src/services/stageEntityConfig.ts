/**
 * Stage Entity Configuration System
 * 
 * Object-oriented approach for managing stage-based entities.
 * Allows easy extension of stage features through configuration.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { LucideIcon, Crown, Gift, Zap, Heart } from 'lucide-react';

export interface StageEntityFeature {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description?: string;
  isEnabled: boolean;
  formFields?: StageFormField[];
  validationRules?: ValidationRule[];
  displayRules?: DisplayRule[];
}

export interface StageFormField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'date' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: any;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}

export interface DisplayRule {
  condition: string;
  action: 'show' | 'hide' | 'enable' | 'disable';
  targets: string[];
}

/**
 * Central configuration class for stage entities
 * This is the single source of truth for all stage-related features
 */
export class StageEntityConfig {
  private static instance: StageEntityConfig;
  
  // Core stage features - easily extensible
  private readonly features: Map<string, StageEntityFeature> = new Map([
    
    ['initiationsriten', {
      id: 'initiationsriten',
      label: 'Initiationsriten',
      icon: Crown,
      color: 'text-yellow-600',
      description: 'Zeremonien und Rituale für Stufenaufstiege',
      isEnabled: true,
      formFields: [
        { name: 'title', type: 'text', label: 'Ritual Name', required: true, placeholder: 'Name des Initiationsritus' },
        { name: 'description', type: 'textarea', label: 'Beschreibung', placeholder: 'Detaillierte Beschreibung des Rituals' },
        { name: 'requiredStage', type: 'number', label: 'Erforderliche Stufe', required: true, min: 1, max: 10 },
        { name: 'duration', type: 'number', label: 'Dauer (Minuten)', min: 1, defaultValue: 30 },
        { name: 'isRepeatable', type: 'checkbox', label: 'Wiederholbar', defaultValue: false }
      ],
      validationRules: [
        { field: 'title', rule: 'required', message: 'Ritual Name ist erforderlich' },
        { field: 'requiredStage', rule: 'required', message: 'Stufe muss angegeben werden' },
        { field: 'requiredStage', rule: 'min', value: 1, message: 'Stufe muss mindestens 1 sein' }
      ]
    }],
    
    ['privilegien', {
      id: 'privilegien',
      label: 'Privilegien',
      icon: Gift,
      color: 'text-emerald-600',
      description: 'Besondere Rechte und Freiheiten',
      isEnabled: true,
      formFields: [
        { name: 'title', type: 'text', label: 'Privileg Name', required: true, placeholder: 'Name des Privilegs' },
        { name: 'description', type: 'textarea', label: 'Beschreibung', placeholder: 'Was beinhaltet dieses Privileg?' },
        { name: 'category', type: 'select', label: 'Kategorie', required: true, options: [
          { value: 'freedom', label: 'Freiheit' },
          { value: 'access', label: 'Zugang' },
          { value: 'permission', label: 'Erlaubnis' },
          { value: 'reward', label: 'Belohnung' }
        ]},
        { name: 'fromStage', type: 'number', label: 'Ab Stufe', required: true, min: 1, max: 10 },
        { name: 'pointsCost', type: 'number', label: 'Kosten in Punkten', min: 0, defaultValue: 0 }
      ]
    }],
    
    ['strafen', {
      id: 'strafen',
      label: 'Strafen',
      icon: Zap,
      color: 'text-red-600',
      description: 'Konsequenzen bei Regelverstößen',
      isEnabled: true,
      formFields: [
        { name: 'title', type: 'text', label: 'Strafe Name', required: true, placeholder: 'Name der Strafe' },
        { name: 'description', type: 'textarea', label: 'Beschreibung', placeholder: 'Detaillierte Beschreibung der Strafe' },
        { name: 'severity', type: 'select', label: 'Schweregrad', required: true, options: [
          { value: 'light', label: 'Leicht' },
          { value: 'medium', label: 'Mittel' },
          { value: 'severe', label: 'Schwer' }
        ]},
        { name: 'pointsPenalty', type: 'number', label: 'Punktabzug', required: true, min: 1, max: 100 },
        { name: 'duration', type: 'number', label: 'Dauer (Stunden)', min: 1 }
      ]
    }],
    
    ['tpe', {
      id: 'tpe',
      label: 'TPE Elemente',
      icon: Heart,
      color: 'text-rose-600',
      description: 'Total Power Exchange Komponenten',
      isEnabled: true,
      formFields: [
        { name: 'title', type: 'text', label: 'TPE Element', required: true, placeholder: 'Name des TPE Elements' },
        { name: 'description', type: 'textarea', label: 'Beschreibung', placeholder: 'Beschreibung des TPE Elements' },
        { name: 'intensity', type: 'select', label: 'Intensität', required: true, options: [
          { value: 'low', label: 'Niedrig' },
          { value: 'medium', label: 'Mittel' },
          { value: 'high', label: 'Hoch' },
          { value: 'extreme', label: 'Extrem' }
        ]},
        { name: 'requiredStage', type: 'number', label: 'Erforderliche Stufe', required: true, min: 1, max: 10 },
        { name: 'consentLevel', type: 'select', label: 'Einverständnis-Level', required: true, options: [
          { value: 'explicit', label: 'Explizit erforderlich' },
          { value: 'implied', label: 'Stillschweigend' },
          { value: 'blanket', label: 'Generell erteilt' }
        ]}
      ]
    }]
  ]);

  static getInstance(): StageEntityConfig {
    if (!StageEntityConfig.instance) {
      StageEntityConfig.instance = new StageEntityConfig();
    }
    return StageEntityConfig.instance;
  }

  private constructor() {}

  /**
   * Get all enabled features for the stage system
   */
  getEnabledFeatures(): StageEntityFeature[] {
    return Array.from(this.features.values()).filter(feature => feature.isEnabled);
  }

  /**
   * Get a specific feature by ID
   */
  getFeature(id: string): StageEntityFeature | undefined {
    return this.features.get(id);
  }

  /**
   * Add a new feature to the stage system
   * This is where you would add new features in the future
   */
  addFeature(feature: StageEntityFeature): void {
    this.features.set(feature.id, feature);
  }

  /**
   * Enable/disable a feature
   */
  toggleFeature(id: string, enabled: boolean): void {
    const feature = this.features.get(id);
    if (feature) {
      feature.isEnabled = enabled;
    }
  }

  /**
   * Get form configuration for a specific feature
   */
  getFormConfig(featureId: string): StageFormField[] {
    const feature = this.features.get(featureId);
    return feature?.formFields || [];
  }

  /**
   * Get validation rules for a specific feature
   */
  getValidationRules(featureId: string): ValidationRule[] {
    const feature = this.features.get(featureId);
    return feature?.validationRules || [];
  }

  /**
   * Get statistics configuration for dashboard
   */
  getStatisticsConfig(): { id: string; label: string; icon: LucideIcon; color: string }[] {
    return this.getEnabledFeatures().map(feature => ({
      id: feature.id,
      label: feature.label,
      icon: feature.icon,
      color: feature.color
    }));
  }

  /**
   * Get FAB form types for stage entities
   */
  getFABFormTypes(): { id: string; label: string; description: string }[] {
    return this.getEnabledFeatures().map(feature => ({
      id: feature.id,
      label: feature.label,
      description: `${feature.label} erstellen`
    }));
  }

  /**
   * Validate form data for a specific feature
   */
  validateFormData(featureId: string, data: Record<string, any>): { isValid: boolean; errors: string[] } {
    const rules = this.getValidationRules(featureId);
    const errors: string[] = [];

    rules.forEach(rule => {
      const value = data[rule.field];
      
      switch (rule.rule) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors.push(rule.message);
          }
          break;
        case 'min':
          if (typeof value === 'number' && value < rule.value) {
            errors.push(rule.message);
          }
          break;
        case 'max':
          if (typeof value === 'number' && value > rule.value) {
            errors.push(rule.message);
          }
          break;
        case 'custom':
          if (rule.customValidator && !rule.customValidator(value)) {
            errors.push(rule.message);
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const stageEntityConfig = StageEntityConfig.getInstance();