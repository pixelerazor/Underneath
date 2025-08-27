/**
 * useStageStatistics Hook
 * 
 * Manages state for stage statistics cards with expansion functionality
 * Handles API calls, loading states, and card expansion logic
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '@/services/apiClient';
import { log } from '@/utils/logger';
import { 
  type StatisticType, 
  type EntityType, 
  API_ENDPOINTS, 
  ENTITY_LABELS,
  STAGE_STATISTICS_CONFIG,
  STAGE_SYSTEM_ENTITIES
} from '@/config/stageStatisticsConfig';

export interface UseStageStatisticsProps {
  stageId: string;
  stageNumber: number;
  stageName: string;
  onShowAll?: (entityType: EntityType, entities: any[], entityTitle: string) => void;
  initialCounts?: {
    Task?: number;
    Rule?: number;
    Goal?: number;
    Initiationsriten?: number;
    StageProgression?: number;
  };
}

export interface StageStatisticsState {
  expandedCards: Map<string, any[]>;
  loadingCards: Set<string>;
  detailView: {
    stageId: string;
    entityType: EntityType;
    entities: any[];
    stageName: string;
    entityTitle: string;
  } | null;
  drawerEntity: {
    entity: any;
    entityType: EntityType;
    entityTitle: string;
  } | null;
}

export function useStageStatistics({ stageId, stageNumber, stageName, onShowAll, initialCounts }: UseStageStatisticsProps) {
  const [expandedCards, setExpandedCards] = useState<Map<string, any[]>>(new Map());
  const [loadingCards, setLoadingCards] = useState<Set<string>>(new Set());
  const [detailView, setDetailView] = useState<StageStatisticsState['detailView']>(null);
  const [drawerEntity, setDrawerEntity] = useState<StageStatisticsState['drawerEntity']>(null);
  const [entityCounts, setEntityCounts] = useState<Map<string, number>>(new Map());
  const loadingRef = useRef<boolean>(false);
  const loadedStageRef = useRef<string>('');

  // Load entity counts on initialization
  useEffect(() => {
    const stageKey = `${stageId}-${stageNumber}`;
    
    // Prevent multiple simultaneous loads for the same stage
    if (loadingRef.current || loadedStageRef.current === stageKey) {
      return;
    }
    
    loadingRef.current = true;
    const loadEntityCounts = async () => {
      const newCounts = new Map<string, number>();
      
      // If initial counts are provided (from stage _count data), use them for some entities
      if (initialCounts) {
        // Combine both STAGE_STATISTICS_CONFIG and STAGE_SYSTEM_ENTITIES
        const allConfigs = [...STAGE_STATISTICS_CONFIG, ...STAGE_SYSTEM_ENTITIES];
        
        // Entities that need API calls even when initialCounts exist
        const apiCallEntities = ['initiationsriten', 'privilegien', 'strafen', 'tpe'];
        
        // First, set initial counts for main statistics
        for (const config of allConfigs) {
          if (!apiCallEntities.includes(config.entityType)) {
            let count = 0;
            switch (config.entityType) {
              case 'tasks':
                count = initialCounts.Task || 0;
                break;
              case 'rules':
                count = initialCounts.Rule || 0;
                break;
              case 'goals':
                count = initialCounts.Goal || 0;
                break;
              default:
                count = 0;
            }
            newCounts.set(config.id, count);
          }
        }
        
        // Then make API calls for system entities
        const apiPromises = allConfigs
          .filter(config => apiCallEntities.includes(config.entityType))
          .map(async (config) => {
            try {
              const endpoint = `${API_ENDPOINTS[config.entityType]}?stageId=${stageId}`;
              const response = await apiClient.get(endpoint);
              let entities = response.data.data || [];
              
              // Apply filter if configured
              if (config.filterEntities) {
                entities = config.filterEntities(entities);
              }
              
              return { id: config.id, count: entities.length };
            } catch (error) {
              console.error(`Error loading count for ${config.id}:`, error);
              return { id: config.id, count: 0 };
            }
          });
        
        // Wait for all API calls to complete
        const apiResults = await Promise.all(apiPromises);
        for (const result of apiResults) {
          newCounts.set(result.id, result.count);
        }
        setEntityCounts(newCounts);
        loadedStageRef.current = stageKey;
        loadingRef.current = false;
        return;
      }
      
      // Fallback: Load counts via individual API calls
      // Combine both STAGE_STATISTICS_CONFIG and STAGE_SYSTEM_ENTITIES
      const allConfigs = [...STAGE_STATISTICS_CONFIG, ...STAGE_SYSTEM_ENTITIES];
      for (const config of allConfigs) {
        try {
          const endpoint = `${API_ENDPOINTS[config.entityType]}?stageId=${stageId}`;
          const response = await apiClient.get(endpoint);
          let entities = response.data.data || [];
          
          // Apply filter if configured
          if (config.filterEntities) {
            entities = config.filterEntities(entities);
          }
          
          newCounts.set(config.id, entities.length);
        } catch (error) {
          console.error(`Error loading count for ${config.id}:`, error);
          newCounts.set(config.id, 0);
        }
      }
      
      setEntityCounts(newCounts);
      loadedStageRef.current = stageKey;
      loadingRef.current = false;
    };

    loadEntityCounts();
  }, [stageId, stageNumber, JSON.stringify(initialCounts)]);

  const toggleCardExpansion = useCallback(async (statisticType: StatisticType) => {
    const cardKey = `${stageId}-${statisticType}`;
    const config = STAGE_STATISTICS_CONFIG.find(c => c.id === statisticType) || 
                  STAGE_SYSTEM_ENTITIES.find(c => c.id === statisticType);
    
    if (!config) return;
    
    // If already expanded, collapse it
    if (expandedCards.has(cardKey)) {
      const newExpanded = new Map(expandedCards);
      newExpanded.delete(cardKey);
      setExpandedCards(newExpanded);
      return;
    }

    // Start loading
    setLoadingCards(prev => new Set(prev).add(cardKey));
    
    try {
      const endpoint = `${API_ENDPOINTS[config.entityType]}?stageId=${stageId}`;
      log.debug('useStageStatistics', 'Loading entities', { statisticType, endpoint });
      
      const response = await apiClient.get(endpoint);
      let entities = response.data.data || [];
      
      // Apply filter if configured
      if (config.filterEntities) {
        entities = config.filterEntities(entities);
      }

      // For temporary endpoints, create mock data if empty
      if (entities.length === 0 && (statisticType === 'initiationsriten' || statisticType === 'privilegien')) {
        entities = [
          {
            id: `mock-${statisticType}-1`,
            title: `Beispiel ${ENTITY_LABELS[config.entityType]} 1`,
            description: `Dies ist ein Platzhalter für ${ENTITY_LABELS[config.entityType]} bis die API verfügbar ist.`,
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: `mock-${statisticType}-2`, 
            title: `Beispiel ${ENTITY_LABELS[config.entityType]} 2`,
            description: `Weitere Beispieldaten für ${ENTITY_LABELS[config.entityType]}.`,
            status: 'completed',
            createdAt: new Date().toISOString()
          }
        ];
      }

      // Store entities and expand card
      const newExpanded = new Map(expandedCards);
      newExpanded.set(cardKey, entities);
      setExpandedCards(newExpanded);
      
    } catch (error) {
      console.error(`Error loading ${statisticType} for stage ${stageNumber}:`, error);
      
      // On error, show empty state or mock data for missing APIs
      const newExpanded = new Map(expandedCards);
      newExpanded.set(cardKey, []);
      setExpandedCards(newExpanded);
    } finally {
      // Stop loading
      setLoadingCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardKey);
        return newSet;
      });
    }
  }, [stageId, stageNumber, expandedCards]);

  const showAllEntities = useCallback((statisticType: StatisticType) => {
    const cardKey = `${stageId}-${statisticType}`;
    const entities = expandedCards.get(cardKey) || [];
    const config = STAGE_STATISTICS_CONFIG.find(c => c.id === statisticType) || 
                  STAGE_SYSTEM_ENTITIES.find(c => c.id === statisticType);
    
    if (!config) return;

    const entityTitle = ENTITY_LABELS[config.entityType];

    // If external callback is provided, use it (for AllStagesView global detail)
    if (onShowAll) {
      onShowAll(config.entityType, entities, entityTitle);
    } else {
      // Otherwise, use internal detail view (for single stage components)
      setDetailView({
        stageId,
        entityType: config.entityType,
        entities,
        stageName,
        entityTitle
      });
    }
  }, [stageId, stageName, expandedCards, onShowAll]);

  const closeDetailView = useCallback(() => {
    setDetailView(null);
  }, []);

  const openEntityDrawer = useCallback((entity: any, entityType: EntityType) => {
    setDrawerEntity({
      entity,
      entityType,
      entityTitle: ENTITY_LABELS[entityType]
    });
  }, []);

  const closeEntityDrawer = useCallback(() => {
    setDrawerEntity(null);
  }, []);

  const isCardExpanded = useCallback((statisticType: StatisticType) => {
    const cardKey = `${stageId}-${statisticType}`;
    return expandedCards.has(cardKey);
  }, [stageId, expandedCards]);

  const isCardLoading = useCallback((statisticType: StatisticType) => {
    const cardKey = `${stageId}-${statisticType}`;
    return loadingCards.has(cardKey);
  }, [stageId, loadingCards]);

  const getExpandedEntities = useCallback((statisticType: StatisticType) => {
    const cardKey = `${stageId}-${statisticType}`;
    return expandedCards.get(cardKey) || [];
  }, [stageId, expandedCards]);

  const getEntityCount = useCallback((statisticType: StatisticType) => {
    return entityCounts.get(statisticType) || 0;
  }, [entityCounts]);

  const refreshEntityCounts = useCallback(async () => {
    // Reset the loading state to allow refresh
    const stageKey = `${stageId}-${stageNumber}`;
    loadedStageRef.current = '';
    loadingRef.current = true;
    
    const newCounts = new Map<string, number>();
    
    // Combine both STAGE_STATISTICS_CONFIG and STAGE_SYSTEM_ENTITIES
    const allConfigs = [...STAGE_STATISTICS_CONFIG, ...STAGE_SYSTEM_ENTITIES];
    for (const config of allConfigs) {
      try {
        const endpoint = `${API_ENDPOINTS[config.entityType]}?stageId=${stageId}`;
        const response = await apiClient.get(endpoint);
        let entities = response.data.data || [];
        
        // Apply filter if configured
        if (config.filterEntities) {
          entities = config.filterEntities(entities);
        }
        
        newCounts.set(config.id, entities.length);
      } catch (error) {
        console.error(`Error loading count for ${config.id}:`, error);
        newCounts.set(config.id, 0);
      }
    }
    
    setEntityCounts(newCounts);
    loadedStageRef.current = stageKey;
    loadingRef.current = false;
  }, [stageId, stageNumber]);

  return {
    // State
    detailView,
    drawerEntity,
    
    // Actions
    toggleCardExpansion,
    showAllEntities,
    closeDetailView,
    openEntityDrawer,
    closeEntityDrawer,
    
    // Helpers
    isCardExpanded,
    isCardLoading,
    getExpandedEntities,
    getEntityCount,
    refreshEntityCounts
  };
}