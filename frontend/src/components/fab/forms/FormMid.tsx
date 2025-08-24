/**
 * Form Mid Component
 * 
 * Dynamic middle section that loads different form components
 * based on the selected form type from FormHead
 */

import React from 'react';
import { FormType } from '../types/formTypes';

// Import specific form components
import { TaskForm } from './specific/TaskForm';
import { NoteForm } from './specific/NoteForm';
import { RuleForm } from './specific/RuleForm';
import { PunishmentForm } from './specific/PunishmentForm';
import { RewardForm } from './specific/RewardForm';
import { AppointmentForm } from './specific/AppointmentForm';
import { AchievementForm } from './specific/AchievementForm';

interface FormMidProps {
  formType: FormType;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FormMid({ formType, data, onChange }: FormMidProps) {
  const renderFormComponent = () => {
    switch (formType) {
      case 'task':
        return <TaskForm data={data} onChange={onChange} />;
      case 'note':
        return <NoteForm data={data} onChange={onChange} />;
      case 'rule':
        return <RuleForm data={data} onChange={onChange} />;
      case 'punishment':
        return <PunishmentForm data={data} onChange={onChange} />;
      case 'reward':
        return <RewardForm data={data} onChange={onChange} />;
      case 'appointment':
        return <AppointmentForm data={data} onChange={onChange} />;
      case 'achievement':
        return <AchievementForm data={data} onChange={onChange} />;
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Formular für "{formType}" wird geladen...
          </div>
        );
    }
  };

  return (
    <div className="border-t">
      {renderFormComponent()}
    </div>
  );
}