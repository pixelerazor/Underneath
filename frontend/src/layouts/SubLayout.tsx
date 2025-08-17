import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Menu, Bell, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/store/useAuthStore';
import { useConnectionStore } from '@/store/useConnectionStore';
import { JoinWithCode } from '@/components/sub/JoinWithCode';
import { cn } from '@/lib/utils';

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
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { connectedDom, connectedSub } = useConnectionStore();

  // Ohne DOM-Verbindung -> JoinWithCode anzeigen
  if (!connectedDom) {
    return <JoinWithCode />;
  }

  const handleNavigation = (path: string) => {
    navigate(path); // relativ zu /sub/*
    setSidebarOpen(false);
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
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Center: App Name + Dom Name */}
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Underneath {connectedDom.name}</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Benachrichtigungen">
            <Bell className="h-5 w-5" />
          </Button>
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
        <Outlet />
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
