import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
import { TaskProvider } from './contexts/TaskContext';

import Routes from './routes';

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <ItemProvider>
            <TaskProvider>
              <Routes />
            </TaskProvider>
          </ItemProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;