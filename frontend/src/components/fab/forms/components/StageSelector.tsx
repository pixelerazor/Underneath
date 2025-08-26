/**
 * Stage Selector Component
 * 
 * Reusable component for selecting stages to link entities to the tree system
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Layers, Info } from 'lucide-react';
import { stageService } from '@/services/stageService';
import { toast } from 'sonner';

interface StageSelectorProps {
  activeFromStage: number | null;
  activeToStage: number | null;
  onActiveFromStageChange: (stage: number | null) => void;
  onActiveToStageChange: (stage: number | null) => void;
  currentUserStage?: number;
}

interface Stage {
  id: string;
  stageNumber: number;
  name: string;
  pointsRequired: number;
  color?: string;
}

export function StageSelector({ 
  activeFromStage, 
  activeToStage, 
  onActiveFromStageChange, 
  onActiveToStageChange,
  currentUserStage = 1
}: StageSelectorProps) {
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
    return `Stufe ${stage.stageNumber}: ${stage.name} (${stage.pointsRequired} Punkte)`;
  };

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-blue-700">
            <Layers className="h-4 w-4" />
            Stufen-Zuordnung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-blue-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-blue-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-blue-700">
          <Layers className="h-4 w-4" />
          Stufen-Zuordnung für Tree-System
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Info className="h-3 w-3" />
          <span>Bestimmt, in welchen Stufen diese Entität sichtbar ist</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="activeFromStage" className="text-sm font-medium">
              Aktiv ab Stufe *
            </Label>
            <Select 
              value={activeFromStage?.toString() || ''} 
              onValueChange={(value) => onActiveFromStageChange(value ? parseInt(value) : null)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Stufe auswählen" />
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

          <div className="space-y-2">
            <Label htmlFor="activeToStage" className="text-sm font-medium">
              Aktiv bis Stufe (optional)
            </Label>
            <Select 
              value={activeToStage?.toString() || 'permanent'} 
              onValueChange={(value) => onActiveToStageChange(value === 'permanent' ? null : parseInt(value))}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Dauerhaft aktiv" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Dauerhaft aktiv</SelectItem>
                {availableStages
                  .filter(stage => !activeFromStage || stage.stageNumber >= activeFromStage)
                  .map((stage) => (
                    <SelectItem key={stage.id} value={stage.stageNumber.toString()}>
                      {getStageDisplay(stage)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        {activeFromStage && (
          <div className="pt-2 border-t border-blue-200">
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <span className="font-medium">Vorschau:</span>
              <Badge variant="outline" className="text-xs">
                Sichtbar in Stufe {activeFromStage}
                {activeToStage ? ` bis ${activeToStage}` : '+'}
              </Badge>
              {activeFromStage <= currentUserStage && (
                <Badge className="text-xs bg-green-100 text-green-700">
                  Aktuell verfügbar
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}