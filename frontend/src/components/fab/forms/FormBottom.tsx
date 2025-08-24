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
}

export function FormBottom({ formType, data, onSubmit, onCancel }: FormBottomProps) {
  const getSubmitButtonText = () => {
    switch (formType) {
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
    // Basic validation - require title for most forms
    return !data.title || data.title.trim().length === 0;
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