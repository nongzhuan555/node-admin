import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from '@/pages/Login';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import UserList from '@/pages/UserList';
import NotFound from '@/pages/NotFound';

import NotificationList from '@/pages/NotificationList';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'users',
            element: <UserList />,
          },
          {
            path: 'notifications',
            element: <NotificationList />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;
