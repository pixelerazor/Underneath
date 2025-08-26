/**
 * Index Form Component
 * 
 * Main form container with Head, Mid, and Bottom sections
 * The Mid and Bottom sections change based on Head selection
 * Now integrated with EntityRegistry for stage-aware entity management
 */

import React, { useState, useEffect } from 'react';
import { FormHead } from './forms/FormHead';
import { FormMid } from './forms/FormMid';
import { FormBottom } from './forms/FormBottom';
import { FormType } from './types/formTypes';
import { entityRegistry, EntityType, EntityCreateData } from '../../services/entityRegistry';
import { useAuthStore } from '../../store/useAuthStore';

// Import new API services
import { faqService } from '../../services/faqService';
import { stageService } from '../../services/stageService';
import { apiClient } from '../../services/apiClient';
import { geistService } from '../../services/geistService';
import { keuschheitService } from '../../services/keuschheitService';
import { erkenntnisseService } from '../../services/erkenntnisseService';
import { rueckfallService } from '../../services/rueckfallService';
import { strafenService } from '../../services/strafenService';
import { tpeService } from '../../services/tpeService';
import { triggerService } from '../../services/triggerService';
import { allgemeineInformationenService } from '../../services/allgemeineInformationenService';
import { toast } from 'sonner';

interface IndexFormProps {
  onClose: () => void;
  initialFormType?: FormType;
  contextualDefaults?: Record<string, any>;
}

