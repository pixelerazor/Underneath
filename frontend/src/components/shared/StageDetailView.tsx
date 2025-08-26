/**
 * StageDetailView Component
 * 
 * Shows full list of entities when "Show All" button is clicked
 * Reusable across different stage-related components
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft, AlertCircle, Edit3 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export interface StageDetailViewProps {
  stageName: string;
  entityTitle: string;
  entities: any[];
  onBack: () => void;
}

export function StageDetailView({
  stageName,
  entityTitle,
  entities,
  onBack
}: StageDetailViewProps) {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Übersicht
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Detail Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="h-5 w-5" />
            <div>
              <h2 className="text-2xl font-bold">
                {stageName} - {entityTitle}
              </h2>
              <p className="text-muted-foreground font-normal">
                Alle {entities.length} {entityTitle.toLowerCase()}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Entity List */}
      <div className="space-y-3">
        {entities.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine {entityTitle} gefunden</h3>
              <p className="text-muted-foreground">
                Für diese Stufe sind noch keine {entityTitle.toLowerCase()} angelegt.
              </p>
            </CardContent>
          </Card>
        ) : (
          entities.map((entity: any) => (
            <Card key={entity.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{entity.title}</h4>
                    {entity.description && (
                      <p className="text-sm text-muted-foreground">{entity.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {entity.status && (
                        <span className={`px-2 py-1 rounded ${
                          entity.status === 'completed' ? 'bg-green-100 text-green-700' :
                          entity.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {entity.status === 'completed' ? 'Abgeschlossen' :
                           entity.status === 'active' ? 'Aktiv' : 
                           entity.status}
                        </span>
                      )}
                      {entity.isActive !== undefined && (
                        <span className={`px-2 py-1 rounded ${
                          entity.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {entity.isActive ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      )}
                      {entity.createdAt && (
                        <span>Erstellt: {new Date(entity.createdAt).toLocaleDateString('de-DE')}</span>
                      )}
                    </div>
                  </div>
                  {(user?.role === 'DOM' || user?.role === 'ADMIN') && (
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Bearbeiten
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}