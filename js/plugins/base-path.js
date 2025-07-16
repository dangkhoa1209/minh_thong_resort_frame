function getBasePath(p = 'minh_thong_resort_frame') {
  const basePath = window.location.pathname.includes(`/${p}/`)
    ? `/${p}`
    : '';
  return basePath;
}