export function IndexForm({ onClose, initialFormType, contextualDefaults = {} }: IndexFormProps) {
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(initialFormType || null);
  const [formData, setFormData] = useState<Record<string, any>>(contextualDefaults);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const { user } = useAuthStore();

  // Load user's current stage on component mount (updated API paths)
  useEffect(() => {
    const loadUserStage = async () => {
      try {
        const stageInfo = await entityRegistry.getUserStageInfo();
        setCurrentStage(stageInfo.pointAccount.currentStage);
      } catch (error) {
        console.warn('Could not load user stage info:', error);
        // Fallback to stage 1 if unable to load
        setCurrentStage(1);
      }
    };

    if (user) {
      loadUserStage();
    }
  }, [user]);

  const handleFormTypeChange = (formType: FormType) => {
    setSelectedFormType(formType);
    // Reset form data when changing type
    setFormData({});
  };

  const handleDataChange = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const getEntityTypeFromFormType = (formType: FormType): EntityType | null => {
    switch (formType) {
      case 'aufgaben':
        return 'TASK';
      case 'regeln':
        return 'RULE';
      case 'ziele':
        return 'GOAL';
      default:
        return null;
    }
  };

  const transformFormDataToEntity = (formType: FormType, data: Record<string, any>): EntityCreateData => {
    const entityType = getEntityTypeFromFormType(formType);
    
    // Base data that all entities need
    const baseData: EntityCreateData = {
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'general',
      activeFromStage: data.activeFromStage || currentStage, // Use specified or default to current stage
      activeToStage: data.activeToStage || null, // Optional end stage
    };

    // Add type-specific fields
    switch (entityType) {
      case 'TASK':
        return {
          ...baseData,
          priority: data.priority || 'MEDIUM',
          pointsReward: data.pointsReward || 10,
          dueDate: data.dueDate,
          assignedToId: data.assignedToId,
        };
      case 'RULE':
        return {
          ...baseData,
          priority: data.severity || 'MEDIUM', // Map severity to priority
          pointsPenalty: Math.abs(data.pointsPenalty || -10),
          applicableToId: data.applicableToId,
        };
      case 'GOAL':
        return {
          ...baseData,
          priority: data.priority || 'MEDIUM',
          pointsReward: data.pointsReward || 50,
          targetValue: data.targetValue,
          deadline: data.deadline,
          assignedToId: data.assignedToId,
        };
      default:
        return baseData;
    }
  };

  const handleNewEntitySubmission = async (formType: FormType, data: Record<string, any>) => {
    try {
      switch (formType) {
        case 'faq':
          const faq = await faqService.createFAQ({
            question: data.question || data.title,
            answer: data.answer || data.description,
            category: data.category,
            priority: data.priority || 'medium',
            tags: data.tags || [],
            isPublic: data.isPublic !== false
          });
          toast.success('FAQ erfolgreich erstellt!');
          break;

        case 'geist':
          const wellbeing = await geistService.createEntry({
            title: data.title,
            description: data.description,
            mood: data.mood || 5,
            energy: data.energy || 5,
            category: data.category,
            triggers: data.triggers,
            duration: data.duration,
            notes: data.notes
          });
          toast.success('Geist-Eintrag erfolgreich erstellt!');
          break;

        case 'keuschheit':
          const chastity = await keuschheitService.createEntry({
            title: data.title,
            type: data.type,
            duration: data.duration,
            device: data.device,
            description: data.description,
            intensity: data.intensity,
            satisfaction: data.satisfaction,
            wasPlanned: data.wasPlanned || false,
            wasPermission: data.wasPermission || false,
            wasReward: data.wasReward || false,
            wasPunishment: data.wasPunishment || false,
            notes: data.notes
          });
          toast.success('Keuschheit-Eintrag erfolgreich erstellt!');
          break;

        case 'neue_erkenntnisse':
          const insight = await erkenntnisseService.createEntry({
            title: data.title,
            insight: data.insight || data.description,
            context: data.context,
            category: data.category,
            importance: data.importance || 'medium',
            clarity: data.clarity,
            application: data.application,
            relatedTo: data.relatedTo
          });
          toast.success('Erkenntnis erfolgreich erstellt!');
          break;

        case 'rueckfaelle':
          const relapse = await rueckfallService.createEntry({
            title: data.title,
            type: data.type,
            severity: data.severity || 'medium',
            triggers: data.triggers,
            description: data.description,
            duration: data.duration,
            pointsPenalty: data.pointsPenalty,
            emotions: data.emotions,
            wasReported: data.wasReported || false,
            wasIntentional: data.wasIntentional || false,
            requiresAction: data.requiresAction || false,
            hasConsequences: data.hasConsequences || false,
            prevention: data.prevention,
            lessons: data.lessons
          });
          toast.success('Rückfall erfolgreich dokumentiert!');
          break;

        case 'strafen':
          if (!data.userId) {
            throw new Error('Benutzer-ID ist erforderlich für Strafen');
          }
          const punishment = await strafenService.createEntry({
            title: data.title,
            reason: data.reason,
            userId: data.userId,
            description: data.description,
            severity: data.severity,
            category: data.category,
            duration: data.duration,
            intensity: data.intensity,
            tools: data.tools,
            isCompleted: data.isCompleted || false,
            wasEffective: data.wasEffective || false,
            wasConsensual: data.wasConsensual !== false,
            requiresFollowup: data.requiresFollowup || false,
            reaction: data.reaction,
            effectiveness: data.effectiveness
          });
          toast.success('Strafe erfolgreich erstellt!');
          break;

        case 'tpe':
          const tpe = await tpeService.createEntry({
            title: data.title,
            type: data.type,
            description: data.description,
            duration: data.duration,
            intensity: data.intensity,
            context: data.context,
            compliance: data.compliance,
            satisfaction: data.satisfaction,
            wasInitiated: data.wasInitiated || false,
            wasSuccessful: data.wasSuccessful !== false,
            hadResistance: data.hadResistance || false,
            requiresFollowup: data.requiresFollowup || false,
            emotions: data.emotions,
            lessons: data.lessons,
            improvements: data.improvements
          });
          toast.success('TPE-Eintrag erfolgreich erstellt!');
          break;

        case 'trigger':
          const trigger = await triggerService.createEntry({
            title: data.title,
            type: data.type,
            description: data.description,
            intensity: data.intensity,
            frequency: data.frequency,
            response: data.response,
            context: data.context,
            emotions: data.emotions,
            physicalReaction: data.physicalReaction,
            wasExpected: data.wasExpected || false,
            wasManaged: data.wasManaged || false,
            causedRelapse: data.causedRelapse || false,
            isRecurring: data.isRecurring || false,
            copingStrategies: data.copingStrategies,
            prevention: data.prevention
          });
          toast.success('Trigger erfolgreich dokumentiert!');
          break;

        case 'allgemeine_informationen':
          const info = await allgemeineInformationenService.createEntry({
            title: data.title,
            content: data.content || data.description,
            category: data.category,
            priority: data.priority || 'medium',
            isPublic: data.isPublic !== false,
            tags: data.tags || []
          });
          toast.success('Information erfolgreich erstellt!');
          break;

        case 'neue_stufe':
          const stage = await stageService.createStage({
            stageNumber: parseInt(data.stageNumber) || 1,
            name: data.stageName,
            description: data.description,
            pointsRequired: parseInt(data.pointsStart) || 0,
            color: data.colorTheme
          });
          toast.success('Stufe erfolgreich erstellt!');
          break;

        default:
          console.log('Unhandled form type:', formType);
          toast.info('Diese Funktion wird noch implementiert.');
      }
    } catch (error: any) {
      console.error(`Error creating ${formType}:`, error);
      throw error; // Re-throw to be caught by handleSubmit
    }
  };

  const handleDirectRuleCreation = async (data: Record<string, any>) => {
    try {
      const ruleData = {
        title: data.title,
        description: data.description,
        category: data.category || 'BEHAVIOR',
        severity: data.severity || 'MEDIUM',
        pointsPenalty: parseInt(data.pointsPenalty) || 10,
        activeFromStage: data.activeFromStage || currentStage,
        activeToStage: data.activeToStage || null,
        applicableToId: data.applicableToId || null
      };

      const response = await apiClient.post('/rules', ruleData);
      toast.success('Regel erfolgreich erstellt!');
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating rule:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Handle special case for stage form which uses 'stageName' instead of 'title'
    const hasRequiredData = selectedFormType === 'neue_stufe' 
      ? formData.stageName && formData.stageName.trim().length > 0
      : formData.title && formData.title.trim().length > 0;
    
    if (!selectedFormType || !hasRequiredData) {
      console.error('Missing required form data');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const entityType = getEntityTypeFromFormType(selectedFormType);
      let createdEntity = null;
      
      if (entityType) {
        // Handle stage-system entities through direct API calls
        if (entityType === 'RULE') {
          createdEntity = await handleDirectRuleCreation(formData);
        } else {
          // Use EntityRegistry for other types
          const entityData = transformFormDataToEntity(selectedFormType, formData);
          createdEntity = await entityRegistry.createEntity(entityType, entityData);
        }
        
        console.log(`Created ${entityType}:`, createdEntity);
        
        // Show success feedback
        toast.success(`${entityType === 'TASK' ? 'Aufgabe' : entityType === 'RULE' ? 'Regel' : 'Ziel'} erfolgreich erstellt!`);
      } else {
        // Handle new form entities with direct API calls
        await handleNewEntitySubmission(selectedFormType, formData);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Fehler beim Erstellen. Bitte versuchen Sie es erneut.';
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Head Section - Always visible */}
      <FormHead
        selectedFormType={selectedFormType}
        onFormTypeChange={handleFormTypeChange}
        activeFromStage={formData.activeFromStage}
        onActiveFromStageChange={(stage) => handleDataChange({ activeFromStage: stage })}
        currentUserStage={currentStage}
      />

      {/* Mid Section - Dynamic based on Head selection */}
      {selectedFormType && (
        <FormMid
          formType={selectedFormType}
          data={formData}
          onChange={handleDataChange}
        />
      )}

      {/* Bottom Section - Dynamic based on Head selection */}
      {selectedFormType && (
        <FormBottom
          formType={selectedFormType}
          data={formData}
          onChange={handleDataChange}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}