import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.api";
import { getPublicContact, getPublicLogo } from "../../services/setting.api";
import { useAuthStore } from "../../store/auth.store";
import { notifyError } from "../../utils/notify";
import {
  getLogoCandidates,
  normalizeLogoData,
  readLogoCache,
  resolveLogoUrl,
  writeLogoCache,
} from "../../utils/logo-cache";

const DEFAULT_LOGIN_BACKGROUND_PATH = "/assets/images/pear-hoi-an/1.webp";

function getFrontendBasePath(projectName = "minh_thong_resort_frame") {
  if (window.location.pathname.includes(`/${projectName}/`)) {
    return `/${projectName}`;
  }
  return "";
}

function resolvePublicAssetCandidates(path) {
  if (/^https?:\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) {
    return [path];
  }
  const basePath = getFrontendBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = String(import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return [
    basePath ? `${basePath}${normalized}` : "",
    normalized,
    `/minh_thong_resort_frame${normalized}`,
    `${baseUrl}${normalized}`,
    `/admin${normalized}`,
  ].filter(Boolean);
}

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFallbackIndex, setLogoFallbackIndex] = useState(0);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const backgroundCandidates = useMemo(
    () => resolvePublicAssetCandidates(DEFAULT_LOGIN_BACKGROUND_PATH),
    []
  );
  const logoDefaultCandidates = useMemo(() => getLogoCandidates("/uploads/default/logo/logo-pro.svg"), []);

  useEffect(() => {
    setLogoUrl(logoDefaultCandidates[0] || "");
  }, [logoDefaultCandidates]);

  useEffect(() => {
    let active = true;
    const cached = readLogoCache();
    if (cached) {
      setLogoUrl(resolveLogoUrl(cached.logo_light_url) || logoDefaultCandidates[0]);
    }
    (async () => {
      try {
        const [contactResult, logoResult] = await Promise.all([getPublicContact(), getPublicLogo()]);
        const nextName = String(contactResult?.data?.company_name || "").trim();
        const normalizedLogo = normalizeLogoData(logoResult?.data || {});
        if (!active) return;
        setCompanyName(nextName);
        setLogoFallbackIndex(0);
        setLogoUrl(resolveLogoUrl(normalizedLogo.logo_light_url) || logoDefaultCandidates[0]);
        writeLogoCache(normalizedLogo);
      } catch (_error) {
        if (!active) return;
        setCompanyName("");
        setLogoFallbackIndex(0);
        setLogoUrl(logoDefaultCandidates[0]);
      }
    })();
    return () => {
      active = false;
    };
  }, [logoDefaultCandidates]);

  useEffect(() => {
    let active = true;

    const tryLoad = (url) =>
      new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = url;
      });

    (async () => {
      for (const candidate of backgroundCandidates) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await tryLoad(candidate);
        if (ok) {
          if (active) setBackgroundUrl(candidate);
          return;
        }
      }
      if (active) setBackgroundUrl("");
    })();

    return () => {
      active = false;
    };
  }, [backgroundCandidates]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      setAuth({ token: result.data.access_token, user: result.data.user });
      navigate("/");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-wrap"
      style={backgroundUrl ? { backgroundImage: `url("${backgroundUrl}")` } : undefined}
    >
      <Card className="login-card login-card--dark">
        <div className="login-brand">
          <img
            src={logoUrl}
            alt={companyName ? `${companyName} logo` : "Admin logo"}
            className="login-brand__logo"
            onError={() => {
              setLogoFallbackIndex((current) => {
                const next = Math.min(current + 1, Math.max(0, logoDefaultCandidates.length - 1));
                setLogoUrl(logoDefaultCandidates[next]);
                return next;
              });
            }}
          />
        </div>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ email: "", password: "" }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 8 }]}>
            <Input.Password placeholder="********" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export { LoginPage };
