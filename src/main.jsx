import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AuthProvider from './Provider/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './Provider/route/router';
import { RouterProvider } from 'react-router-dom';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </QueryClientProvider>
  </AuthProvider>
);
