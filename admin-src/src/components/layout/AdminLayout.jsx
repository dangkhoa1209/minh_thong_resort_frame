import { Layout, Menu, Typography, Button, Drawer, Grid } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  HomeOutlined,
  MailOutlined,
  PictureOutlined,
  BlockOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { getLogo } from "../../services/setting.api";
import {
  DEFAULT_LOGOS,
  getLogoCandidates,
  normalizeLogoData,
  readLogoCache,
  resolveLogoUrl,
  writeLogoCache,
} from "../../utils/logo-cache";

const { Header, Sider, Content } = Layout;
const LOGO_CANDIDATES = getLogoCandidates("/uploads/default/logo/logo-pro.svg");

function AdminLayout() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [logoUrl, setLogoUrl] = useState(LOGO_CANDIDATES[0]);
  const [logoIndex, setLogoIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const cached = readLogoCache();
    if (cached) {
      setLogoUrl(resolveLogoUrl(cached.logo_light_url) || LOGO_CANDIDATES[0]);
    }

    (async () => {
      try {
        const logoResult = await getLogo();
        const normalizedLogo = normalizeLogoData(logoResult?.data || {});
        if (!active) return;
        setLogoIndex(0);
        setLogoUrl(resolveLogoUrl(normalizedLogo.logo_light_url) || LOGO_CANDIDATES[0]);
        writeLogoCache(normalizedLogo);
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
    if (location.pathname.startsWith("/collaboration")) return "collaboration";
    if (location.pathname.startsWith("/contacts")) return "contacts";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  }, [location.pathname]);

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "projects", icon: <AppstoreOutlined />, label: "Projects" },
    { key: "home-highlights", icon: <HomeOutlined />, label: "Home Highlights" },
    { key: "hero-slides", icon: <PictureOutlined />, label: "Hero Slides" },
    { key: "collaboration", icon: <BlockOutlined />, label: "Collaboration" },
    { key: "contacts", icon: <MailOutlined />, label: "Contacts" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  const onMenuClick = ({ key }) => {
    if (key === "dashboard") navigate("/");
    if (key === "projects") navigate("/projects");
    if (key === "home-highlights") navigate("/showcase/home-highlights");
    if (key === "hero-slides") navigate("/showcase/hero-slides");
    if (key === "collaboration") navigate("/collaboration");
    if (key === "contacts") navigate("/contacts");
    if (key === "settings") navigate("/settings");
    if (isMobile) setMenuOpen(false);
  };

  const navContent = (
    <>
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
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && <Sider width={240}>{navContent}</Sider>}
      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          styles={{ body: { padding: 0, background: "#111111" }, header: { marginBottom: 0 } }}
        >
          {navContent}
        </Drawer>
      )}

      <Layout>
        <Header className="admin-header">
          <div className="admin-header__left">
            {isMobile && <Button icon={<MenuOutlined />} onClick={() => setMenuOpen(true)} />}
            <Typography.Text strong>Admin Panel</Typography.Text>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => {
              clearAuth();
              navigate("/login");
            }}
          >
            {isMobile ? "Out" : "Logout"}
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
