import { Layout, Menu, Typography, Button } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  HomeOutlined,
  MailOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { getLogo } from "../../services/setting.api";
import { toBackendAssetUrl } from "../../utils/media";

const { Header, Sider, Content } = Layout;
const DEFAULT_FRONTEND_LOGO = "/assets/svg/logo/logo-pro.svg";

function resolveLogoUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return DEFAULT_FRONTEND_LOGO;

  if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw) || /^blob:/i.test(raw)) {
    return raw;
  }

  // Match FE logic: only /uploads/* belongs to backend.
  if (raw.startsWith("/uploads/")) {
    return toBackendAssetUrl(raw);
  }

  // /assets/* and other local paths stay on frontend.
  return raw;
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const logoResult = await getLogo();
        const storedLogo = String(logoResult?.data?.logo_url || "").trim();

        if (!active) return;
        setLogoUrl(resolveLogoUrl(storedLogo));
      } catch (_error) {
        if (!active) return;
        setLogoUrl(DEFAULT_FRONTEND_LOGO);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith("/projects")) return "projects";
    if (location.pathname.startsWith("/showcase/home-highlights")) return "home-highlights";
    if (location.pathname.startsWith("/showcase/hero-slides")) return "hero-slides";
    if (location.pathname.startsWith("/contacts")) return "contacts";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  }, [location.pathname]);

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "projects", icon: <AppstoreOutlined />, label: "Projects" },
    { key: "home-highlights", icon: <HomeOutlined />, label: "Home Highlights" },
    { key: "hero-slides", icon: <PictureOutlined />, label: "Hero Slides" },
    { key: "contacts", icon: <MailOutlined />, label: "Contacts" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  const onMenuClick = ({ key }) => {
    if (key === "dashboard") navigate("/");
    if (key === "projects") navigate("/projects");
    if (key === "home-highlights") navigate("/showcase/home-highlights");
    if (key === "hero-slides") navigate("/showcase/hero-slides");
    if (key === "contacts") navigate("/contacts");
    if (key === "settings") navigate("/settings");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240}>
        <div className="admin-brand">
          <img
            src={logoUrl || DEFAULT_FRONTEND_LOGO}
            alt="Site logo"
            className="admin-brand__logo"
            onError={(event) => {
              event.currentTarget.src = DEFAULT_FRONTEND_LOGO;
            }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={onMenuClick}
        />
      </Sider>

      <Layout>
        <Header className="admin-header">
          <Typography.Text strong>Admin Panel</Typography.Text>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => {
              clearAuth();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export { AdminLayout };
