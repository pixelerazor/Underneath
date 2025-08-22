import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DomLayout } from './layouts/DomLayout';
import { SubLayout } from './layouts/SubLayout';
import { JoinWithCode } from './components/sub/JoinWithCode';
import PlaceholderPage from './components/common/PlaceholderPage';
import UserProfile from './components/profile/UserProfile';
import ProfileCompletionWizard from './components/onboarding/ProfileCompletionWizard';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
  );
}

function DashboardRouter() {
  const user = useAuthStore((state) => state.user);

  // Check if user needs to complete profile
  if (user && !user.profileCompleted) {
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

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard/overview' : '/login'} replace />}
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
          <Route path="overview" element={<PlaceholderPage section="dashboard" tab="overview" />} />
          <Route path="stats" element={<PlaceholderPage section="dashboard" tab="stats" />} />
          <Route
            path="activities"
            element={<PlaceholderPage section="dashboard" tab="activities" />}
          />
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

        {/* Profile routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
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
