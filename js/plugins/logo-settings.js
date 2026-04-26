(function () {
  const CACHE_KEY = "abel_public_logo_cache_v2";
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
  const DEFAULT_LOGOS = {
    light: "/uploads/default/logo/logo-pro.svg",
    dark: "/uploads/default/logo/logo-pro-dark.svg",
  };

  function normalizeLogoData(raw) {
    const light = String(raw?.logo_light_url || "").trim();
    const dark = String(raw?.logo_dark_url || "").trim();
    return {
      light: light || DEFAULT_LOGOS.light,
      dark: dark || DEFAULT_LOGOS.dark,
    };
  }

  function toAssetUrl(path) {
    if (!path) return "";
    if (typeof getAssetUrl === "function") return getAssetUrl(path);
    return path;
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.ts || !parsed?.data) return null;
      if (Date.now() - Number(parsed.ts) > CACHE_TTL_MS) return null;
      return normalizeLogoData(parsed.data);
    } catch (_error) {
      return null;
    }
  }

  function writeCache(logos) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ts: Date.now(),
          data: logos,
        })
      );
    } catch (_error) {
      // Ignore localStorage errors.
    }
  }

  function applyLogos(logos) {
    if (!logos) return;
    const lightUrl = toAssetUrl(logos.light);
    const darkUrl = toAssetUrl(logos.dark);

    document.querySelectorAll('[data-logo-role="light"]').forEach((node) => {
      if (lightUrl) node.src = lightUrl;
    });
    document.querySelectorAll('[data-logo-role="dark"]').forEach((node) => {
      if (darkUrl) node.src = darkUrl;
    });
  }

  async function fetchLogoSettings() {
    try {
      const apiBase = typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "";
      if (!apiBase) return null;
      const response = await fetch(`${apiBase}/api/public/settings/logo`);
      if (!response.ok) return null;
      const payload = await response.json();
      return normalizeLogoData(payload?.data || {});
    } catch (_error) {
      return null;
    }
  }

  async function initLogos() {
    applyLogos(DEFAULT_LOGOS);

    const cached = readCache();
    if (cached) applyLogos(cached);

    const latest = await fetchLogoSettings();
    if (!latest) return cached || DEFAULT_LOGOS;
    writeCache(latest);
    applyLogos(latest);
    return latest;
  }

  window.ABEL_LOGOS = {
    initLogos,
    getCached: readCache,
    defaults: DEFAULT_LOGOS,
  };
})();
