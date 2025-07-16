(function applyBasePathToLinks() {
  const basePath = getBasePath()

  document.querySelectorAll('a[href^="/"]').forEach(a => {
    const rawHref = a.getAttribute('href');
    a.href = basePath + rawHref;
  });
})();
