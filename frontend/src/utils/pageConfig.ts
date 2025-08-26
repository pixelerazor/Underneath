/**
 * Page Configuration
 * 
 * Centralized configuration for page titles and navigation structure
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

export interface SubTab {
  id: string;
  label: string;
  path: string;
}

export interface PageTab {
  id: string;
  label: string;
  path: string;
  subTabs?: SubTab[];
}

export interface PageSection {
  id: string;
  label: string;
  title: string; // Display title in header
  tabs: PageTab[];
}

// Page configuration mapping
export const PAGE_SECTIONS: Record<string, PageSection> = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Dashboard',
    tabs: [
      { id: 'overview', label: 'Übersicht', path: '/dashboard/overview' },
      { id: 'stats', label: 'Statistiken', path: '/dashboard/stats' },
      { id: 'activities', label: 'Aktivitäten', path: '/dashboard/activities' },
    ],
  },
  education: {
    id: 'education',
    label: 'Stufenplan der Erziehung',
    title: 'Stufenplan der Erziehung',
    tabs: [
      { 
        id: 'stufenplan', 
        label: 'Stufenplan', 
        path: '/education/stufenplan',
        subTabs: [
          { id: 'initiationsriten', label: 'Initiationsriten', path: '/education/stufenplan#initiationsriten' },
          { id: 'privilegien', label: 'Privilegien', path: '/education/stufenplan#privilegien' },
          { id: 'strafen', label: 'Strafen', path: '/education/stufenplan#strafen' },
          { id: 'tpe', label: 'TPE', path: '/education/stufenplan#tpe' },
        ]
      },
      { id: 'ziele', label: 'Ziele', path: '/education/ziele' },
      { id: 'regeln', label: 'Regeln', path: '/education/regeln' },
      { id: 'aufgaben', label: 'Aufgaben', path: '/education/aufgaben' },
    ],
  },
  control: {
    id: 'control',
    label: 'Kontrolle & Überwachung',
    title: 'Kontrolle & Überwachung',
    tabs: [
      { id: 'keuschheit', label: 'Keuschheit', path: '/control/keuschheit' },
      { id: 'koerper', label: 'Körper', path: '/control/koerper' },
      { id: 'geist', label: 'Geist', path: '/control/geist' },
      { id: 'ortung', label: 'Ortung', path: '/control/ortung' },
    ],
  },
  journal: {
    id: 'journal',
    label: 'Tagebuch & Dokumente',
    title: 'Tagebuch & Dokumente',
    tabs: [
      { id: 'erkenntnisse', label: 'Neue Erkenntnisse', path: '/journal/erkenntnisse' },
      { id: 'informationen', label: 'Allgemeine Informationen', path: '/journal/informationen' },
      { id: 'rueckfaelle', label: 'Rückfälle', path: '/journal/rueckfaelle' },
      { id: 'faq', label: 'FAQ', path: '/journal/faq' },
      { id: 'trigger', label: 'Trigger', path: '/journal/trigger' },
    ],
  },
  calendar: {
    id: 'calendar',
    label: 'Kalender',
    title: 'Kalender',
    tabs: [
      { id: 'overview', label: 'Übersicht', path: '/calendar/overview' },
    ],
  },
  tasks: {
    id: 'tasks',
    label: 'Aufgaben',
    title: 'Aufgaben-Management',
    tabs: [
      { id: 'create', label: 'Erstellen', path: '/tasks/create' },
      { id: 'active', label: 'Aktiv', path: '/tasks/active' },
      { id: 'completed', label: 'Erledigt', path: '/tasks/completed' },
      { id: 'templates', label: 'Vorlagen', path: '/tasks/templates' },
    ],
  },
  rules: {
    id: 'rules',
    label: 'Regeln',
    title: 'Regeln & Protokolle',
    tabs: [
      { id: 'general', label: 'Allgemein', path: '/rules/general' },
      { id: 'daily', label: 'Täglich', path: '/rules/daily' },
      { id: 'protocols', label: 'Protokolle', path: '/rules/protocols' },
      { id: 'consequences', label: 'Konsequenzen', path: '/rules/consequences' },
    ],
  },
  rewards: {
    id: 'rewards',
    label: 'Belohnungen',
    title: 'Belohnungs-System',
    tabs: [
      { id: 'available', label: 'Verfügbar', path: '/rewards/available' },
      { id: 'earned', label: 'Verdient', path: '/rewards/earned' },
      { id: 'shop', label: 'Shop', path: '/rewards/shop' },
      { id: 'history', label: 'Verlauf', path: '/rewards/history' },
    ],
  },
  punishments: {
    id: 'punishments',
    label: 'Strafen',
    title: 'Strafen-Verwaltung',
    tabs: [
      { id: 'assign', label: 'Zuweisen', path: '/punishments/assign' },
      { id: 'active', label: 'Aktiv', path: '/punishments/active' },
      { id: 'completed', label: 'Abgeschlossen', path: '/punishments/completed' },
      { id: 'types', label: 'Arten', path: '/punishments/types' },
    ],
  },
  profile: {
    id: 'profile',
    label: 'Profil',
    title: 'Mein Profil',
    tabs: [
      { 
        id: 'overview', 
        label: 'Profil', 
        path: '/profile',
      },
      { 
        id: 'comprehensive', 
        label: 'Detaillierte Daten', 
        path: '/profile?tab=comprehensive',
        subTabs: [
          { id: 'basic', label: 'Basisdaten', path: '/profile?tab=comprehensive#basic' },
          { id: 'lifestyle', label: 'Lebenssituation', path: '/profile?tab=comprehensive#lifestyle' },
          { id: 'bdsm', label: 'Grenzen & Sicherheit', path: '/profile?tab=comprehensive#bdsm' },
          { id: 'role', label: 'Rollen-Spezifisch', path: '/profile?tab=comprehensive#role' },
        ]
      },
      { id: 'connections', label: 'Verbindungen', path: '/profile?tab=connections' },
      { id: 'security', label: 'Sicherheit', path: '/profile?tab=security' },
    ],
  },
};

/**
 * Get page configuration by URL path
 */
