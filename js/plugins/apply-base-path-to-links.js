(function applyBasePathToLinks() {
  const basePath = getBasePath()

  document.querySelectorAll('a[href^="/pages/"]').forEach(a => {
    const rawHref = a.getAttribute('href');
    a.href = basePath + rawHref;
  });
})();
