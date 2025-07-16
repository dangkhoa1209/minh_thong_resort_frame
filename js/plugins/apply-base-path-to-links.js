const basePath = getBasePath()

document.querySelectorAll('a[href^="/"]').forEach(a => {
  const rawHref = a.getAttribute('href');

  console.log('rawHref', rawHref);

  a.href = basePath + rawHref;
});