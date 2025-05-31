import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;