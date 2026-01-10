import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { ROUTES } from '../../utils';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
