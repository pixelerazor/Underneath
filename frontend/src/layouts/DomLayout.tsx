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
import { FloatingActionMenu } from '@/components/fab/FloatingActionMenu';
import { cn } from '@/lib/utils';


export function DomLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { connectedSub } = useConnectionStore();

  // Check if we're on the Stufenplan page and should hide navigation tabs only
  const isStufenplanPage = location.pathname === '/education/stufenplan';
  const hideNavigationTabs = isStufenplanPage;

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
        <div className="flex h-14 items-center px-4 relative">
          {/* Hamburger Menu */}
          <div className="absolute left-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-1">
                  {Object.entries(PAGE_SECTIONS)
                    .filter(([key]) => !['tasks', 'rules', 'rewards', 'punishments', 'profile'].includes(key))
                    .map(([key, section]) => (
                      <button
                        key={key}
                        onClick={() => handleSectionChange(key)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          currentSection?.id === key ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10 hover:text-primary'
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
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-primary/10 hover:text-primary flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-primary/10 hover:text-primary flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Einstellungen
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
          </div>

          {/* Centered Page Title */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-lg font-semibold">{pageTitle}</span>
          </div>

          {/* Right placeholder for symmetry */}
          <div className="absolute right-4 w-10"></div>
        </div>

        {/* Main Tab Bar - Hidden on Stufenplan page */}
        {currentSection && !hideNavigationTabs && (
          <div className="border-t overflow-x-auto">
            <Tabs value={currentTab?.id || ''} onValueChange={(value) => {
              const tab = currentSection.tabs.find(t => t.id === value);
              if (tab) {
                console.log('Navigating to:', tab.path);
                navigate(tab.path);
              }
            }}>
              <TabsList className="inline-flex h-10 rounded-none bg-transparent w-full justify-center min-h-[44px]">
                {currentSection.tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:border-transparent data-[state=active]:shadow-none min-h-[44px] px-4"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Sub Tab Bar - same design as main tab bar - Hidden on Stufenplan page */}
        {currentSection && !hideNavigationTabs && currentSection.tabs.some(tab => tab.subTabs) && (() => {
          // Always show sub-tabs for sections that have them (education, profile)
          const tabWithSubTabs = currentSection.tabs.find(tab => tab.subTabs);
          if (!tabWithSubTabs?.subTabs) return null;
          
          return (
            <div className="border-t overflow-x-auto">
              <Tabs value={currentSubTab?.id || ''} onValueChange={(value) => {
                const subTab = tabWithSubTabs.subTabs?.find(t => t.id === value);
                if (subTab) {
                  console.log('Navigating to sub-tab:', subTab.path);
                  navigate(subTab.path);
                }
              }}>
                <TabsList className="inline-flex h-10 rounded-none bg-transparent w-full justify-center min-h-[44px]">
                  {tabWithSubTabs.subTabs.map((subTab) => (
                    <TabsTrigger
                      key={subTab.id}
                      value={subTab.id}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:border-transparent data-[state=active]:shadow-none min-h-[44px] px-4"
                    >
                      {subTab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          );
        })()}
      </header>

      {/* Main Content */}
      <main className={`flex-1 container mx-auto px-4 py-6 ${hideNavigationTabs ? 'pb-6' : 'pb-20'}`}>
        {currentSection?.id === 'profile' ? <UserProfile /> : <Outlet />}
      </main>

      {/* Bottom Bar - Hidden on Stufenplan page */}
      {!hideNavigationTabs && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
        {connectedSub ? (
          <div className="flex items-center justify-center px-4 h-14">
            <div className="flex flex-col items-center">
              <span className="text-red-600 font-bold text-sm">[UNDERNEATH]</span>
              <div className="w-16 h-0.5 bg-red-600 my-1"></div>
              <span className="text-xs text-muted-foreground">{connectedSub.name}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center px-4 h-14">
            <span className="text-muted-foreground">Kein Sub verbunden</span>
          </div>
        )}
        </footer>
      )}

      {/* Floating Action Menu - Always visible */}
      <FloatingActionMenu />
    </div>
  );
}
