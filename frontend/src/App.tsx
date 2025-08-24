import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DomLayout } from './layouts/DomLayout';
import { SubLayout } from './layouts/SubLayout';
import { JoinWithCode } from './components/sub/JoinWithCode';
import PlaceholderPage from './components/common/PlaceholderPage';
import ProfileCompletionWizard from './components/onboarding/ProfileCompletionWizard';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import NotificationService from './services/notificationService';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
  );
}

function DashboardRouter() {
  const user = useAuthStore((state) => state.user);
  const searchParams = new URLSearchParams(window.location.search);
  const skipOnboarding = searchParams.get('skip_onboarding') === 'true';
  
  // Skip onboarding for direct routes or emergency routes
  const isDirect = window.location.pathname === '/dashboard/direct' || 
                   window.location.pathname === '/escape';

  // Check if user needs to complete profile (unless explicitly skipping)
  // Skip onboarding check for profile page since it may be needed for profile completion
  const isProfilePage = window.location.pathname === '/profile';
  const isDashboardPage = window.location.pathname.startsWith('/dashboard');
  const isEducationPage = window.location.pathname.startsWith('/education');
  const isControlPage = window.location.pathname.startsWith('/control');
  const isJournalPage = window.location.pathname.startsWith('/journal');
  const isCalendarPage = window.location.pathname.startsWith('/calendar');
  if (user && !user.profileCompleted && !skipOnboarding && !isDirect && !isProfilePage && !isDashboardPage && !isEducationPage && !isControlPage && !isJournalPage && !isCalendarPage && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.role === 'DOM') {
    return <DomLayout />;
  }
  if (user?.role === 'SUB') {
    return <SubLayout />;
  }

  // Später evtl. ObserverLayout
  return <Navigate to="/login" />;
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Push-Berechtigung beim App-Start anfordern (nur für eingeloggte User)
  useEffect(() => {
    if (isAuthenticated) {
      // Kurz warten, dann Notification-Permission anfordern
      const timer = setTimeout(() => {
        console.log('Requesting notification permission for authenticated user...');
        NotificationService.requestPermission();
      }, 2000); // 2 Sekunden nach Login

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster 
        position="top-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(0 0% 15%)',
            border: '2px solid hsl(0 62% 30%)',
            color: 'hsl(0 0% 75%)',
            borderRadius: '0.5rem',
          },
          className: 'my-toast',
        }}
        richColors={false}
      />
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate 
              to={isAuthenticated ? '/dashboard/overview?skip_onboarding=true' : '/login'} 
              replace 
            />
          }
        />

        {/* Direct dashboard access - always allow */}
        <Route
          path="/dashboard/direct"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Emergency escape route */}
        <Route
          path="/escape"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard/overview?skip_onboarding=true" replace />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requireAuth={false}>
              <AuthLayout>
                <RegisterForm />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/join"
          element={
            <ProtectedRoute requireAuth={false}>
              <JoinWithCode />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<PlaceholderPage section="dashboard" tab="overview" />} />
          <Route path="stats" element={<PlaceholderPage section="dashboard" tab="stats" />} />
          <Route
            path="activities"
            element={<PlaceholderPage section="dashboard" tab="activities" />}
          />
        </Route>

        {/* Education */}
        <Route
          path="/education/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/education/stufenplan" replace />} />
          <Route path="stufenplan" element={<PlaceholderPage section="education" tab="stufenplan" />} />
          <Route path="werte" element={<PlaceholderPage section="education" tab="werte" />} />
          <Route path="ziele" element={<PlaceholderPage section="education" tab="ziele" />} />
          <Route path="regeln" element={<PlaceholderPage section="education" tab="regeln" />} />
          <Route path="routinen" element={<PlaceholderPage section="education" tab="routinen" />} />
          <Route path="aufgaben" element={<PlaceholderPage section="education" tab="aufgaben" />} />
        </Route>

        {/* Control & Monitoring */}
        <Route
          path="/control/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/control/keuschheit" replace />} />
          <Route path="keuschheit" element={<PlaceholderPage section="control" tab="keuschheit" />} />
          <Route path="koerper" element={<PlaceholderPage section="control" tab="koerper" />} />
          <Route path="geist" element={<PlaceholderPage section="control" tab="geist" />} />
          <Route path="ortung" element={<PlaceholderPage section="control" tab="ortung" />} />
        </Route>

        {/* Journal & Documents */}
        <Route
          path="/journal/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/journal/erkenntnisse" replace />} />
          <Route path="erkenntnisse" element={<PlaceholderPage section="journal" tab="erkenntnisse" />} />
          <Route path="informationen" element={<PlaceholderPage section="journal" tab="informationen" />} />
          <Route path="rueckfaelle" element={<PlaceholderPage section="journal" tab="rueckfaelle" />} />
          <Route path="faq" element={<PlaceholderPage section="journal" tab="faq" />} />
          <Route path="trigger" element={<PlaceholderPage section="journal" tab="trigger" />} />
        </Route>

        {/* Calendar */}
        <Route
          path="/calendar/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/calendar/overview" replace />} />
          <Route path="overview" element={<PlaceholderPage section="calendar" tab="overview" />} />
        </Route>

        {/* Tasks */}
        <Route
          path="/tasks/*"
          element={
            <ProtectedRoute>
              <DomLayout />
            </ProtectedRoute>
          }
        >
          <Route path="create" element={<PlaceholderPage section="tasks" tab="create" />} />
          <Route path="active" element={<PlaceholderPage section="tasks" tab="active" />} />
          <Route path="completed" element={<PlaceholderPage section="tasks" tab="completed" />} />
          <Route path="templates" element={<PlaceholderPage section="tasks" tab="templates" />} />
        </Route>

        {/* Rules */}
        <Route
          path="/rules/*"
          element={
            <ProtectedRoute>
              <DomLayout />
            </ProtectedRoute>
          }
        >
          <Route path="general" element={<PlaceholderPage section="rules" tab="general" />} />
          <Route path="daily" element={<PlaceholderPage section="rules" tab="daily" />} />
          <Route path="protocols" element={<PlaceholderPage section="rules" tab="protocols" />} />
          <Route
            path="consequences"
            element={<PlaceholderPage section="rules" tab="consequences" />}
          />
        </Route>

        {/* Rewards */}
        <Route
          path="/rewards/*"
          element={
            <ProtectedRoute>
              <DomLayout />
            </ProtectedRoute>
          }
        >
          <Route path="available" element={<PlaceholderPage section="rewards" tab="available" />} />
          <Route path="earned" element={<PlaceholderPage section="rewards" tab="earned" />} />
          <Route path="shop" element={<PlaceholderPage section="rewards" tab="shop" />} />
          <Route path="history" element={<PlaceholderPage section="rewards" tab="history" />} />
        </Route>

        {/* Punishments */}
        <Route
          path="/punishments/*"
          element={
            <ProtectedRoute>
              <DomLayout />
            </ProtectedRoute>
          }
        >
          <Route path="assign" element={<PlaceholderPage section="punishments" tab="assign" />} />
          <Route path="active" element={<PlaceholderPage section="punishments" tab="active" />} />
          <Route
            path="completed"
            element={<PlaceholderPage section="punishments" tab="completed" />}
          />
          <Route path="types" element={<PlaceholderPage section="punishments" tab="types" />} />
        </Route>

        {/* Sub routes */}
        <Route
          path="/sub/*"
          element={
            <ProtectedRoute>
              <SubLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PlaceholderPage section="sub" tab="dashboard" />} />
          <Route path="tasks" element={<PlaceholderPage section="sub" tab="tasks" />} />
          <Route path="rules" element={<PlaceholderPage section="sub" tab="rules" />} />
          <Route path="rewards" element={<PlaceholderPage section="sub" tab="rewards" />} />
          <Route path="punishments" element={<PlaceholderPage section="sub" tab="punishments" />} />
          <Route path="journal" element={<PlaceholderPage section="sub" tab="journal" />} />
          <Route path="report" element={<PlaceholderPage section="sub" tab="report" />} />
        </Route>

        {/* Profile routes - integrated into role-specific layout */}
        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Profile completion wizard */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <ProfileCompletionWizard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
