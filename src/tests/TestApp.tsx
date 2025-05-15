// TestApp.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockAuthProvider } from '../mocks/MockAuthContext';
import AppRoutes from '../routes/index'; 

const TestApp: React.FC = () => {
  return (
    <MockAuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </MockAuthProvider>
  );
};

export default TestApp;