/**
 * Form Head Component
 * 
 * Always visible header section where users select the form type
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { FormType, FORM_TYPES } from '../types/formTypes';
import { stageService } from '@/services/stageService';
import { toast } from 'sonner';

interface Stage {
  id: string;
  stageNumber: number;
  name: string;
  pointsRequired: number;
  color?: string;
}

interface FormHeadProps {
  selectedFormType: FormType | null;
  onFormTypeChange: (formType: FormType) => void;
  activeFromStage?: number | null;
  onActiveFromStageChange?: (stage: number | null) => void;
  currentUserStage?: number;
}

export function FormHead({ 
  selectedFormType, 
  onFormTypeChange, 
  activeFromStage, 
  onActiveFromStageChange,
  currentUserStage = 1 
}: FormHeadProps) {
  const [availableStages, setAvailableStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(false);

  // Form types that need stage assignment
  const stageAwareFormTypes = ['ziele', 'aufgaben', 'regeln'];
  const needsStageSelector = selectedFormType && stageAwareFormTypes.includes(selectedFormType);

  useEffect(() => {
    if (needsStageSelector) {
      loadAvailableStages();
    }
  }, [needsStageSelector]);

  const loadAvailableStages = async () => {
    try {
      setLoading(true);
      const stages = await stageService.getAllStages();
      setAvailableStages(stages);
    } catch (error) {
      console.error('Error loading stages:', error);
      toast.error('Fehler beim Laden der Stufen');
    } finally {
      setLoading(false);
    }
  };

  const getStageDisplay = (stage: Stage) => {
    return `Stufe ${stage.stageNumber}: ${stage.name}`;
  };

  return (
    <Card className="border-0 rounded-none shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Neuen Eintrag erstellen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Type Selection */}
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

        {/* Stage Selection - only show for stage-aware form types */}
        {needsStageSelector && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="activeFromStage" className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Aktiv ab Stufe
              </Label>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ) : (
                <Select 
                  value={activeFromStage?.toString() || ''} 
                  onValueChange={(value) => onActiveFromStageChange?.(value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Stufe auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.stageNumber.toString()}>
                        {getStageDisplay(stage)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Auto-inheritance Info */}
            {activeFromStage && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">Automatische Vererbung</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Wird automatisch an alle höheren Stufen (ab Stufe {activeFromStage}) weitervererbt 
                  und bleibt dauerhaft verfügbar.
                </p>
                {activeFromStage <= currentUserStage && (
                  <Badge className="text-xs bg-green-100 text-green-700 mt-2">
                    Aktuell verfügbar
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}