const isDesktop = () => window.innerWidth > 1024;

// Hàm đợi cho đến khi đủ element mới chạy callback
const waitForElements = (callback, retries = 10, interval = 300) => {
  const check = () => {
    let menuTrigger = document.querySelector("#header-menu");
    let drawer = document.querySelector(".header-drawer");
    let closeBtn = document.querySelector(".header-drawer__close");
    let overlay = document.querySelector(".header-drawer__overlay");
    let desktopMenu = document.querySelector(".desktop-menu");
    let header = document.querySelector('.header');

    if (menuTrigger && drawer && desktopMenu && header && closeBtn && overlay) {
      callback({ menuTrigger, drawer, closeBtn, overlay, desktopMenu, header });
    } else if (retries > 0) {
      setTimeout(() => check(--retries), interval);
    } else {
      console.error("Không tìm thấy đủ element sau khi chờ!");
    }
  };

  check();
};

waitForElements(start);

function start({ menuTrigger, drawer, closeBtn, overlay, desktopMenu, header }) {
  let autoCloseTimer;

  const clearAutoCloseTimer = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
  };

  const closeDrawer = () => {
    drawer.classList.remove("active");
    document.body.style.overflow = "";
    clearAutoCloseTimer();
  };

  const startAutoCloseTimer = () => {
    clearAutoCloseTimer();
    autoCloseTimer = setTimeout(() => {
      closeDrawer();
      desktopMenu.classList.remove("active");
      menuTrigger.classList.remove("open");
    }, 20000); // 20 giây
  };

  const resetIfMenuActive = () => {
    if (drawer.classList.contains("active") || desktopMenu.classList.contains("active")) {
      startAutoCloseTimer();
    }
  };

  // Gán sự kiện reset timer
  ['click', 'mousemove', 'scroll', 'keydown', 'touchstart'].forEach(event => {
    desktopMenu.addEventListener(event, resetIfMenuActive);
    drawer.addEventListener(event, resetIfMenuActive);
  });

  // ================== MOBILE DRAWER ==================
  const openDrawer = () => {
    drawer.classList.add("active");
    document.body.style.overflow = "hidden";
    startAutoCloseTimer();
  };

  // ================== DESKTOP MENU (SLIDE-IN) ==================
  const toggleDesktopMenu = () => {
    desktopMenu.classList.toggle("active");
    menuTrigger.classList.toggle("open");
    if (desktopMenu.classList.contains("active")) {
      startAutoCloseTimer();
    } else {
      clearAutoCloseTimer();
    }
  };

  // ================== EVENT HANDLERS ==================
  menuTrigger.addEventListener("click", () => {
    if (isDesktop()) {
      toggleDesktopMenu();
    } else {
      openDrawer();
    }
  });

  // Click ngoài menu (desktop) -> đóng
  document.addEventListener("click", (e) => {
    if (isDesktop() && !desktopMenu.contains(e.target) && !menuTrigger.contains(e.target)) {
      desktopMenu.classList.remove("active");
      menuTrigger.classList.remove("open");
      clearAutoCloseTimer();
    }
  });

  // ESC -> đóng tất cả
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      desktopMenu.classList.remove("active");
      menuTrigger.classList.remove("open");
      clearAutoCloseTimer();
    }
  });

  // Drawer close buttons
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // ================== HEADER SCROLL HIDE/SHOW ==================
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastScrollY = currentScrollY;
  });
}
