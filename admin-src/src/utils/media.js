function getBackendOrigin() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  try {
    if (apiBaseUrl && /^https?:\/\//i.test(apiBaseUrl)) {
      const parsed = new URL(apiBaseUrl, window.location.origin);
      return parsed.origin;
    }

    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return `${window.location.protocol}//${host}:3001`;
    }

    return window.location.origin;
  } catch (_error) {
    return "";
  }
}

function toBackendAssetUrl(value) {
  if (!value || typeof value !== "string") return "";

  // Keep external links and already absolute URLs untouched.
  if (/^https?:\/\//i.test(value) || /^data:/i.test(value) || /^blob:/i.test(value)) {
    return value;
  }

  const backendOrigin = getBackendOrigin();
  if (!backendOrigin) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${backendOrigin}${normalizedPath}`;
}

export { toBackendAssetUrl };
