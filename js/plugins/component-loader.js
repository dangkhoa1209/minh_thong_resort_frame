function loadComponent(url, containerId) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(containerId);
      const temp = document.createElement('div');
      temp.innerHTML = html;

      const cssLinks = temp.querySelectorAll('link[rel="stylesheet"]');
      const scriptTags = temp.querySelectorAll('script[src]');

      // Load CSS links
      const cssPromises = [...cssLinks].map(link => {
        const exists = [...document.head.querySelectorAll('link')].some(l => l.href === link.href);
        if (!exists) {
          return new Promise(resolve => {
            const newLink = link.cloneNode();
            newLink.onload = resolve;
            document.head.appendChild(newLink);
          });
        } else {
          return Promise.resolve(); // Đã có rồi
        }
      });

      // Load JS scripts
      scriptTags.forEach(script => {
        const exists = [...document.querySelectorAll('script')].some(s => s.src === script.src);
        if (!exists) {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.defer = true;
          document.body.appendChild(newScript);
        }
      });

      // Chờ CSS load xong rồi mới append nội dung
      Promise.all(cssPromises).then(() => {
        const content = temp.querySelector('section') || temp.firstElementChild;
        if (content) container.appendChild(content);
      });
    })
    .catch(err => console.error("❌ Failed to load component:", err));
}
