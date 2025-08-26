/**
 * Stage Statistics Configuration
 * 
 * Central configuration for stage statistics cards with expansion functionality
 * Used across AllStagesView, StageDashboard, and other stage-related components
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { 
  CheckCircle, 
  Target, 
  BookOpen, 
  TrendingUp,
  Crown,
  Gift,
  Zap,
  Heart,
  type LucideIcon
} from 'lucide-react';

export type EntityType = 'tasks' | 'rules' | 'goals' | 'initiationsriten' | 'privilegien' | 'strafen' | 'tpe';
export type StatisticType = EntityType | 'completed';

export interface StatisticCardConfig {
  id: StatisticType;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  entityType: EntityType; // Which API endpoint to call
  getStatValue: (stats: any) => number | string;
  description?: string;
  filterEntities?: (entities: any[]) => any[]; // Optional filter for entities
}

export const STAGE_STATISTICS_CONFIG: StatisticCardConfig[] = [
  {
    id: 'tasks',
    label: 'Offene Aufgaben',
    icon: Target,
    iconColor: 'text-blue-600', 
    entityType: 'tasks',
    getStatValue: (stats) => stats.pendingTasks || 0,
    description: 'Noch zu erledigende Aufgaben',
    filterEntities: (entities) => entities.filter((e: any) => e.status !== 'completed')
  },
  {
    id: 'rules',
    label: 'Aktive Regeln',
    icon: BookOpen,
    iconColor: 'text-purple-600',
    entityType: 'rules', 
    getStatValue: (stats) => stats.activeRules || 0,
    description: 'Derzeit gültige Regeln',
    filterEntities: (entities) => entities.filter((e: any) => e.isActive === true)
  }
];

export const API_ENDPOINTS: Record<EntityType, string> = {
  tasks: '/tasks',
  rules: '/rules', 
  goals: '/goals',
  initiationsriten: '/tasks', // Temp: Use tasks until API exists
  privilegien: '/rules', // Temp: Use rules until API exists
  strafen: '/strafen',
  tpe: '/tpe'
};

export const ENTITY_LABELS: Record<EntityType, string> = {
  tasks: 'Aufgaben',
  rules: 'Regeln',
  goals: 'Ziele',
  initiationsriten: 'Initiationsriten',
  privilegien: 'Privilegien', 
  strafen: 'Strafen',
  tpe: 'TPE'
};

// Stage System Entities Configuration (separate from main statistics)
export const STAGE_SYSTEM_ENTITIES: StatisticCardConfig[] = [
  {
    id: 'initiationsriten',
    label: 'Initiationsriten',
    icon: Crown,
    iconColor: 'text-yellow-600',
    entityType: 'initiationsriten',
    getStatValue: () => 0, // Will be dynamically loaded
    description: 'Zeremonien und Rituale für Stufenaufstiege'
  },
  {
    id: 'privilegien',
    label: 'Privilegien', 
    icon: Gift,
    iconColor: 'text-emerald-600',
    entityType: 'privilegien',
    getStatValue: () => 0, // Will be dynamically loaded
    description: 'Besondere Rechte und Freiheiten'
  },
  {
    id: 'strafen',
    label: 'Strafen',
    icon: Zap,
    iconColor: 'text-red-600',
    entityType: 'strafen', 
    getStatValue: () => 0, // Will be dynamically loaded
    description: 'Konsequenzen und Disziplinarmaßnahmen'
  },
  {
    id: 'tpe',
    label: 'TPE',
    icon: Heart,
    iconColor: 'text-pink-600',
    entityType: 'tpe',
    getStatValue: () => 0, // Will be dynamically loaded
    description: 'Total Power Exchange Elemente'
  }
];