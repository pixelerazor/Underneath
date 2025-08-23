/**
 * Form Progress Component
 * 
 * Progress indicator for multi-step registration forms
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  userRole: 'DOM' | 'SUB';
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  userRole
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">
          {userRole} Registrierung
        </h2>
        <Badge variant="outline">
          Schritt {currentStep + 1} von {totalSteps}
        </Badge>
      </div>
      
      <Progress value={progress} className="mb-3" />
      
      <div className="text-sm text-muted-foreground mb-2">
        <strong>Aktueller Schritt:</strong> {stepTitles[currentStep]}
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {stepTitles.map((title, index) => (
          <div 
            key={index} 
            className={`flex-1 text-center px-1 ${
              index === currentStep 
                ? 'text-primary font-medium' 
                : index < currentStep 
                  ? 'text-green-600' 
                  : 'text-muted-foreground'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
              index === currentStep 
                ? 'bg-primary' 
                : index < currentStep 
                  ? 'bg-green-600' 
                  : 'bg-muted'
            }`} />
            <div className="truncate">
              {title.split(' ')[0]}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};