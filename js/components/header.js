// ************** HEADER SCRIPT (DESKTOP + MOBILE) **************

// Logo -> về home
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

// Drawer (mobile)
const openDrawer = () => {
  drawer.classList.add("active");
  document.body.style.overflow = "hidden";
};
const closeDrawer = () => {
  drawer.classList.remove("active");
  document.body.style.overflow = "";
};

// Toggle menu (desktop slide-in từ trái)
const toggleDesktopMenu = () => {
  desktopMenu.classList.toggle("active");
  menuTrigger.classList.toggle("open");
};

// Click Menu
if (menuTrigger) {
  menuTrigger.addEventListener("click", () => {
    if (isDesktop()) {
      toggleDesktopMenu();
    } else {
      openDrawer();
    }
  });
}

// Click ngoài -> đóng menu (desktop)
document.addEventListener("click", (e) => {
  if (isDesktop() && !desktopMenu?.contains(e.target) && !menuTrigger.contains(e.target)) {
    desktopMenu.classList.remove("active");
    menuTrigger.classList.remove("open");
  }
});

// ESC -> đóng mọi thứ
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDrawer();
    desktopMenu.classList.remove("active");
    menuTrigger.classList.remove("open");
  }
});

// Drawer close buttons
if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
if (overlay) overlay.addEventListener("click", closeDrawer);

// Header hide/show khi scroll
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
