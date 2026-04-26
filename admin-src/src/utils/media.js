function getBackendOrigin() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  if (!apiBaseUrl) return "";

  try {
    // Supports both API URLs with and without /api suffix.
    const parsed = new URL(apiBaseUrl, window.location.origin);
    return parsed.origin;
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
