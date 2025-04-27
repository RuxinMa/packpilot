import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ManagerDashboardPage from '../pages/manager/DashboardPage';
import WorkerDashboardPage from '../pages/worker/DashboardPage';
// import NotFoundPage from '../pages/common/NotFoundPage';

// Simple router configuration without authentication
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard/worker" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/dashboard/manager',
    element: <ManagerDashboardPage />
  },
  {
    path: '/dashboard/worker',
    element: <WorkerDashboardPage />
  },
  // {
  //   path: '*',
  //   element: <NotFoundPage />
  // }
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;