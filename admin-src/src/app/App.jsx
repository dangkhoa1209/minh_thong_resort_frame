import { ConfigProvider } from "antd";
import { useMemo } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { appTheme } from "../styles/theme";

function App() {
  const element = useRoutes(routes);
  const theme = useMemo(() => appTheme, []);

  return <ConfigProvider theme={theme}>{element}</ConfigProvider>;
}

export { App };
