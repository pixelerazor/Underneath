import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Menu, Plus, Trophy, Award, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useConnectionStore } from '@/store/useConnectionStore';
import { WelcomeScreen } from '@/components/dom/WelcomeScreen';
import { cn } from '@/lib/utils';

// Tab-Konfigurationen für verschiedene Hauptbereiche
const TAB_CONFIGS = {
  dashboard: {
    label: 'Dashboard',
    tabs: [
      { id: 'overview', label: 'Übersicht', path: '/dashboard/overview' },
      { id: 'stats', label: 'Statistiken', path: '/dashboard/stats' },
      { id: 'activities', label: 'Aktivitäten', path: '/dashboard/activities' },
    ],
  },
  tasks: {
    label: 'Aufgaben',
    tabs: [
      { id: 'create', label: 'Erstellen', path: '/tasks/create' },
      { id: 'active', label: 'Aktiv', path: '/tasks/active' },
      { id: 'completed', label: 'Erledigt', path: '/tasks/completed' },
      { id: 'templates', label: 'Vorlagen', path: '/tasks/templates' },
    ],
  },
  rules: {
    label: 'Regeln',
    tabs: [
      { id: 'general', label: 'Allgemein', path: '/rules/general' },
      { id: 'daily', label: 'Täglich', path: '/rules/daily' },
      { id: 'protocols', label: 'Protokolle', path: '/rules/protocols' },
      { id: 'consequences', label: 'Konsequenzen', path: '/rules/consequences' },
    ],
  },
  rewards: {
    label: 'Belohnungen',
    tabs: [
      { id: 'available', label: 'Verfügbar', path: '/rewards/available' },
      { id: 'earned', label: 'Verdient', path: '/rewards/earned' },
      { id: 'shop', label: 'Shop', path: '/rewards/shop' },
      { id: 'history', label: 'Verlauf', path: '/rewards/history' },
    ],
  },
  punishments: {
    label: 'Strafen',
    tabs: [
      { id: 'assign', label: 'Zuweisen', path: '/punishments/assign' },
      { id: 'active', label: 'Aktiv', path: '/punishments/active' },
      { id: 'completed', label: 'Abgeschlossen', path: '/punishments/completed' },
      { id: 'types', label: 'Arten', path: '/punishments/types' },
    ],
  },
};

export function DomLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { connectedSub } = useConnectionStore();

  // Bestimme aktuelle Section basierend auf URL
  const currentSection = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/rules')) return 'rules';
    if (path.includes('/rewards')) return 'rewards';
    if (path.includes('/punishments')) return 'punishments';
    return 'dashboard';
  }, [location.pathname]);

  const currentConfig = TAB_CONFIGS[currentSection];

  // Wenn kein Sub verbunden, zeige Welcome Screen
  if (!connectedSub) {
    return <WelcomeScreen />;
  }

  const handleSectionChange = (section: string) => {
    const config = TAB_CONFIGS[section as keyof typeof TAB_CONFIGS];
    if (config && config.tabs.length > 0) {
      navigate(config.tabs[0].path);
    }
    setSidebarOpen(false);
  };

  const handlePlusClick = () => {
    // Kontextabhängige Aktion
    console.log('Plus clicked in section:', currentSection);
    // Später: Öffne entsprechendes Modal
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Hamburger Menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-1">
                {Object.entries(TAB_CONFIGS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleSectionChange(key)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      currentSection === key ? 'bg-secondary' : 'hover:bg-secondary/50'
                    )}
                  >
                    {config.label}
                  </button>
                ))}
                
                {/* Profile & Logout Section */}
                <div className="border-t pt-4 mt-6">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-secondary/50 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-destructive/10 text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Abmelden
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Center: Role + Name */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">DOM</span>
            <span className="text-sm font-semibold">{user?.displayName || user?.email}</span>
          </div>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePlusClick}>
                <Plus className="mr-2 h-4 w-4" />
                Neu erstellen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tab Bar */}
        {currentConfig && (
          <div className="border-t overflow-x-auto">
            <Tabs value={location.pathname}>
              <TabsList className="inline-flex h-10 rounded-none bg-transparent w-full">
                {currentConfig.tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={cn(
                      'rounded-none',
                      location.pathname === tab.path && 'border-b-2 border-primary'
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        <Outlet />
      </main>

      {/* Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
        {connectedSub ? (
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Stufe {connectedSub.level}</span>
                <span className="text-xs font-medium">{connectedSub.levelTitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Underneath:</span>
              <span className="text-sm font-semibold">{connectedSub.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Punkte</span>
                <span className="text-xs font-medium">
                  {connectedSub.points}/{connectedSub.maxPoints}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center px-4 h-14">
            <span className="text-muted-foreground">Kein Sub verbunden</span>
          </div>
        )}
      </footer>
    </div>
  );
}
