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

const openDrawer = () => {
  drawer.classList.add("active");
  document.body.style.overflow = "hidden"; // Chặn scroll
};

const closeDrawer = () => {
  drawer.classList.remove("active");
  document.body.style.overflow = ""; // Khôi phục scroll
};

if (menuTrigger && drawer) {
  menuTrigger.addEventListener("click", openDrawer);
}

if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
if (overlay) overlay.addEventListener("click", closeDrawer);

// Đóng khi nhấn ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});


//Scroll
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // Cuộn xuống -> ẩn header
    header.classList.add('hide');
  } else {
    // Cuộn lên -> hiện header
    header.classList.remove('hide');
  }

  lastScrollY = currentScrollY;
});
