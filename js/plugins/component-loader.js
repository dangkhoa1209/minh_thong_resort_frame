function loadComponent(url, containerId) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(containerId);
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Gắn CSS (link)
      temp.querySelectorAll('link[rel="stylesheet"]')?.forEach(link => {
        const exists = [...document.head.querySelectorAll('link')].some(l => l.href === link.href);
        if (!exists) document.head.appendChild(link.cloneNode());
      });

      // Gắn JS (script)
      temp.querySelectorAll('script[src]')?.forEach(script => {
        const exists = [...document.querySelectorAll('script')].some(s => s.src === script.src);
        if (!exists) {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.defer = true;
          document.body.appendChild(newScript);
        }
      });

      // Chỉ chèn phần nội dung cần hiển thị, ví dụ section.slide-projects
      const content = temp.querySelector('section') || temp.firstElementChild;
      if (content) container.appendChild(content);
    })
    .catch(err => console.error("❌ Failed to load component:", err));
}
