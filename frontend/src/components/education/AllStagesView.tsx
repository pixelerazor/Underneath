/**
 * All Stages View Component
 * 
 * Shows all stages using the StageDashboard template design
 * Each stage gets its own dashboard section similar to the current stage view
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { 
  Trophy, 
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  Trash2
} from 'lucide-react';
import { stageService, type Stage } from '@/services/stageService';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { StageStatisticsGrid } from '@/components/shared/StageStatisticsGrid';
import { StageDetailView } from '@/components/shared/StageDetailView';
import { EntityCreateModal, EntityContext } from '@/components/shared/EntityCreateModal';

interface StageStatistics {
  totalActive: number;
  completedToday: number;
  pendingTasks: number;
  activeRules: number;
  goalsProgress: number;
}

interface StageWithStats extends Stage {
  statistics: StageStatistics;
}

interface AllStagesViewProps {
  showOnlyActive?: boolean;
  showOnlySubActive?: boolean;
}

export function AllStagesView({ showOnlyActive = false, showOnlySubActive = false }: AllStagesViewProps) {
  const [allStages, setAllStages] = useState<StageWithStats[]>([]);
  const [stages, setStages] = useState<StageWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalDetailView, setGlobalDetailView] = useState<{ stageName: string; entityTitle: string; entities: any[]; entityType?: string; stageId?: string; stageNumber?: number } | null>(null);
  const [toggleLoading, setToggleLoading] = useState<Set<string>>(new Set());
  const [createModalContext, setCreateModalContext] = useState<EntityContext | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{stageId: string, stageName: string} | null>(null);
  const { user } = useAuthStore();

  // Check if user is DOM or ADMIN
  const canToggle = user?.role === 'DOM' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'DOM' || user?.role === 'ADMIN'; // DOM and ADMIN can delete stages

  useEffect(() => {
    loadAllStagesData();
  }, []);

  // Filter stages when allStages or filter props change
  useEffect(() => {
    let filteredStages = allStages;
    
    if (showOnlyActive) {
      filteredStages = filteredStages.filter(stage => stage.isActive);
    }
    
    if (showOnlySubActive) {
      filteredStages = filteredStages.filter(stage => 
        stage.isSubActive === true
      );
    }
    
    setStages(filteredStages);
  }, [allStages, showOnlyActive, showOnlySubActive]);

  // Toggle Sub lock/unlock status
  const handleToggleSubLock = async (stageId: string, stageName: string) => {
    if (!canToggle) return;
    
    setToggleLoading(prev => new Set(prev).add(`sublock-${stageId}`));
    
    try {
      const updatedStage = await stageService.toggleSubLocked(stageId);
      
      // Update local state while preserving statistics
      setAllStages(prev => prev.map(stage => 
        stage.id === stageId ? { ...updatedStage, statistics: stage.statistics } : stage
      ));
      
      toast.success(`Stufe "${stageName}" ist jetzt für Sub ${updatedStage.isSubLocked ? 'gesperrt' : 'offen'}`);
      
    } catch (error) {
      console.error('Error toggling sub lock status:', error);
      toast.error('Fehler beim Ändern des Sub-Sperrstatus');
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`sublock-${stageId}`);
        return newSet;
      });
    }
  };

  // Toggle Sub active/inactive status
  const handleToggleSubActive = async (stageId: string, stageName: string) => {
    if (!canToggle) return;
    
    setToggleLoading(prev => new Set(prev).add(`subactive-${stageId}`));
    
    try {
      const updatedStage = await stageService.toggleSubActive(stageId);
      
      // Update local state - need to refresh ALL stages since other stages might be deactivated
      const refreshedStages = await stageService.getAllStages();
      const stagesWithStats = refreshedStages.map(stage => {
        const existing = allStages.find(s => s.id === stage.id);
        return existing ? { ...existing, ...stage } : { ...stage, statistics: { totalActive: 0, completedToday: 0, pendingTasks: 0, activeRules: 0, goalsProgress: 0 } };
      });
      setAllStages(stagesWithStats);
      
      toast.success(`Stufe "${stageName}" ist jetzt für Sub ${updatedStage.isSubActive ? 'aktiv' : 'inaktiv'}`);
      
    } catch (error) {
      console.error('Error toggling sub active status:', error);
      toast.error('Fehler beim Ändern des Sub-Aktivitätsstatus');
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`subactive-${stageId}`);
        return newSet;
      });
    }
  };

  // Toggle Sub visibility status
  const handleToggleSubVisibility = async (stageId: string, stageName: string) => {
    if (!canToggle) return;
    
    setToggleLoading(prev => new Set(prev).add(`subvisibility-${stageId}`));
    
    try {
      const updatedStage = await stageService.toggleSubVisible(stageId);
      
      // Update local state while preserving statistics
      setAllStages(prev => prev.map(stage => 
        stage.id === stageId ? { ...updatedStage, statistics: stage.statistics } : stage
      ));
      
      toast.success(`Stufe "${stageName}" ist jetzt für Sub ${updatedStage.isSubVisible ? 'sichtbar' : 'unsichtbar'}`);
      
    } catch (error) {
      console.error('Error toggling sub visibility:', error);
      toast.error('Fehler beim Ändern der Sub-Sichtbarkeit');
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`subvisibility-${stageId}`);
        return newSet;
      });
    }
  };

  // Show delete confirmation dialog
  const handleDeleteStage = (stageId: string, stageName: string) => {
    if (!canDelete) return;
    setDeleteConfirmation({ stageId, stageName });
  };

  // Confirm delete stage
  const confirmDeleteStage = async () => {
    if (!deleteConfirmation) return;
    
    const { stageId, stageName } = deleteConfirmation;
    setToggleLoading(prev => new Set(prev).add(`delete-${stageId}`));
    
    try {
      const result = await stageService.deleteStage(stageId);
      
      // Remove from local state
      setAllStages(prev => prev.filter(stage => stage.id !== stageId));
      
      toast.success(result.message || `Stufe "${stageName}" wurde erfolgreich gelöscht`);
      
    } catch (error: any) {
      console.error('Error deleting stage:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Fehler beim Löschen der Stufe';
      toast.error(errorMessage);
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`delete-${stageId}`);
        return newSet;
      });
      setDeleteConfirmation(null);
    }
  };

  const loadAllStagesData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load all stages (now includes Sub settings from database)
      const allStages = await stageService.getAllStages();
      
      // Use real statistics from backend _count data
      const stagesWithStats = allStages.map(stage => ({
        ...stage,
        statistics: {
          totalActive: (stage._count?.Task || 0) + (stage._count?.Rule || 0) + (stage._count?.Goal || 0) + (stage._count?.Initiationsriten || 0),
          completedToday: 0, // This would need additional API data
          pendingTasks: stage._count?.Task || 0,
          activeRules: stage._count?.Rule || 0,
          goalsProgress: stage._count?.Goal || 0
        }
      })).sort((a, b) => a.stageNumber - b.stageNumber);

      // Store all stages 
      setAllStages(stagesWithStats);


    } catch (error) {
      console.error('Error loading stages data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageStatus = (stage: StageWithStats) => {
    // Use Sub-Active status instead of user progression for display
    if (stage.isSubActive) return 'active';
    return 'inactive';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle entity editing from global detail view
  const handleEntityEdit = (entity: any, entityType: string) => {
    // Map entity type to form type
    const getFormTypeFromEntityType = (entityType: string): 'tasks' | 'rules' | 'goals' | 'initiationsriten' | 'privilegien' | 'strafen' | 'tpe' => {
      switch (entityType) {
        case 'tasks': return 'tasks';
        case 'rules': return 'rules';
        case 'goals': return 'goals';
        case 'initiationsriten': return 'initiationsriten';
        case 'privilegien': return 'privilegien';
        case 'strafen': return 'strafen';
        case 'tpe': return 'tpe';
        default: return 'tasks';
      }
    };

    const editContext: EntityContext = {
      entityType: getFormTypeFromEntityType(entityType),
      stageId: globalDetailView?.stageId,
      stageName: globalDetailView?.stageName,
      stageNumber: globalDetailView?.stageNumber,
      editMode: true,
      entityId: entity.id,
      initialData: entity
    };
    
    setCreateModalContext(editContext);
  };

  const handleModalClose = () => {
    setCreateModalContext(null);
    // Refresh the data after modal closes
    loadAllStagesData();
  };

  // Global Detail View (when "Show All" is clicked across any stage)
  if (globalDetailView) {
    return (
      <>
        <StageDetailView
          stageName={globalDetailView.stageName}
          entityTitle={globalDetailView.entityTitle}
          entities={globalDetailView.entities}
          onBack={() => setGlobalDetailView(null)}
          onEdit={handleEntityEdit}
          entityType={globalDetailView.entityType}
        />
        
        {/* Entity Edit Modal */}
        <EntityCreateModal
          isOpen={!!createModalContext}
          onClose={handleModalClose}
          context={createModalContext}
          onSuccess={() => {
            // Refresh data after successful edit
            loadAllStagesData();
          }}
        />
      </>
    );
  }

  return (
    <div className="space-y-8">
      {stages.map((stage) => {
        const status = getStageStatus(stage);
        const { statistics } = stage;

        return (
          <StageContainer key={stage.id} stage={stage} status={status} statistics={statistics} />
        );
      })}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Stufe löschen
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie die Stufe <strong>"{deleteConfirmation?.stageName}"</strong> löschen möchten?
              <br /><br />
              <strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong>
              <br /><br />
              <span className="text-amber-600">
                ⚠️ Hinweis: Die Stufe kann nur gelöscht werden, wenn sie keine verknüpften Daten (Aufgaben, Regeln, Ziele, etc.) hat.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation(null)}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStage}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteConfirmation ? toggleLoading.has(`delete-${deleteConfirmation.stageId}`) : false}
            >
              {deleteConfirmation && toggleLoading.has(`delete-${deleteConfirmation.stageId}`) ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Wird gelöscht...
                </div>
              ) : (
                'Stufe löschen'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Individual Stage Container Component
  function StageContainer({ stage, status, statistics }: { 
    stage: StageWithStats; 
    status: string; 
    statistics?: StageStatistics; 
  }) {
    // Handle "Show All" clicks by setting global detail view
    const handleShowAll = (entityType: any, entities: any[], entityTitle: string) => {
      setGlobalDetailView({
        stageName: stage.name,
        entityTitle,
        entities,
        entityType,
        stageId: stage.id,
        stageNumber: stage.stageNumber
      });
    };

    return (
      <div className="space-y-6 p-6 rounded-xl border-2 border-gray-300">
        
        {/* Stage Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Stufe {stage.stageNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">{stage.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{stage.pointsRequired} Punkte erforderlich</p>
                </div>
                
                {/* Toggle Buttons for DOM/ADMIN - Now vertical and right-aligned */}
                {canToggle && (
                  <div className="flex flex-col gap-2 ml-4">
                      {/* Sub Lock Toggle */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSubLock(stage.id, stage.name)}
                        disabled={toggleLoading.has(`sublock-${stage.id}`)}
                        className={`transition-all ${
                          stage.isSubLocked 
                            ? 'bg-gray-800 text-red-400 border-gray-700 hover:bg-gray-700' 
                            : 'bg-gray-800 text-green-400 border-gray-700 hover:bg-gray-700'
                        }`}
                        title={`Klicken um für Sub ${stage.isSubLocked ? 'zu öffnen' : 'zu sperren'}`}
                      >
                        {toggleLoading.has(`sublock-${stage.id}`) ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <>
                            {stage.isSubLocked ? (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Für Sub gesperrt
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3 mr-1" />
                                Für Sub offen
                              </>
                            )}
                          </>
                        )}
                      </Button>
                      
                      {/* Sub Active Toggle */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSubActive(stage.id, stage.name)}
                        disabled={toggleLoading.has(`subactive-${stage.id}`)}
                        className={`transition-all ${
                          stage.isSubActive 
                            ? 'bg-gray-800 text-green-400 border-gray-700 hover:bg-gray-700' 
                            : 'bg-gray-800 text-red-400 border-gray-700 hover:bg-gray-700'
                        }`}
                        title={`Klicken um für Sub ${stage.isSubActive ? 'zu deaktivieren' : 'zu aktivieren'}`}
                      >
                        {toggleLoading.has(`subactive-${stage.id}`) ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <>
                            {stage.isSubActive ? (
                              <>
                                <Power className="h-3 w-3 mr-1" />
                                Für Sub aktiv
                              </>
                            ) : (
                              <>
                                <PowerOff className="h-3 w-3 mr-1" />
                                Für Sub inaktiv
                              </>
                            )}
                          </>
                        )}
                      </Button>
                      
                      {/* Sub Visibility Toggle */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSubVisibility(stage.id, stage.name)}
                        disabled={toggleLoading.has(`subvisibility-${stage.id}`)}
                        className={`transition-all ${
                          stage.isSubVisible 
                            ? 'bg-gray-800 text-green-400 border-gray-700 hover:bg-gray-700' 
                            : 'bg-gray-800 text-red-400 border-gray-700 hover:bg-gray-700'
                        }`}
                        title={`Klicken um für Sub ${stage.isSubVisible ? 'unsichtbar' : 'sichtbar'} zu machen`}
                      >
                        {toggleLoading.has(`subvisibility-${stage.id}`) ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <>
                            {stage.isSubVisible ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Für Sub sichtbar
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Für Sub unsichtbar
                              </>
                            )}
                          </>
                        )}
                      </Button>
                      
                      {/* Delete Stage Button - Only for ADMIN */}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStage(stage.id, stage.name)}
                          disabled={toggleLoading.has(`delete-${stage.id}`)}
                          className="transition-all bg-gray-800 text-red-500 border-red-600 hover:bg-red-900 hover:text-red-300"
                          title={`Stufe "${stage.name}" löschen`}
                        >
                          {toggleLoading.has(`delete-${stage.id}`) ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Stufe löschen
                            </>
                          )}
                        </Button>
                      )}
                  </div>
                )}
              </div>

              {stage.description && (
                <p className="text-muted-foreground">{stage.description}</p>
              )}

            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid - Now using shared component */}
        <StageStatisticsGrid
          stageId={stage.id}
          stageNumber={stage.stageNumber}
          stageName={stage.name}
          statistics={statistics}
          showExpansion={true}
          onShowAll={handleShowAll}
          showStageSystemEntities={true}
          initialCounts={stage._count}
          onRefresh={() => {
            console.log('🔍 DEBUG: AllStagesView onRefresh called');
            loadAllStagesData().catch(error => console.error('🔍 DEBUG: Error in loadAllStagesData:', error));
          }}
        />
      </div>
    );
  }
}