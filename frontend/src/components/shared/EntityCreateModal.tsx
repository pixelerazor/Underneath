/**
 * Entity Create Modal Component
 * 
 * Modal wrapper for entity creation forms triggered by long-press
 * Reuses existing IndexForm components with contextual pre-filling
 * 
 * @author Underneath Team  
 * @version 1.0.0
 */

import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { IndexForm } from '@/components/fab/IndexForm';
import { FormType } from '@/components/fab/types/formTypes';

export interface EntityContext {
  entityType: 'tasks' | 'rules' | 'goals';
  stageId?: string;
  stageName?: string;
  stageNumber?: number;
  defaultValues?: Record<string, any>;
}

interface EntityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: EntityContext | null;
}

export function EntityCreateModal({ isOpen, onClose, context }: EntityCreateModalProps) {
  if (!context) return null;

  // Map entity types to form types
  const getFormType = (entityType: string): FormType => {
    switch (entityType) {
      case 'tasks':
        return 'aufgaben';
      case 'rules':
        return 'regeln';
      case 'goals':
        return 'ziele';
      default:
        return 'aufgaben';
    }
  };

  const getModalTitle = (entityType: string): string => {
    switch (entityType) {
      case 'tasks':
        return 'Neue Aufgabe erstellen';
      case 'rules':
        return 'Neue Regel erstellen';
      case 'goals':
        return 'Neues Ziel erstellen';
      default:
        return 'Neuen Eintrag erstellen';
    }
  };

  const getModalDescription = (entityType: string, stageName?: string): string => {
    const stageContext = stageName ? ` für Stufe "${stageName}"` : '';
    
    switch (entityType) {
      case 'tasks':
        return `Erstelle eine neue Aufgabe${stageContext}. Alle Felder können nach der Erstellung bearbeitet werden.`;
      case 'rules':
        return `Definiere eine neue Regel${stageContext}. Lege Strafen und Bedingungen fest.`;
      case 'goals':
        return `Setze ein neues Ziel${stageContext}. Definiere Belohnungen und Deadlines.`;
      default:
        return `Erstelle einen neuen Eintrag${stageContext}.`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <div className="p-6 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {getModalTitle(context.entityType)}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {getModalDescription(context.entityType, context.stageName)}
          </DialogDescription>
          
          {/* Context Info */}
          {context.stageName && (
            <div className="mt-3 p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Zugeordnet zu:</span>
                <span>{context.stageName}</span>
                {context.stageNumber && (
                  <span className="text-muted-foreground">(Stufe {context.stageNumber})</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <EntityCreateFormWrapper
            formType={getFormType(context.entityType)}
            context={context}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component to handle context-aware form initialization
interface EntityCreateFormWrapperProps {
  formType: FormType;
  context: EntityContext;
  onClose: () => void;
}

function EntityCreateFormWrapper({ formType, context, onClose }: EntityCreateFormWrapperProps) {
  return (
    <div className="p-6">
      <IndexForm 
        onClose={onClose}
        initialFormType={formType}
        contextualDefaults={{
          activeFromStage: context.stageNumber || 1,
          stageId: context.stageId,
          ...context.defaultValues
        }}
      />
    </div>
  );
}