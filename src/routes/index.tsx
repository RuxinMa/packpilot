import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import ManagerDashboardPage from '../pages/manager/DashboardPage';
import WorkerDashboardPage from '../pages/worker/DashboardPage';

// Simple router configuration without authentication
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard/manager',
    element: <ManagerDashboardPage />
  },
  {
    path: '/dashboard/worker',
    element: <WorkerDashboardPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;