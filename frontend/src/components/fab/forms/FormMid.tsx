/**
 * Form Mid Component
 * 
 * Dynamic middle section that uses FormRegistry for centralized form loading
 * Uses lazy-loaded components for better performance
 */

import React from 'react';
import { FormType } from '../types/formTypes';
import { FormLoader } from '../../forms/FormRegistry';

interface FormMidProps {
  formType: FormType;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FormMid({ formType, data, onChange }: FormMidProps) {
  return (
    <div className="border-t">
      <FormLoader 
        formType={formType}
        data={data}
        onChange={onChange}
      />
    </div>
  );
}