export function getPageConfigByPath(pathname: string, search?: string): {
  section: PageSection | null;
  currentTab: PageTab | null;
  currentSubTab: SubTab | null;
} {
  // Determine section
  let sectionId = 'dashboard'; // default
  if (pathname.includes('/tasks')) sectionId = 'tasks';
  else if (pathname.includes('/education')) sectionId = 'education';
  else if (pathname.includes('/control')) sectionId = 'control';
  else if (pathname.includes('/journal')) sectionId = 'journal';
  else if (pathname.includes('/calendar')) sectionId = 'calendar';
  else if (pathname.includes('/rules')) sectionId = 'rules';
  else if (pathname.includes('/rewards')) sectionId = 'rewards';
  else if (pathname.includes('/punishments')) sectionId = 'punishments';
  else if (pathname.includes('/profile')) sectionId = 'profile';

  const section = PAGE_SECTIONS[sectionId];
  if (!section) return { section: null, currentTab: null, currentSubTab: null };

  // Find current tab
  const searchParams = new URLSearchParams(search || window.location.search);
  const tabParam = searchParams.get('tab');
  
  let currentTab: PageTab | null = null;
  
  if (sectionId === 'profile') {
    if (tabParam) {
      // If we have a tab parameter, find the matching tab
      currentTab = section.tabs.find(tab => tab.id === tabParam) || null;
    } else {
      // Default to overview if no tab parameter
      currentTab = section.tabs.find(tab => tab.id === 'overview') || section.tabs[0] || null;
    }
  } else {
    // For other sections, use path-based matching
    currentTab = section.tabs.find(tab => {
      if (tab.path === pathname) return true;
      return pathname.startsWith(tab.path.split('?')[0]);
    }) || null;
  }

  // Find current sub-tab (if any)
  let currentSubTab: SubTab | null = null;
  if (currentTab?.subTabs) {
    const hash = window.location.hash.replace('#', '');
    currentSubTab = currentTab.subTabs.find(subTab => subTab.id === hash) || null;
  }

  
  return { section, currentTab, currentSubTab };
}

/**
 * Get page title for header display
 */
export function getPageTitle(pathname: string): string {
  const { section, currentTab, currentSubTab } = getPageConfigByPath(pathname);
  
  if (currentSubTab) {
    return `${section?.title} - ${currentSubTab.label}`;
  }
  
  if (currentTab && currentTab.id !== 'overview') {
    return `${section?.title} - ${currentTab.label}`;
  }
  
  return section?.title || 'Dashboard';
}