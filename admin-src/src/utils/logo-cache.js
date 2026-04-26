import { toBackendAssetUrl } from "./media";

const LOGO_CACHE_KEY = "abel_logo_cache_v2";
const LOGO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function resolveBaseAsset(path) {
  const normalized = String(path || "").startsWith("/") ? String(path) : `/${String(path || "")}`;
  const base = String(import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  if (!base || base === "/") return normalized;
  return `${base}${normalized}`;
}

const DEFAULT_LOGOS = {
  logo_light_url: "/uploads/default/logo/logo-pro.svg",
  logo_dark_url: "/uploads/default/logo/logo-pro-dark.svg",
};

function getLogoCandidates(path) {
  const normalized = String(path || "").startsWith("/") ? String(path) : `/${String(path || "")}`;
  if (normalized.startsWith("/uploads/")) {
    return [toBackendAssetUrl(normalized)].filter(Boolean);
  }
  const fromBase = resolveBaseAsset(normalized);
  return [fromBase, `/admin${normalized}`].filter(Boolean);
}

function normalizeLogoData(raw = {}) {
  const light = String(raw.logo_light_url || "").trim();
  const dark = String(raw.logo_dark_url || "").trim();

  return {
    logo_light_url: light || DEFAULT_LOGOS.logo_light_url,
    logo_dark_url: dark || DEFAULT_LOGOS.logo_dark_url,
  };
}

function resolveLogoUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw) || /^blob:/i.test(raw)) return raw;
  if (raw.startsWith("/uploads/")) return toBackendAssetUrl(raw);
  if (raw.startsWith("/assets/")) return resolveBaseAsset(raw);
  return raw;
}

function readLogoCache() {
  try {
    const raw = localStorage.getItem(LOGO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !parsed?.data) return null;
    if (Date.now() - Number(parsed.ts) > LOGO_CACHE_TTL_MS) return null;
    return normalizeLogoData(parsed.data);
  } catch (_error) {
    return null;
  }
}

function writeLogoCache(data) {
  try {
    localStorage.setItem(
      LOGO_CACHE_KEY,
      JSON.stringify({
        ts: Date.now(),
        data: normalizeLogoData(data),
      })
    );
  } catch (_error) {
    // Ignore localStorage failure in private mode.
  }
}

export {
  DEFAULT_LOGOS,
  normalizeLogoData,
  resolveLogoUrl,
  readLogoCache,
  writeLogoCache,
  getLogoCandidates,
};
