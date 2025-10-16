import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./lib/constants";

import HomePage from "./pages/public/home";
import LoginPage from "./pages/public/login";
import Dashboard from "./pages/private/dashboard";
import User from "./pages/private/user";
import { AuthProvider } from "./context/AuthProvider";
import PublicLayout from "./components/layout/PublicLayout";
import PrivateLayout from "./components/layout/AdminLayout";
import AcceptInvite from "./pages/public/accept-invite";
import Configuration from "./pages/private/configuration";
import NotFoundPage from "./pages/Handlers/NotFoundPage";
import Schedule from "./pages/private/schedule";
import AuditLogs from "./pages/private/audit-logs";
import Inventory from "./pages/private/inventory";
import Articles from "./pages/private/articles";
import Appointments from "./pages/private/appointments";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole"; // ✅ import role guard
import ArticleBuilder from "./pages/private/articles/subpages/article-builder";
import WalkInAppointment from "./pages/private/appointments/subpages/walk-in-appointment";
import Acquisitions from "./pages/private/acquisitions";
import ForbiddenPage from "./pages/Handlers/ForbiddenPage";
import Catalogs from "./pages/private/catalogs";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.ACCEPT_INVITE} element={<AcceptInvite />} />
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
        </Route>

        {/* --- Private Routes (Require Authentication) --- */}
        <Route element={<RequireAuth />}>
          <Route element={<PrivateLayout />}>
            {/* Accessible to all authenticated users */}
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.SCHEDULES} element={<Schedule />} />
            <Route path={ROUTES.INVENTORY} element={<Inventory />} />
            <Route path={ROUTES.CATALOGS} element={<Catalogs />} />
            <Route path={ROUTES.ARTICLES} element={<Articles />} />
            <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
            <Route path={ROUTES.ACQUISITIONS} element={<Acquisitions />} />
            <Route
              path={ROUTES.WALKIN_APPOINTMENT}
              element={<WalkInAppointment />}
            />

            {/* --- Restricted Routes (ADMIN / SUPERADMIN only) --- */}
            <Route
              element={<RequireRole allowedRoles={["ADMIN", "SUPERADMIN"]} />}
            >
              <Route path={ROUTES.USERS} element={<User />} />
              <Route path={ROUTES.CONFIGURATIONS} element={<Configuration />} />
              <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Other private route outside layout */}
          <Route path={ROUTES.ARTICLE_BUILDER} element={<ArticleBuilder />} />
        </Route>

        {/* --- Global Error Pages --- */}
        <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
