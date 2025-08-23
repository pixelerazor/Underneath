import { useState, useMemo, useEffect } from 'react';
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
import UserProfile from '@/components/profile/UserProfile';
import { PAGE_SECTIONS, getPageConfigByPath, getPageTitle } from '@/utils/pageConfig';
import { cn } from '@/lib/utils';


export function DomLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { connectedSub } = useConnectionStore();

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
  
  


  // Wenn kein Sub verbunden, zeige Welcome Screen
  if (!connectedSub) {
    return <WelcomeScreen />;
  }

  const handleSectionChange = (sectionId: string) => {
    const section = PAGE_SECTIONS[sectionId];
    if (section && section.tabs.length > 0) {
      navigate(section.tabs[0].path);
    }
    setSidebarOpen(false);
  };

  const handlePlusClick = () => {
    // Kontextabhängige Aktion
    console.log('Plus clicked in section:', currentSection?.id);
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
                {Object.entries(PAGE_SECTIONS).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => handleSectionChange(key)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      currentSection?.id === key ? 'bg-secondary' : 'hover:bg-secondary/50'
                    )}
                  >
                    {section.label}
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

        {/* Main Tab Bar */}
        {currentSection && (
          <div className="border-t overflow-x-auto">
            <Tabs value={currentTab?.id || ''} onValueChange={(value) => {
              const tab = currentSection.tabs.find(t => t.id === value);
              if (tab) {
                console.log('Navigating to:', tab.path);
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
                    console.log('DomLayout: Sub-tab clicked:', subTab.id);
                    // Only use navigate - this will trigger hash change naturally
                    navigate(`/profile?tab=comprehensive#${subTab.id}`);
                    console.log('DomLayout: Navigated to:', `/profile?tab=comprehensive#${subTab.id}`);
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
        {currentSection?.id === 'profile' ? <UserProfile /> : <Outlet />}
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
