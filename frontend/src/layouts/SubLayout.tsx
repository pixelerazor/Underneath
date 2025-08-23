import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Menu, Bell, Clock, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useConnectionStore } from '@/store/useConnectionStore';
import { JoinWithCode } from '@/components/sub/JoinWithCode';
import UserProfile from '@/components/profile/UserProfile';
import { PAGE_SECTIONS, getPageConfigByPath, getPageTitle } from '@/utils/pageConfig';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sidebar-Konfiguration (relative Pfade, da SubLayout unter /sub/* gerendert wird)
const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: 'dashboard' },
  { id: 'tasks', label: 'Aufgaben', path: 'tasks' },
  { id: 'rules', label: 'Regeln', path: 'rules' },
  { id: 'rewards', label: 'Belohnungen', path: 'rewards' },
  { id: 'punishments', label: 'Strafen', path: 'punishments' },
  { id: 'journal', label: 'Tagebuch', path: 'journal' },
  { id: 'report', label: 'Report', path: 'report', icon: Clock },
];


export function SubLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { connectedDom, connectedSub } = useConnectionStore();

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-redirect to #basic if on comprehensive tab without hash
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'comprehensive' && !window.location.hash) {
      navigate('/profile?tab=comprehensive#basic', { replace: true });
    }
  }, [location.search, navigate]);

  // Get page configuration
  const pageConfig = useMemo(() => {
    return getPageConfigByPath(location.pathname, location.search);
  }, [location.pathname, location.search, currentHash]);

  const pageTitle = useMemo(() => {
    return getPageTitle(location.pathname);
  }, [location.pathname]);

  const { section: currentSection, currentTab, currentSubTab } = pageConfig;

  // Ohne DOM-Verbindung -> JoinWithCode anzeigen
  if (!connectedDom) {
    return <JoinWithCode />;
  }

  const handleNavigation = (path: string) => {
    // Wenn absoluter Pfad (z.B. /profile), direkt navigieren
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      navigate(path); // relativ zu /sub/*
    }
    setSidebarOpen(false);
  };

  // Prüfe ob wir auf der Profilseite sind
  const isProfilePage = location.pathname.startsWith('/profile');
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Werte aus dem Store ziehen (falls vorhanden), sonst Platzhalter
  const level = connectedDom.level ?? 1;
  const points = connectedSub?.points ?? 0;
  const maxPoints = connectedSub?.maxPoints ?? 100;

  const tasksCompleted = 0; // TODO: später aus API/Store laden
  const tasksTotal = 0; // TODO: später aus API/Store laden

  const tasksPct = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
  const pointsPct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Hamburger Menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menü öffnen">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <nav className="mt-6 space-y-1">
                  {SIDEBAR_ITEMS.map((item) => {
                    const active = location.pathname.startsWith(`/sub/${item.path}`);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                          active ? 'bg-secondary' : 'hover:bg-secondary/50'
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </button>
                    );
                  })}
                  
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
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Center: Page Title */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{pageTitle}</span>
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
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Benachrichtigungen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-t bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Level {level}</span>
            <span className="text-xs font-medium">
              {points}/{maxPoints} Punkte
            </span>
          </div>
          <Progress value={pointsPct} className="h-2" />
        </div>

        {/* Main Tab Bar */}
        {currentSection && (
          <div className="border-t overflow-x-auto">
            <Tabs value={currentTab?.id || ''} onValueChange={(value) => {
              const tab = currentSection.tabs.find(t => t.id === value);
              if (tab) {
                console.log('SubLayout navigating to:', tab.path);
                navigate(tab.path);
              }
            }}>
              <TabsList className="inline-flex h-10 rounded-none bg-transparent w-full justify-start">
                {currentSection.tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:border-transparent data-[state=active]:shadow-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Sub Tab Bar (for detailed sections like profile editing) */}
        {currentTab?.subTabs && (
          <div className="border-t bg-muted/20 overflow-x-auto">
            <div className="inline-flex h-9 items-center w-full px-2">
              {currentTab.subTabs.map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => {
                    // Navigate to the main path and set hash
                    navigate(`/profile?tab=comprehensive#${subTab.id}`);
                    // Also update browser hash
                    window.location.hash = `#${subTab.id}`;
                    // Trigger a small delay to ensure hash is set
                    setTimeout(() => {
                      const element = document.getElementById(subTab.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                    currentSubTab?.id === subTab.id || window.location.hash === `#${subTab.id}`
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {subTab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Heutige Aufgaben */}
          <div className="rounded-lg border p-4 bg-card">
            <h3 className="font-semibold mb-2">Heutige Aufgaben</h3>
            <div className="text-2xl font-bold text-primary">
              {tasksCompleted}/{tasksTotal}
            </div>
            <Progress value={tasksPct} className="mt-2" />
          </div>

          {/* Status */}
          <div className="rounded-lg border p-4 bg-card">
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="text-2xl font-bold text-primary">{user?.status ?? 'Aktiv'}</div>
            <p className="text-sm text-muted-foreground mt-2">Seit {/* TODO */} heute</p>
          </div>
        </div>

        {/* Route Content */}
        {isProfilePage ? <UserProfile /> : <Outlet />}
      </main>

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => navigate('report')}
        aria-label="Daily Report öffnen"
      >
        <Clock className="h-6 w-6" />
      </Button>
    </div>
  );
}
