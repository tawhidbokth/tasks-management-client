import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AuthProvider from './Provider/AuthProvider';
import TasksDashboard from './components/TasksDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<TasksDashboard />} />
          </Routes>
        </Router>
      </StrictMode>
    </QueryClientProvider>
  </AuthProvider>
);
