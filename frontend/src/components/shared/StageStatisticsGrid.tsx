/**
 * StageStatisticsGrid Component
 * 
 * Reusable component for displaying stage statistics with card expansion
 * Used across AllStagesView, StageDashboard, and other stage-related components
 * Now supports long-press entity creation on mobile
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  STAGE_STATISTICS_CONFIG,
  STAGE_SYSTEM_ENTITIES,
  type StatisticType
} from '@/config/stageStatisticsConfig';
import { useStageStatistics } from '@/hooks/useStageStatistics';
import { EntityDetailDrawer } from './EntityDetailDrawer';
import { LongPressTarget } from './LongPressTarget';
import { EntityCreateModal, EntityContext } from './EntityCreateModal';

export interface StageStatisticsGridProps {
  stageId: string;
  stageNumber: number;
  stageName: string;
  statistics: {
    completedToday: number;
    pendingTasks: number;
    activeRules: number;
    goalsProgress: number;
  };
  showExpansion?: boolean;
  className?: string;
  onShowAll?: (entityType: any, entities: any[], entityTitle: string) => void;
  showStageSystemEntities?: boolean;
}

export function StageStatisticsGrid({
  stageId,
  stageNumber,
  stageName,
  statistics: _statistics,
  showExpansion = true,
  className = "",
  onShowAll,
  showStageSystemEntities = true
}: StageStatisticsGridProps) {
  const [createModalContext, setCreateModalContext] = useState<EntityContext | null>(null);
  
  const {
    toggleCardExpansion,
    showAllEntities,
    isCardExpanded,
    isCardLoading,
    getExpandedEntities,
    getEntityCount,
    refreshEntityCounts,
    openEntityDrawer,
    closeEntityDrawer,
    drawerEntity
  } = useStageStatistics({ stageId, stageNumber, stageName, onShowAll });

  // Map statistic types to entity types
  const getEntityTypeFromStatistic = (statisticType: StatisticType): 'tasks' | 'rules' | 'goals' | null => {
    switch (statisticType) {
      case 'tasks':
      case 'completedTasks':
      case 'pendingTasks':
        return 'tasks';
      case 'rules':
      case 'activeRules':
        return 'rules';
      case 'goals':
      case 'goalsProgress':
        return 'goals';
      default:
        return null;
    }
  };

  const handleLongPress = (statisticType: StatisticType) => {
    const entityType = getEntityTypeFromStatistic(statisticType);
    if (!entityType) return;

    const context: EntityContext = {
      entityType,
      stageId,
      stageName,
      stageNumber,
      defaultValues: {
        activeFromStage: stageNumber,
        stageId
      }
    };

    setCreateModalContext(context);
  };

  const handleCloseModal = () => {
    setCreateModalContext(null);
    // Refresh counts after creation
    refreshEntityCounts();
  };

  const renderExpandedEntities = (entities: any[], statisticType: StatisticType) => {
    const previewEntities = entities.slice(0, 3);
    const hasMore = entities.length > 3;

    return (
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
        {previewEntities.map((entity: any) => (
          <div 
            key={entity.id} 
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card expansion toggle
              const config = STAGE_STATISTICS_CONFIG.find(c => c.id === statisticType) || 
                            STAGE_SYSTEM_ENTITIES.find(c => c.id === statisticType);
              if (config) {
                openEntityDrawer(entity, config.entityType);
              }
            }}
          >
            <div className="flex-1">
              <div className="font-medium">{entity.title}</div>
              {entity.description && (
                <div className="text-xs text-muted-foreground truncate">{entity.description}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {entity.status && (
                <span className={`px-1 py-0.5 rounded text-xs ${
                  entity.status === 'completed' ? 'bg-green-100 text-green-700' :
                  entity.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {entity.status === 'completed' ? 'Fertig' :
                   entity.status === 'active' ? 'Aktiv' : 
                   entity.status}
                </span>
              )}
              {entity.isActive !== undefined && (
                <span className={`px-1 py-0.5 rounded text-xs ${
                  entity.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {entity.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {hasMore && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              ... und {entities.length - 3} weitere
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => showAllEntities(statisticType)}
              className="h-7 text-xs"
            >
              Alle anzeigen
            </Button>
          </div>
        )}
        
        {entities.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Keine Einträge gefunden
          </div>
        )}
      </div>
    );
  };

  // Combine all cards into one array for unified display
  const allCards = [
    ...STAGE_STATISTICS_CONFIG.map(config => ({ ...config, isMainStat: true })),
    ...(showStageSystemEntities ? STAGE_SYSTEM_ENTITIES.map(config => ({ ...config, isMainStat: false })) : [])
  ];

  // Split into two rows of 3 cards each
  const firstRow = allCards.slice(0, 3);
  const secondRow = allCards.slice(3, 6);

  const renderCard = (config: any) => {
    const IconComponent = config.icon;
    const isExpanded = showExpansion && isCardExpanded(config.id);
    const isLoading = showExpansion && isCardLoading(config.id);
    const expandedEntities = showExpansion ? getExpandedEntities(config.id) : [];
    
    // Get the value based on card type
    const cardValue = config.isMainStat 
      ? getEntityCount(config.id)
      : (expandedEntities.length > 0 ? expandedEntities.length : '0');

    const CardWrapper = config.isMainStat ? LongPressTarget : 'div';
    const cardProps = config.isMainStat 
      ? {
          onLongPress: () => handleLongPress(config.id),
          className: `${showExpansion ? 'cursor-pointer hover:shadow-md' : ''} transition-all`
        }
      : {
          className: `${showExpansion ? 'cursor-pointer hover:shadow-md' : ''} transition-all`
        };

    return (
      <CardWrapper key={config.id} {...cardProps}>
        <Card className="h-full">
          <CardContent className="p-4">
            <div 
              className="flex items-center gap-2"
              onClick={showExpansion ? () => toggleCardExpansion(config.id) : undefined}
            >
              <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
              <div className="space-y-1">
                <p className="text-2xl font-bold">{cardValue}</p>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </div>
            </div>
          
            {showExpansion && isLoading && (
              <div className="mt-3 pt-3 border-t">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            )}
            
            {showExpansion && isExpanded && !isLoading && (
              renderExpandedEntities(expandedEntities, config.id)
            )}
          </CardContent>
        </Card>
      </CardWrapper>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {firstRow.map(renderCard)}
      </div>

      {/* Second Row - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondRow.map(renderCard)}
      </div>

      {/* Entity Detail Drawer */}
      {drawerEntity && (
        <EntityDetailDrawer
          isOpen={!!drawerEntity}
          onClose={closeEntityDrawer}
          entity={drawerEntity.entity}
          entityType={drawerEntity.entityType}
          entityTitle={drawerEntity.entityTitle}
          onEntityUpdated={(updatedEntity) => {
            // Refresh entity counts after update
            refreshEntityCounts();
            console.log('Entity updated:', updatedEntity);
          }}
          onEntityDeleted={(entityId) => {
            // Refresh entity counts after deletion
            refreshEntityCounts();
            console.log('Entity deleted:', entityId);
          }}
        />
      )}

      {/* Entity Create Modal */}
      <EntityCreateModal
        isOpen={!!createModalContext}
        onClose={handleCloseModal}
        context={createModalContext}
      />
    </div>
  );
}