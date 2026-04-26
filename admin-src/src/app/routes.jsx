import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProjectListPage } from "../pages/projects/ProjectListPage";
import { ProjectFormPage } from "../pages/projects/ProjectFormPage";
import { HomeHighlightListPage } from "../pages/showcase/HomeHighlightListPage";
import { HomeHighlightFormPage } from "../pages/showcase/HomeHighlightFormPage";
import { HeroSlideListPage } from "../pages/showcase/HeroSlideListPage";
import { HeroSlideFormPage } from "../pages/showcase/HeroSlideFormPage";
import { ContactListPage } from "../pages/contacts/ContactListPage";
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
      { path: "showcase/home-highlights", element: <HomeHighlightListPage /> },
      { path: "showcase/home-highlights/new", element: <HomeHighlightFormPage /> },
      { path: "showcase/home-highlights/:id", element: <HomeHighlightFormPage /> },
      { path: "showcase/hero-slides", element: <HeroSlideListPage /> },
      { path: "showcase/hero-slides/new", element: <HeroSlideFormPage /> },
      { path: "showcase/hero-slides/:id", element: <HeroSlideFormPage /> },
      { path: "contacts", element: <ContactListPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
];

export { routes };
