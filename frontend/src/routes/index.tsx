import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
// import RegisterPage from '../pages/auth/RegisterPage';
import ManagerDashboardPage from '../pages/manager/DashboardPage';
import WorkerDashboardPage from '../pages/worker/DashboardPage';
import NotFoundPage from '../pages/common/NotFoundPage';
import AuthGuard from '../components/auth/AuthGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      {/* /* Diasable register route for now */}
      {/* <Route 
        path="/register" 
        element={<RegisterPage />} 
      /> */} 
      <Route 
        path="/dashboard/manager" 
        element={
          <AuthGuard allowedRoles={['Manager']}>
            <ManagerDashboardPage />
          </AuthGuard>
        } 
      />
      <Route 
        path="/dashboard/worker" 
        element={
          <AuthGuard allowedRoles={['Worker']}>
            <WorkerDashboardPage />
          </AuthGuard>
        } 
      />
      <Route 
        path="*" 
        element={<NotFoundPage />} 
      />
    </Routes>
  );
};

export default AppRoutes;