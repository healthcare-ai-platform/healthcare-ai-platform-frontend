import { Navigate } from 'react-router-dom';
import { getStoredUser, roleHomeRoute } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const user = getStoredUser();

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role))
      return <Navigate to={roleHomeRoute(user.role)} replace />;
  }

  return children;
}
