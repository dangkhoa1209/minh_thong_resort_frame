import { App as AntdApp, ConfigProvider } from "antd";
import { useEffect, useMemo } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { appTheme } from "../styles/theme";
import { setNotifyApi } from "../utils/notify";

function AppContent() {
  const element = useRoutes(routes);
  const { message } = AntdApp.useApp();

  useEffect(() => {
    setNotifyApi(message);
    return () => setNotifyApi(null);
  }, [message]);

  return element;
}

function App() {
  const theme = useMemo(() => appTheme, []);

  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <AppContent />
      </AntdApp>
    </ConfigProvider>
  );
}

export { App };
