function getBasePath(p = 'minh_thong_resort_frame') {
  const basePath = window.location.pathname.includes(`/${p}/`)
    ? `/${p}`
    : '';
  return basePath;
}

function getApiBaseUrl() {
  return `${getApiOriginBaseUrl()}/api`;
}

function getApiOriginBaseUrl() {
  // if (window.ABEL_API_BASE_URL) {
  //   return window.ABEL_API_BASE_URL.replace(/\/+$/, "").replace(/\/api$/i, "");
  // }

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    return 'http://localhost:3001';
  }

  return 'https://abeldang.com';
}

function getAssetUrl(path) {
  if (!path || typeof path !== 'string') {
    return '';
  }

  if (/^(https?:)?\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) {
    return path;
  }

  if (path.startsWith('/uploads/')) {
    return `${getApiOriginBaseUrl()}${path}`;
  }

  if (path.startsWith('/')) {
    return `${getBasePath()}${path}`;
  }

  return path;
}
