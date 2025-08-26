/**
 * Entity Tree View Component
 * 
 * Shows the hierarchical tree structure of stage-entity relationships
 * Visualizes how entities are linked to stages in a tree format
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight,
  Trophy, 
  Target, 
  BookOpen, 
  CheckSquare,
  TreePine,
  RefreshCw,
  Edit3,
  Plus,
  Settings
} from 'lucide-react';
import { stageService } from '@/services/stageService';
import { apiClient } from '@/services/apiClient';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface EntityTreeNode {
  stage: {
    id: string;
    stageNumber: number;
    name: string;
    pointsRequired: number;
    color?: string;
  };
  entities: {
    tasks: any[];
    rules: any[];
    goals: any[];
  };
  inherited: {
    tasks: any[];
    rules: any[];
    goals: any[];
  };
}

export function EntityTreeView() {
  const [treeData, setTreeData] = useState<EntityTreeNode[]>([]);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set([1]));
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    try {
      setLoading(true);
      
      // Load all stages
      const stages = await stageService.getAllStages();
      
      // Load entities for each stage
      const treeNodes: EntityTreeNode[] = [];
      
      for (const stage of stages.sort((a, b) => a.stageNumber - b.stageNumber)) {
        // Get direct entities (activeFromStage === stage.stageNumber)
        const directEntities = await loadEntitiesForStage(stage.stageNumber, stage.stageNumber);
        
        // Get inherited entities (activeFromStage < stage.stageNumber && (activeToStage === null || activeToStage >= stage.stageNumber))
        const inheritedEntities = await loadInheritedEntities(stage.stageNumber);
        
        treeNodes.push({
          stage,
          entities: directEntities,
          inherited: inheritedEntities
        });
      }
      
      setTreeData(treeNodes);
    } catch (error) {
      console.error('Error loading tree data:', error);
      toast.error('Fehler beim Laden der Tree-Struktur');
    } finally {
      setLoading(false);
    }
  };

  const loadEntitiesForStage = async (stageNumber: number, exactStage: number) => {
    try {
      // Load entities directly for this stage
      const [rulesResponse, tasksResponse, goalsResponse] = await Promise.all([
        apiClient.get(`/rules?activeFromStage=${exactStage}`),
        apiClient.get(`/tasks?activeFromStage=${exactStage}`),
        apiClient.get(`/goals?activeFromStage=${exactStage}`)
      ]);

      const rules = rulesResponse.data.data || [];
      const tasks = tasksResponse.data.data || [];
      const goals = goalsResponse.data.data || [];

      return {
        tasks: tasks.filter((task: any) => task.activeFromStage === exactStage),
        rules: rules.filter((rule: any) => rule.activeFromStage === exactStage),
        goals: goals.filter((goal: any) => goal.activeFromStage === exactStage)
      };
    } catch (error) {
      console.error('Error loading entities for stage:', error);
      return { tasks: [], rules: [], goals: [] };
    }
  };

  const loadInheritedEntities = async (currentStage: number) => {
    try {
      // Load all entities that should be inherited by this stage
      const [rulesResponse, tasksResponse, goalsResponse] = await Promise.all([
        apiClient.get(`/rules`),
        apiClient.get(`/tasks`),
        apiClient.get(`/goals`)
      ]);

      const allRules = rulesResponse.data.data || [];
      const allTasks = tasksResponse.data.data || [];
      const allGoals = goalsResponse.data.data || [];

      const inheritedRules = allRules.filter((rule: any) => 
        rule.activeFromStage < currentStage && 
        (rule.activeToStage === null || rule.activeToStage >= currentStage)
      );

      const inheritedTasks = allTasks.filter((task: any) => 
        task.activeFromStage < currentStage && 
        (task.activeToStage === null || task.activeToStage >= currentStage)
      );

      const inheritedGoals = allGoals.filter((goal: any) => 
        goal.activeFromStage < currentStage && 
        (goal.activeToStage === null || goal.activeToStage >= currentStage)
      );

      return {
        tasks: inheritedTasks,
        rules: inheritedRules,
        goals: inheritedGoals
      };
    } catch (error) {
      console.error('Error loading inherited entities:', error);
      return { tasks: [], rules: [], goals: [] };
    }
  };

  const toggleStageExpansion = (stageNumber: number) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageNumber)) {
      newExpanded.delete(stageNumber);
    } else {
      newExpanded.add(stageNumber);
    }
    setExpandedStages(newExpanded);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="h-4 w-4 text-blue-600" />;
      case 'rule': return <BookOpen className="h-4 w-4 text-purple-600" />;
      case 'goal': return <Target className="h-4 w-4 text-green-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const EntityList = ({ entities, type, isInherited = false }: { entities: any[]; type: string; isInherited?: boolean }) => {
    if (entities.length === 0) return null;

    const getEditPath = (entity: any, entityType: string) => {
      const typeMap: { [key: string]: string } = {
        'rule': 'rules',
        'task': 'tasks', 
        'goal': 'goals'
      };
      return `/entities/${typeMap[entityType]}/${entity.id}/edit`;
    };

    return (
      <div className="ml-6 space-y-2">
        {entities.map((entity, index) => (
          <div key={entity.id || index} className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border text-sm">
            <div className="flex items-center gap-2 flex-1">
              {getEntityIcon(type)}
              <div className="flex-1">
                <span className={`font-medium ${isInherited ? 'text-muted-foreground italic' : ''}`}>
                  {entity.title}
                </span>
                {entity.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {entity.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isInherited && (
                <Badge variant="outline" className="text-xs">
                  erbt von Stufe {entity.activeFromStage}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {entity.severity || entity.priority || 'normal'}
              </Badge>
              
              {/* Edit Button for Entities */}
              {(user?.role === 'DOM' || user?.role === 'ADMIN') && !isInherited && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(getEditPath(entity, type));
                  }}
                  className="h-6 px-2"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Entity Tree Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Entity Tree Structure
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadTreeData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Aktualisieren
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {treeData.map((node) => {
            const isExpanded = expandedStages.has(node.stage.stageNumber);
            const totalEntities = node.entities.rules.length + node.entities.tasks.length + node.entities.goals.length;
            const inheritedCount = node.inherited.rules.length + node.inherited.tasks.length + node.inherited.goals.length;

            return (
              <div key={node.stage.id} className="border rounded-lg overflow-hidden">
                {/* Stage Header */}
                <div 
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleStageExpansion(node.stage.stageNumber)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: node.stage.color || '#6B7280' }}
                  >
                    {node.stage.stageNumber}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{node.stage.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {node.stage.pointsRequired} Punkte erforderlich
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <Badge>
                        {totalEntities} direkte
                      </Badge>
                      {inheritedCount > 0 && (
                        <Badge variant="outline">
                          {inheritedCount} geerbt
                        </Badge>
                      )}
                    </div>
                    
                    {/* Stage Edit Button */}
                    {(user?.role === 'DOM' || user?.role === 'ADMIN') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/stages/${node.stage.id}/edit`);
                        }}
                        className="h-7 px-2"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t bg-muted/25">
                    <div className="py-2 space-y-2">
                      
                      {/* Add Entity Actions */}
                      {(user?.role === 'DOM' || user?.role === 'ADMIN') && (
                        <div className="flex gap-2 mb-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/entities/tasks/create?stage=${node.stage.stageNumber}`);
                            }}
                            className="h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Aufgabe
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/entities/rules/create?stage=${node.stage.stageNumber}`);
                            }}
                            className="h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Regel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/entities/goals/create?stage=${node.stage.stageNumber}`);
                            }}
                            className="h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Ziel
                          </Button>
                        </div>
                      )}
                      {/* Direct Entities */}
                      {totalEntities > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            DIREKTE ENTITÄTEN:
                          </div>
                          <EntityList entities={node.entities.rules} type="rule" />
                          <EntityList entities={node.entities.tasks} type="task" />
                          <EntityList entities={node.entities.goals} type="goal" />
                        </div>
                      )}

                      {/* Inherited Entities */}
                      {inheritedCount > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2 mt-3">
                            GEERBTE ENTITÄTEN:
                          </div>
                          <EntityList entities={node.inherited.rules} type="rule" isInherited />
                          <EntityList entities={node.inherited.tasks} type="task" isInherited />
                          <EntityList entities={node.inherited.goals} type="goal" isInherited />
                        </div>
                      )}

                      {totalEntities === 0 && inheritedCount === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          Keine Entitäten zugeordnet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}