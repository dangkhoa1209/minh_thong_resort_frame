import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProjectListPage } from "../pages/projects/ProjectListPage";
import { ProjectFormPage } from "../pages/projects/ProjectFormPage";
import { SettingsPage } from "../pages/settings/SettingsPage";

const routes = [
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects", element: <ProjectListPage /> },
      { path: "projects/new", element: <ProjectFormPage /> },
      { path: "projects/:id", element: <ProjectFormPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
];

export { routes };
