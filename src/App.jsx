import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BucketListProvider } from './context/BucketListContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

/**
 * Main application component.
 * Integrates global context providers, routers, layout containers and navigation.
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <BucketListProvider>
          <div className="app-layout">
            <Navbar />
            <main className="main-viewport">
              <AppRoutes />
            </main>
          </div>
        </BucketListProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
