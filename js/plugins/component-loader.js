function loadComponent(url, containerId, extraClass = '') {
  fetch(url) // url tương đối tính từ vị trí file html
    .then(res => res.text())
    .then(html => {
      const basePath = getBasePath();
      console.log('basePath', basePath);
      
      const container = document.getElementById(containerId);
      const temp = document.createElement('div');
      temp.innerHTML = html;

      const cssLinks = temp.querySelectorAll('link[rel="stylesheet"]');
      const scriptTags = temp.querySelectorAll('script[src]');
      const imgTags = temp.querySelectorAll('img[src]');

      // Load CSS
      const cssPromises = [...cssLinks].map(link => {
        const rawHref = link.getAttribute('href');
        const fullHref = rawHref.startsWith('http')
          ? rawHref
          : basePath + rawHref.replace(/^(\.\/|\.\.\/)+/, '/');
        const exists = [...document.head.querySelectorAll('link')].some(
          l => l.href === location.origin + fullHref
        );
        if (!exists) {
          return new Promise(resolve => {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = fullHref;
            newLink.onload = resolve;
            document.head.appendChild(newLink);
          });
        } else {
          return Promise.resolve();
        }
      });

      // Load JS
      scriptTags.forEach(script => {
        const rawSrc = script.getAttribute('src');
        const fullSrc = rawSrc.startsWith('http')
          ? rawSrc
          : basePath + rawSrc.replace(/^(\.\/|\.\.\/)+/, '/');
        const exists = [...document.querySelectorAll('script')].some(
          s => s.src === location.origin + fullSrc
        );
        if (!exists) {
          const newScript = document.createElement('script');
          newScript.src = fullSrc;
          newScript.defer = true;
          document.body.appendChild(newScript);
        }
      });

      // Fix image srcs if needed
      imgTags.forEach(img => {
        const rawSrc = img.getAttribute('src');
        if (!rawSrc.startsWith('http')) {
          img.src = basePath + rawSrc.replace(/^(\.\/|\.\.\/)+/, '/');
        }
      });

      Promise.all(cssPromises).then(() => {
        const content = temp.querySelector('section') || temp.firstElementChild;
        if (content) {
          // Thêm class vào thẻ gốc nếu có
          if (extraClass) {
            content.classList.add(extraClass);
          }
          container.appendChild(content);
        }
      });
    })
    .catch(err => console.error("❌ Failed to load component:", err));
}
