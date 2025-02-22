import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import ErrorPages from '../../pages/ErrorPages';
import TasksDashboard from './../../components/TasksDashboard';
import Login from '../../pages/Login';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPages></ErrorPages>,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute>
            <TasksDashboard></TasksDashboard>
          </PrivateRoute>
        ),
      },

      {
        path: '/login',
        element: <Login></Login>,
      },
    ],
  },
]);

export default router;
