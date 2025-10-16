import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ROUTES } from "../lib/constants";

export default function RequireRole({ allowedRoles = [] }) {
  const { session } = useAuth();
  const userRoles = session?.user?.roles || [];

  const normalizedRoles = userRoles.map((r) => r.toUpperCase());

  const hasAccess = normalizedRoles.some((r) => allowedRoles.includes(r));

  if (!hasAccess) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
}
