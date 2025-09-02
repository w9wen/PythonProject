import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Chat from './pages/Chat'
import AIDemo from './pages/AIDemo'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
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
    </Router>
  )
}

export default App
