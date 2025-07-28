// ************** HEADER SCRIPT (DESKTOP + MOBILE) **************

// Logo -> click về home
const logos = document.querySelectorAll('.logo');
logos?.forEach(logo => {
  logo.addEventListener('click', () => {
    const basePath = typeof getBasePath === 'function' ? getBasePath() : '/';
    window.location.href = basePath || '/';
  });
});

// Các phần tử chính
const menuTrigger = document.querySelector("#header-menu");
const drawer = document.querySelector(".header-drawer");
const closeBtn = document.querySelector(".header-drawer__close");
const overlay = document.querySelector(".header-drawer__overlay");
const desktopMenu = document.querySelector(".desktop-menu");
const isDesktop = () => window.innerWidth > 1024;

// ================== AUTO CLOSE MENU (20s INACTIVITY) ==================
let autoCloseTimer;

/**
 * Khởi động bộ đếm 20s, nếu hết 20s không có tương tác trong menu thì đóng menu.
 */
const startAutoCloseTimer = () => {
  clearAutoCloseTimer();
  autoCloseTimer = setTimeout(() => {
    closeDrawer();
    desktopMenu?.classList.remove("active");
    menuTrigger?.classList.remove("open");
  }, 20000); // 20 giây
};

/**
 * Xoá timer khi đóng menu hoặc khi cần reset.
 */
const clearAutoCloseTimer = () => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
};

/**
 * Reset timer chỉ khi người dùng tương tác trong **vùng menu** (drawer hoặc desktopMenu).
 */
const resetIfMenuActive = () => {
  if (drawer.classList.contains('active') || desktopMenu?.classList.contains('active')) {
    startAutoCloseTimer();
  }
};

// Gán sự kiện vào **menu khu vực** thay vì toàn document
['click', 'mousemove', 'scroll', 'keydown', 'touchstart'].forEach(event => {
  desktopMenu?.addEventListener(event, resetIfMenuActive);
  drawer?.addEventListener(event, resetIfMenuActive);
});

// ================== MOBILE DRAWER ==================
const openDrawer = () => {
  drawer.classList.add("active");
  document.body.style.overflow = "hidden";
  startAutoCloseTimer(); // Bắt đầu đếm khi mở
};
const closeDrawer = () => {
  drawer.classList.remove("active");
  document.body.style.overflow = "";
  clearAutoCloseTimer(); // Xoá timer khi đóng
};

// ================== DESKTOP MENU (SLIDE-IN) ==================
const toggleDesktopMenu = () => {
  desktopMenu.classList.toggle("active");
  menuTrigger.classList.toggle("open");

  if (desktopMenu.classList.contains("active")) {
    startAutoCloseTimer(); // Bắt đầu đếm khi mở
  } else {
    clearAutoCloseTimer(); // Xoá timer khi đóng
  }
};

// ================== EVENT HANDLERS ==================
// Click menu trigger
if (menuTrigger) {
  menuTrigger.addEventListener("click", () => {
    if (isDesktop()) {
      toggleDesktopMenu();
    } else {
      openDrawer();
    }
  });
}

// Click ngoài menu (desktop) -> đóng
document.addEventListener("click", (e) => {
  if (isDesktop() && !desktopMenu?.contains(e.target) && !menuTrigger.contains(e.target)) {
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
if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
if (overlay) overlay.addEventListener("click", closeDrawer);

// ================== HEADER SCROLL HIDE/SHOW ==================
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScrollY = currentScrollY;
});
