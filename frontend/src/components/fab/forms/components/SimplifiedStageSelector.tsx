/**
 * Simplified Stage Selector Component
 * 
 * Single dropdown for stage assignment with auto-inheritance logic
 */

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { stageService } from '@/services/stageService';
import { toast } from 'sonner';

interface SimplifiedStageSelectorProps {
  activeFromStage: number | null;
  onActiveFromStageChange: (stage: number | null) => void;
  currentUserStage?: number;
}

interface Stage {
  id: string;
  stageNumber: number;
  name: string;
  pointsRequired: number;
  color?: string;
}

export function SimplifiedStageSelector({ 
  activeFromStage, 
  onActiveFromStageChange,
  currentUserStage = 1
}: SimplifiedStageSelectorProps) {
  const [availableStages, setAvailableStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableStages();
  }, []);

  const loadAvailableStages = async () => {
    try {
      setLoading(true);
      const stages = await stageService.getAllStages();
      
      // Ensure Stufe 0 and Stufe 1 are always available
      const baseStages: Stage[] = [
        { id: 'base-0', stageNumber: 0, name: 'Grundstufe', pointsRequired: 0 },
        { id: 'base-1', stageNumber: 1, name: 'Anfängerstufe', pointsRequired: 0 }
      ];
      
      // Merge base stages with loaded stages, avoiding duplicates
      const allStages = [...baseStages];
      stages.forEach(stage => {
        if (stage.stageNumber > 1) {
          allStages.push(stage);
        } else if (stage.stageNumber === 0 || stage.stageNumber === 1) {
          // Replace base stage with actual stage data
          const index = allStages.findIndex(s => s.stageNumber === stage.stageNumber);
          if (index >= 0) {
            allStages[index] = stage;
          }
        }
      });
      
      // Sort by stage number
      allStages.sort((a, b) => a.stageNumber - b.stageNumber);
      setAvailableStages(allStages);
    } catch (error) {
      console.error('Error loading stages:', error);
      // Fallback to base stages only
      setAvailableStages([
        { id: 'base-0', stageNumber: 0, name: 'Grundstufe', pointsRequired: 0 },
        { id: 'base-1', stageNumber: 1, name: 'Anfängerstufe', pointsRequired: 0 }
      ]);
      toast.error('Fehler beim Laden der Stufen - Grundstufen verfügbar');
    } finally {
      setLoading(false);
    }
  };

  const getStageDisplay = (stage: Stage) => {
    return `Stufe ${stage.stageNumber}: ${stage.name}`;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Stufen-Zuordnung</Label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="activeFromStage" className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Aktiv ab Stufe
        </Label>
        <Select 
          value={activeFromStage?.toString() || ''} 
          onValueChange={(value) => onActiveFromStageChange(value ? parseInt(value) : null)}
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
      </div>

      {/* Auto-inheritance Info */}
      {activeFromStage && (
        <div className="p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">Automatische Vererbung</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Dieses Ziel wird automatisch an alle höheren Stufen (ab Stufe {activeFromStage}) weitervererbt 
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
  );
}