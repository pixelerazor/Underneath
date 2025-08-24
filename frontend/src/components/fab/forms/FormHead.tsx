/**
 * Form Head Component
 * 
 * Always visible header section where users select the form type
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormType, FORM_TYPES } from '../types/formTypes';

interface FormHeadProps {
  selectedFormType: FormType | null;
  onFormTypeChange: (formType: FormType) => void;
}

export function FormHead({ selectedFormType, onFormTypeChange }: FormHeadProps) {
  return (
    <Card className="border-0 rounded-none shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Neuen Eintrag erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label className="text-sm font-medium">Was möchtest du erstellen?</label>
          <Select
            value={selectedFormType || ''}
            onValueChange={(value) => onFormTypeChange(value as FormType)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Typ auswählen..." />
            </SelectTrigger>
            <SelectContent>
              {FORM_TYPES.map((formType) => (
                <SelectItem key={formType.id} value={formType.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{formType.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {formType.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}