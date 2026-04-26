import { Layout, Menu, Typography, Button } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  HomeOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuthStore } from "../../store/auth.store";

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith("/projects")) return "projects";
    if (location.pathname.startsWith("/showcase/home-highlights")) return "home-highlights";
    if (location.pathname.startsWith("/showcase/hero-slides")) return "hero-slides";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  }, [location.pathname]);

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "projects", icon: <AppstoreOutlined />, label: "Projects" },
    { key: "home-highlights", icon: <HomeOutlined />, label: "Home Highlights" },
    { key: "hero-slides", icon: <PictureOutlined />, label: "Hero Slides" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  const onMenuClick = ({ key }) => {
    if (key === "dashboard") navigate("/");
    if (key === "projects") navigate("/projects");
    if (key === "home-highlights") navigate("/showcase/home-highlights");
    if (key === "hero-slides") navigate("/showcase/hero-slides");
    if (key === "settings") navigate("/settings");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240}>
        <div className="admin-brand">Abel Dang Admin</div>
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
