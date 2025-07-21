

try {
  document.querySelectorAll('a[href^="/"]').forEach(a => {
  const basePath = getBasePath()
  console.log(a);
  
  const rawHref = a.getAttribute('href');
  a.href = basePath + rawHref;

  a.addEventListener('click', e => {
    e.preventDefault();    
     if (window.barba) barba.destroy();

    const link = a;
    // Sau 300ms (hoặc thời gian anim), hủy Barba và chuyển trang
    setTimeout(() => {
      window.location.href = link.href;
    }, 100);
  });

});
} catch (error) {
  console.log(error);
  
}