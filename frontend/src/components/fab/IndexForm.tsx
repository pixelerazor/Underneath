/**
 * Index Form Component
 * 
 * Main form container with Head, Mid, and Bottom sections
 * The Mid and Bottom sections change based on Head selection
 */

import React, { useState } from 'react';
import { FormHead } from './forms/FormHead';
import { FormMid } from './forms/FormMid';
import { FormBottom } from './forms/FormBottom';
import { FormType } from './types/formTypes';

interface IndexFormProps {
  onClose: () => void;
}

export function IndexForm({ onClose }: IndexFormProps) {
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFormTypeChange = (formType: FormType) => {
    setSelectedFormType(formType);
    // Reset form data when changing type
    setFormData({});
  };

  const handleDataChange = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      // Handle form submission based on selectedFormType
      console.log('Submitting form:', { type: selectedFormType, data: formData });
      
      // TODO: Implement actual submission logic
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Head Section - Always visible */}
      <FormHead
        selectedFormType={selectedFormType}
        onFormTypeChange={handleFormTypeChange}
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
        />
      )}
    </div>
  );
}