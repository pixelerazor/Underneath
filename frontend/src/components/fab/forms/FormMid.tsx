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
import { StageForm } from './specific/StageForm';
// New German form components
import { AllgemeineInformationenForm } from './specific/AllgemeineInformationenForm';
import { AufgabenForm } from './specific/AufgabenForm';
import { InitiationsritenForm } from './specific/InitiationsritenForm';
import { PrivilegienForm } from './specific/PrivilegienForm';
import { ZieleForm } from './specific/ZieleForm';
import { RegelnForm } from './specific/RegelnForm';
import { FaqForm } from './specific/FaqForm';
import { GeistForm } from './specific/GeistForm';
import { KeuschheitForm } from './specific/KeuschheitForm';
import { NeueErkenntnisseForm } from './specific/NeueErkenntnisseForm';
import { RueckfaelleForm } from './specific/RueckfaelleForm';
import { StrafenForm } from './specific/StrafenForm';
import { StufenForm } from './specific/StufenForm';
import { TpeForm } from './specific/TpeForm';
import { TriggerForm } from './specific/TriggerForm';

interface FormMidProps {
  formType: FormType;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FormMid({ formType, data, onChange }: FormMidProps) {
  const renderFormComponent = () => {
    switch (formType) {
      // German form types (new system)
      case 'allgemeine_informationen':
        return <AllgemeineInformationenForm data={data} onChange={onChange} />;
      case 'aufgaben':
        return <AufgabenForm data={data} onChange={onChange} />;
      case 'faq':
        return <FaqForm data={data} onChange={onChange} />;
      case 'geist':
        return <GeistForm data={data} onChange={onChange} />;
      case 'initiationsriten':
        return <InitiationsritenForm data={data} onChange={onChange} />;
      case 'keuschheit':
        return <KeuschheitForm data={data} onChange={onChange} />;
      case 'neue_erkenntnisse':
        return <NeueErkenntnisseForm data={data} onChange={onChange} />;
      case 'neue_stufe':
        return <StageForm data={data} onChange={onChange} />;
      case 'privilegien':
        return <PrivilegienForm data={data} onChange={onChange} />;
      case 'regeln':
        return <RegelnForm data={data} onChange={onChange} />;
      case 'rueckfaelle':
        return <RueckfaelleForm data={data} onChange={onChange} />;
      case 'strafen':
        return <StrafenForm data={data} onChange={onChange} />;
      case 'stufen':
        return <StufenForm data={data} onChange={onChange} />;
      case 'tpe':
        return <TpeForm data={data} onChange={onChange} />;
      case 'trigger':
        return <TriggerForm data={data} onChange={onChange} />;
      case 'ziele':
        return <ZieleForm data={data} onChange={onChange} />;
        
      // Legacy English form types (backward compatibility)
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
            <p>Formular für "<strong>{formType}</strong>" ist noch nicht implementiert.</p>
            <p className="text-xs mt-2">Alle definierten Formulare sind bereits verfügbar.</p>
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