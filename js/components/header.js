// ************** CLICK BACK HOME **************

const barbaGoHeader = window.barbaGo || null;

const logos = document.querySelectorAll('.logo')



logos?.forEach(logo => {
  logo.addEventListener('click', () => {
    const basePath = getBasePath()    
    window.location.href = basePath || '/';

    // if (barbaGoHeader) {
    //  barbaGoHeader('/');
    // } else {
    //   window.location.href = '/';
    // }
  });
});


  const menuTrigger = document.querySelector("#header-menu");
  const drawer = document.querySelector(".header-drawer");
  const closeBtn = document.querySelector(".header-drawer__close");
  const overlay = document.querySelector(".header-drawer__overlay");

  const openDrawer = () => drawer.classList.add("active");
  const closeDrawer = () => drawer.classList.remove("active");

  if (menuTrigger && drawer) {
    menuTrigger.addEventListener("click", openDrawer);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  // Đóng khi nhấn ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });