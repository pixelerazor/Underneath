/**
 * Stage Overview Component
 * 
 * Shows all available stages in the system with their details
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  CheckCircle,
  Lock,
  RefreshCw,
  Edit3,
  Plus,
  Target,
  BookOpen,
  CheckSquare,
  Calendar,
  Users
} from 'lucide-react';
import { stageService, Stage } from '@/services/stageService';
import { useAuthStore } from '@/store/useAuthStore';
import { entityRegistry } from '@/services/entityRegistry';
import { toast } from 'sonner';

export function StageOverview() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserStage, setCurrentUserStage] = useState(1);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    try {
      setLoading(true);
      const stagesData = await stageService.getAllStages();
      // Ensure stagesData is an array
      setStages(Array.isArray(stagesData) ? stagesData : []);
      console.log('Loaded stages:', stagesData);
      
      // Get user's current stage from entityRegistry
      try {
        const userStageInfo = await entityRegistry.getUserStageInfo();
        setCurrentUserStage(userStageInfo.pointAccount.currentStage);
        console.log('User current stage:', userStageInfo.pointAccount.currentStage);
      } catch (error) {
        console.warn('Could not load user stage info, defaulting to stage 1:', error);
        setCurrentUserStage(1);
      }
    } catch (error: any) {
      console.error('Error loading stages:', error);
      toast.error('Fehler beim Laden der Stufen');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stageNumber: number, color?: string) => {
    if (color) return color;
    
    // Default color scheme based on stage number
    const colors = [
      '#10B981', // Green
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#EC4899', // Pink
      '#6366F1', // Indigo
      '#14B8A6', // Teal
      '#F97316', // Orange
      '#DC2626'  // Dark Red
    ];
    return colors[(stageNumber - 1) % colors.length];
  };

  const getStageStatus = (stageNumber: number) => {
    // DOMs and ADMINs can see all stages without restrictions
    if (user?.role === 'DOM' || user?.role === 'ADMIN') {
      // For DOMs, show stages in a more informational way
      if (stageNumber === currentUserStage) return 'current';
      if (stageNumber < currentUserStage) return 'completed';
      return 'available'; // Instead of 'locked' for DOMs
    }
    
    // SUBs see the restricted view
    if (stageNumber < currentUserStage) return 'completed';
    if (stageNumber === currentUserStage) return 'current';
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current': return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'available': return <Star className="h-5 w-5 text-blue-600" />;
      case 'locked': return <Lock className="h-5 w-5 text-gray-400" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'current': return 'Aktuelle Stufe';
      case 'available': return 'Verfügbar';
      case 'locked': return 'Gesperrt';
      default: return 'Verfügbar';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Alle Stufen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
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
            <Trophy className="h-5 w-5" />
            Alle Stufen ({stages.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadStages}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Aktualisieren
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {stages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Noch keine Stufen vorhanden</p>
            <p className="text-sm">Erstelle neue Stufen über das + Menü</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stages
              .sort((a, b) => a.stageNumber - b.stageNumber)
              .map((stage) => {
                const status = getStageStatus(stage.stageNumber);
                const stageColor = getStageColor(stage.stageNumber, stage.color);
                
                return (
                  <div
                    key={stage.id}
                    className={`
                      border rounded-lg p-4 transition-all duration-200
                      ${status === 'current' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : ''}
                      ${status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}
                      ${status === 'available' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}
                      ${status === 'locked' ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Stage Number Circle */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: stageColor }}
                      >
                        {stage.stageNumber}
                      </div>
                      
                      {/* Stage Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{stage.name}</h3>
                          {getStatusIcon(status)}
                        </div>
                        {stage.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {stage.description}
                          </p>
                        )}
                        
                        {/* Enhanced Stage Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{stage.pointsRequired} Punkte erforderlich</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Seit {new Date(stage.createdAt).toLocaleDateString('de-DE')}</span>
                          </div>
                        </div>

                        {/* Entity Counts with Icons */}
                        {stage._count && (
                          <div className="flex items-center gap-4 text-xs mt-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                              <CheckSquare className="h-3 w-3 text-blue-600" />
                              <span>{stage._count.tasks} Aufgaben</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded">
                              <BookOpen className="h-3 w-3 text-red-600" />
                              <span>{stage._count.rules} Regeln</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded">
                              <Target className="h-3 w-3 text-green-600" />
                              <span>{stage._count.goals} Ziele</span>
                            </div>
                            {stage._count.progressions > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 rounded">
                                <Users className="h-3 w-3 text-purple-600" />
                                <span>{stage._count.progressions} Benutzer</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Edit Actions */}
                      {(user?.role === 'DOM' || user?.role === 'ADMIN') && (
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/stages/${stage.id}/edit`);
                            }}
                            className="h-8"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Stufe bearbeiten
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/stages/${stage.id}/entities`);
                            }}
                            className="h-8"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Entitäten verwalten
                          </Button>
                        </div>
                      )}

                      {/* Status Badge */}
                      <Badge 
                        variant={status === 'current' || status === 'available' ? 'default' : 'secondary'}
                        className="ml-auto"
                      >
                        {getStatusLabel(status)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}