const items = document.querySelectorAll('.product');

items.forEach(item => {
  const popup = item.querySelector('.image-container');
  let pageTo = popup.dataset.pageTo;

  // if (!pageTo) return;

  const basePath = getBasePath()

  if(basePath) {
    pageTo = basePath + pageTo
  }

  item.addEventListener('click', (e) => {
    e.stopPropagation();

    const rect = item.getBoundingClientRect();
    document.body.style.overflow = 'hidden';

    popup.classList.remove('expand-active');
    popup.style.transition = 'none';

    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.width = rect.width + 'px';
    popup.style.height = rect.height + 'px';
    popup.style.transform = 'translateX(0)';
    popup.style.zIndex = 9999;

    // Lấy scale hiện tại của ảnh
    const img = popup.querySelector('img');
    const computedStyle = window.getComputedStyle(img);
    const currentTransform = computedStyle.transform;

    // Áp lại scale hiện tại để không nhảy về scale(1) ngay lập tức
    img.style.transition = 'none';
    img.style.transform = currentTransform;

    void popup.offsetWidth;

    // Animation mở rộng
    requestAnimationFrame(() => {
      popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('expand-active');

      // Reset ảnh về scale(1) mượt
      img.style.transition = 'transform 0.5s ease';
      img.style.transform = 'scale(1)';

      popup.style.scale = '1';
      popup.style.filter = 'brightness(1)';

      if (barbaGoProject) {
        barbaGoProject(pageTo, 1000);
      } else {
        window.location.href = pageTo;
      }
    });
  });
});
