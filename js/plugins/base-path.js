function getBasePath(p) { 
  
  const path = p | 'minh_thong_resort_frame'
  const basePath = window.location.pathname.includes(`/${path}/`)
  ? `/${path}`
  : '';

  return basePath
}