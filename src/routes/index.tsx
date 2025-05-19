import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ManagerDashboardPage from '../pages/manager/DashboardPage';
import WorkerDashboardPage from '../pages/worker/DashboardPage';
import NotFoundPage from '../pages/common/NotFoundPage';

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
      <Route 
        path="/register" 
        element={<RegisterPage />} 
      />
      <Route 
        path="/dashboard/manager" 
        element={<ManagerDashboardPage />} 
      />
      <Route 
        path="/dashboard/worker" 
        element={<WorkerDashboardPage />} 
      />
      <Route 
        path="*" 
        element={<NotFoundPage />} 
      />
    </Routes>
  );
};

export default AppRoutes;