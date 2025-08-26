/**
 * Form Bottom Component
 * 
 * Bottom section with save/cancel buttons - shown only when form type is selected
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormType } from '../types/formTypes';
import { Save, X } from 'lucide-react';

interface FormBottomProps {
  formType: FormType;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function FormBottom({ formType, data, onSubmit, onCancel, isSubmitting }: FormBottomProps) {
  const getSubmitButtonText = () => {
    switch (formType) {
      // German form types (primary system)
      case 'allgemeine_informationen':
        return 'Information speichern';
      case 'aufgaben':
        return 'Aufgabe erstellen';
      case 'faq':
        return 'FAQ speichern';
      case 'geist':
        return 'Eintrag speichern';
      case 'initiationsriten':
        return 'Ritual erstellen';
      case 'keuschheit':
        return 'Eintrag dokumentieren';
      case 'neue_erkenntnisse':
        return 'Erkenntnis speichern';
      case 'neue_stufe':
        return 'Stufe erstellen';
      case 'privilegien':
        return 'Privileg erstellen';
      case 'regeln':
        return 'Regel erstellen';
      case 'rueckfaelle':
        return 'Rückfall dokumentieren';
      case 'strafen':
        return 'Strafe dokumentieren';
      case 'stufen':
        return 'Eintrag erstellen';
      case 'tpe':
        return 'TPE Eintrag speichern';
      case 'trigger':
        return 'Trigger dokumentieren';
      case 'ziele':
        return 'Ziel erstellen';
      
      // Legacy English form types (backward compatibility)
      case 'task':
        return 'Aufgabe erstellen';
      case 'note':
        return 'Notiz speichern';
      case 'rule':
        return 'Regel erstellen';
      case 'punishment':
        return 'Strafe dokumentieren';
      case 'reward':
        return 'Belohnung vergeben';
      case 'appointment':
        return 'Termin erstellen';
      case 'achievement':
        return 'Achievement speichern';
      default:
        return 'Speichern';
    }
  };

  const isSubmitDisabled = () => {
    // Handle special case for stage form which uses 'stageName' instead of 'title'
    if (formType === 'neue_stufe') {
      return !data.stageName || data.stageName.trim().length === 0 || isSubmitting;
    }
    
    // Basic validation - require title for most forms
    return !data.title || data.title.trim().length === 0 || isSubmitting;
  };

  return (
    <Card className="border-0 rounded-none shadow-none border-t">
      <CardContent className="pt-4">
        {/* Main action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" />
            Abbrechen
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitDisabled()}
            className="bg-red-600 hover:bg-red-700"
          >
            <Save className="h-4 w-4 mr-1" />
            {getSubmitButtonText()}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}