/**
 * EntityDetailDrawer Component
 * 
 * Side panel drawer for displaying detailed information about entities (tasks, rules, goals, etc.)
 * Slides in from the right with full entity details and actions
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  User, 
  Clock, 
  Flag,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { type EntityType } from '@/config/stageStatisticsConfig';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { entityRegistry } from '@/services/entityRegistry';

export interface EntityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entity: any;
  entityType: EntityType;
  entityTitle: string;
  onEntityUpdated?: (updatedEntity: any) => void;
  onEntityDeleted?: (entityId: string) => void;
}

export function EntityDetailDrawer({
  isOpen,
  onClose,
  entity,
  entityType,
  entityTitle,
  onEntityUpdated,
  onEntityDeleted
}: EntityDetailDrawerProps) {
  const { user } = useAuthStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: entity?.title || '',
    description: entity?.description || '',
    priority: entity?.priority || 'medium'
  });

  if (!entity) return null;

  // Map our EntityType to the correct registry EntityType
  const getRegistryEntityType = (type: EntityType) => {
    switch (type) {
      case 'tasks': return 'TASK';
      case 'rules': return 'RULE';
      case 'goals': return 'GOAL';
      default: return type.toUpperCase();
    }
  };

  // Update form when entity changes
  useEffect(() => {
    if (entity) {
      setEditForm({
        title: entity.title || '',
        description: entity.description || '',
        priority: entity.priority || 'medium'
      });
    }
  }, [entity]);

  const handleEdit = async () => {
    if (!entity?.id) return;
    
    setIsEditing(true);
    try {
      const registryEntityType = getRegistryEntityType(entityType) as any;
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority
      };

      const updatedEntity = await entityRegistry.updateEntity(
        registryEntityType, 
        entity.id, 
        updateData
      );

      toast.success(`${entityTitle} erfolgreich aktualisiert`);
      setIsEditDialogOpen(false);
      
      // Notify parent component
      if (onEntityUpdated) {
        onEntityUpdated(updatedEntity);
      }
      
      // Close drawer after successful update
      onClose();
      
    } catch (error) {
      console.error('Error updating entity:', error);
      toast.error(`Fehler beim Aktualisieren der ${entityTitle}`);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!entity?.id) return;
    
    setIsDeleting(true);
    try {
      const registryEntityType = getRegistryEntityType(entityType) as any;
      
      await entityRegistry.deleteEntity(registryEntityType, entity.id);
      
      toast.success(`${entityTitle} erfolgreich gelöscht`);
      
      // Notify parent component
      if (onEntityDeleted) {
        onEntityDeleted(entity.id);
      }
      
      // Close drawer after successful deletion
      onClose();
      
    } catch (error) {
      console.error('Error deleting entity:', error);
      toast.error(`Fehler beim Löschen der ${entityTitle}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active':
        return <Circle className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string, isActive?: boolean) => {
    if (status) {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-700';
        case 'active':
          return 'bg-blue-100 text-blue-700';
        case 'pending':
          return 'bg-orange-100 text-orange-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
    
    if (isActive !== undefined) {
      return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    }
    
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status?: string, isActive?: boolean) => {
    if (status) {
      switch (status) {
        case 'completed':
          return 'Abgeschlossen';
        case 'active':
          return 'Aktiv';
        case 'pending':
          return 'Ausstehend';
        default:
          return status;
      }
    }
    
    if (isActive !== undefined) {
      return isActive ? 'Aktiv' : 'Inaktiv';
    }
    
    return 'Unbekannt';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nicht angegeben';
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = user?.role === 'DOM' || user?.role === 'ADMIN';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(entity.status)}
              <SheetTitle className="text-xl">{entity.title}</SheetTitle>
            </div>
            <Badge className={`${getStatusColor(entity.status, entity.isActive)} border-0`}>
              {getStatusLabel(entity.status, entity.isActive)}
            </Badge>
          </div>
          <SheetDescription>
            {entityTitle} • ID: {entity.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          {entity.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Beschreibung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {entity.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Created Date */}
              {entity.createdAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Erstellt</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entity.createdAt)}
                  </span>
                </div>
              )}

              {/* Due Date */}
              {entity.dueDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Fällig</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entity.dueDate)}
                  </span>
                </div>
              )}

              {/* Priority */}
              {entity.priority && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Priorität</span>
                  </div>
                  <Badge variant="outline">
                    {entity.priority === 'high' ? 'Hoch' :
                     entity.priority === 'medium' ? 'Mittel' :
                     entity.priority === 'low' ? 'Niedrig' : entity.priority}
                  </Badge>
                </div>
              )}

              {/* Points */}
              {entity.points !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Punkte</span>
                  </div>
                  <span className="text-sm font-medium">{entity.points}</span>
                </div>
              )}

              {/* Stage */}
              {entity.activeFromStage && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ab Stufe</span>
                  </div>
                  <Badge variant="secondary">{entity.activeFromStage}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Fields based on Entity Type */}
          {entityType === 'tasks' && entity.progress !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fortschritt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Abgeschlossen</span>
                    <span>{entity.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${entity.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {canEdit && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Aktionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setIsEditDialogOpen(true)}
                    disabled={isEditing || isDeleting}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        disabled={isEditing || isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Löschen
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Diese Aktion kann nicht rückgängig gemacht werden. Die {entityTitle} "{entity.title}" wird dauerhaft gelöscht.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Wird gelöscht...
                            </>
                          ) : (
                            'Löschen'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments/History (if available) */}
          {entity.comments && entity.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kommentare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entity.comments.map((comment: any, index: number) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{entityTitle} bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                disabled={isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                disabled={isEditing}
                rows={3}
              />
            </div>
            {entity.priority !== undefined && (
              <div className="grid gap-2">
                <Label htmlFor="priority">Priorität</Label>
                <select
                  id="priority"
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                  disabled={isEditing}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isEditing}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={isEditing || !editForm.title.trim()}
            >
              {isEditing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                'Speichern'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}