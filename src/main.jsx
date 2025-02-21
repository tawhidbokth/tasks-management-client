import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AuthProvider from './Provider/AuthProvider';
import TasksDashboard from './components/TasksDashboard';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<TasksDashboard />} />
        </Routes>
      </Router>
    </StrictMode>
  </AuthProvider>
);
