/**
 * Stufenplan Page Component
 * 
 * Main education system page showing all stages with their entities
 * Uses the card-based design for each stage with real data from the database
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TreePine, 
  LayoutGrid
} from 'lucide-react';
import { AllStagesView } from '@/components/education/AllStagesView';
import { StageDashboard } from '@/components/education/StageDashboard';
import { StageOverview } from '@/components/education/StageOverview';
import { EntityTreeView } from '@/components/education/EntityTreeView';

export function StufenplanPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Stufenplan-System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Übersicht über alle Stufen mit ihren Aufgaben, Regeln und Zielen. 
            Jede Stufe zeigt ihre eigenen Entitäten und Statistiken an.
          </p>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs defaultValue="all-stages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-stages" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Alle Stufen
          </TabsTrigger>
          <TabsTrigger value="current-stage" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Aktuelle Stufe
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="tree-view" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Baum-Ansicht
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-stages" className="space-y-6">
          <AllStagesView />
        </TabsContent>

        <TabsContent value="current-stage" className="space-y-6">
          <StageDashboard />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <StageOverview />
        </TabsContent>

        <TabsContent value="tree-view" className="space-y-6">
          <EntityTreeView />
        </TabsContent>
      </Tabs>
    </div>
  );
}