import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Import deine Komponenten
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DomLayout } from './layouts/DomLayout';
import { SubLayout } from './layouts/SubLayout';
import PlaceholderPage from './components/common/PlaceholderPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <Navigate to="/dashboard/overview" />,
        },
        {
          path: 'login',
          element: <LoginForm />,
        },
        {
          path: 'register',
          element: <RegisterForm />,
        },
        // DOM Routes
        {
          path: 'dashboard/*',
          element: <DomLayout />,
          children: [
            { path: 'overview', element: <PlaceholderPage section="dashboard" tab="overview" /> },
            { path: 'stats', element: <PlaceholderPage section="dashboard" tab="stats" /> },
            {
              path: 'activities',
              element: <PlaceholderPage section="dashboard" tab="activities" />,
            },
          ],
        },
        // SUB Routes
        {
          path: 'sub/*',
          element: <SubLayout />,
          children: [
            { path: 'dashboard', element: <PlaceholderPage section="sub" tab="dashboard" /> },
            { path: 'tasks', element: <PlaceholderPage section="sub" tab="tasks" /> },
            { path: 'rules', element: <PlaceholderPage section="sub" tab="rules" /> },
            { path: 'rewards', element: <PlaceholderPage section="sub" tab="rewards" /> },
            { path: 'punishments', element: <PlaceholderPage section="sub" tab="punishments" /> },
            { path: 'journal', element: <PlaceholderPage section="sub" tab="journal" /> },
            { path: 'report', element: <PlaceholderPage section="sub" tab="report" /> },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
