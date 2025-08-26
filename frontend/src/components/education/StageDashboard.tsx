/**
 * Stage Dashboard Component
 * 
 * Main dashboard showing only active stages
 * Uses AllStagesView with filtering for active stages only
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { AllStagesView } from './AllStagesView';

export function StageDashboard() {
  return <AllStagesView showOnlySubActive={true} />;
}