import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import { useAuth } from './contexts/AuthContext';

// Using dynamic imports for components that will be converted to .tsx later
const Chat = React.lazy(() => import('./pages/Chat'));
const AIDemo = React.lazy(() => import('./pages/AIDemo'));

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
            <Route path="ai-demo" element={isAuthenticated ? <AIDemo /> : <Navigate to="/login" />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
