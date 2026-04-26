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
const LOGO_CANDIDATES = [
  "/assets/svg/logo/logo-pro.svg",
  "/admin/assets/svg/logo/logo-pro.svg",
];

function resolveLogoUrl(rawValue, fallbackUrl) {
  const raw = String(rawValue || "").trim();
  if (!raw) return fallbackUrl;
  if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw) || /^blob:/i.test(raw)) return raw;
  if (raw.startsWith("/uploads/")) return toBackendAssetUrl(raw);
  return raw;
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [logoUrl, setLogoUrl] = useState(LOGO_CANDIDATES[0]);
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const logoResult = await getLogo();
        const apiLogo = String(logoResult?.data?.logo_url || "").trim();
        if (!active) return;
        setLogoIndex(0);
        setLogoUrl(resolveLogoUrl(apiLogo, LOGO_CANDIDATES[0]));
      } catch (_error) {
        if (!active) return;
        setLogoIndex(0);
        setLogoUrl(LOGO_CANDIDATES[0]);
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
            src={logoIndex === 0 ? logoUrl : (LOGO_CANDIDATES[logoIndex] || LOGO_CANDIDATES[0])}
            alt="Site logo"
            className="admin-brand__logo"
            onError={() => {
              setLogoIndex((current) =>
                Math.min(current + 1, Math.max(0, LOGO_CANDIDATES.length - 1))
              );
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
