// Lấy các phần tử (có thể null nếu DOM chưa có)
let menuTrigger = document.querySelector("#header-menu");
let drawer = document.querySelector(".header-drawer");
let closeBtn = document.querySelector(".header-drawer__close");
let overlay = document.querySelector(".header-drawer__overlay");
let desktopMenu = document.querySelector(".desktop-menu");
let header = document.querySelector('.header');
const isDesktop = () => window.innerWidth > 1024;



if (!menuTrigger || !drawer || !desktopMenu || !header || !closeBtn || !overlay) {

  console.log('aádfasdfs');
  
  setTimeout(() => {
   try {
     menuTrigger = document.querySelector("#header-menu");
    drawer = document.querySelector(".header-drawer");
    closeBtn = document.querySelector(".header-drawer__close");
    overlay = document.querySelector(".header-drawer__overlay");
    desktopMenu = document.querySelector(".desktop-menu");
    header = document.querySelector('.header');    

    if (!menuTrigger || !drawer || !desktopMenu || !header || !closeBtn || !overlay) {
      console.log('menuTrigger', menuTrigger);
      console.log('drawer', drawer);
      console.log('desktopMenu', desktopMenu);
      console.log('header', header);
      console.log('closeBtn', closeBtn);
      console.log('overlay', overlay);
      return
    }

    start()
   } catch (error) {
    console.log(error);
    
   }
  }, 500)
}else {
    console.log('ok');

  start()
}


function start() {
  let autoCloseTimer;

  const clearAutoCloseTimer = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
  };

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove("active");
    document.body.style.overflow = "";
    clearAutoCloseTimer();
  };

  const startAutoCloseTimer = () => {
    clearAutoCloseTimer();
    autoCloseTimer = setTimeout(() => {
      closeDrawer();
      desktopMenu?.classList.remove("active");
      menuTrigger?.classList.remove("open");
    }, 20000); // 20 giây
  };

  const resetIfMenuActive = () => {
    if (
      (drawer && drawer.classList.contains("active")) ||
      (desktopMenu && desktopMenu.classList.contains("active"))
    ) {
      startAutoCloseTimer();
    }
  };

  // Gán sự kiện an toàn (nếu element tồn tại)
  ['click', 'mousemove', 'scroll', 'keydown', 'touchstart'].forEach(event => {
    desktopMenu?.addEventListener(event, resetIfMenuActive);
    drawer?.addEventListener(event, resetIfMenuActive);
  });

  // ================== MOBILE DRAWER ==================
  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add("active");
    document.body.style.overflow = "hidden";
    startAutoCloseTimer();
  };

  // ================== DESKTOP MENU (SLIDE-IN) ==================
  const toggleDesktopMenu = () => {
    if (!desktopMenu || !menuTrigger) return;
    desktopMenu.classList.toggle("active");
    menuTrigger.classList.toggle("open");
    if (desktopMenu.classList.contains("active")) {
      startAutoCloseTimer();
    } else {
      clearAutoCloseTimer();
    }
  };

  // ================== EVENT HANDLERS ==================
  menuTrigger?.addEventListener("click", () => {
    if (isDesktop()) {
      toggleDesktopMenu();
    } else {
      openDrawer();
    }
  });

  // Click ngoài menu (desktop) -> đóng
  document.addEventListener("click", (e) => {
    if (
      isDesktop() &&
      desktopMenu &&
      !desktopMenu.contains(e.target) &&
      !menuTrigger?.contains(e.target)
    ) {
      desktopMenu.classList.remove("active");
      menuTrigger?.classList.remove("open");
      clearAutoCloseTimer();
    }
  });

  // ESC -> đóng tất cả
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      desktopMenu?.classList.remove("active");
      menuTrigger?.classList.remove("open");
      clearAutoCloseTimer();
    }
  });

  // Drawer close buttons
  closeBtn?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  // ================== HEADER SCROLL HIDE/SHOW ==================
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastScrollY = currentScrollY;
  });
}

