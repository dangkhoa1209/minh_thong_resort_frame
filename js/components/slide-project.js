
// ============================================
//  Cài đặt hình nền động theo từng slide Swiper
// ============================================

// Danh sách hình ảnh sử dụng làm nền khi chuyển slide
const images = [
  "/assets/images/ana-mandara/5.webp",
  "/assets/images/binh-an/1.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/1.webp",
  "/assets/images/marriott-renaissance-hoi-an/1.webp",
  "/assets/images/mercure-hotel/1.webp",
  "/assets/images/pear-hoi-an/1.webp"
];

const pages = [
  "/pages/project/ana-mandara-villas-dalat.html",
  "/pages/project/binh-an-village-dalat.html",
  "/pages/project/four-seasons-resort-the-nam-hai.html",
  "/pages/project/marriott-renaissance-hoi-an.html",
  "/pages/project/mercure-hotel-vung-tau.html",
  "/pages/project/pear-hoi-an.html"
]

// Phần tử nền cần thay đổi ảnh nền
let bg = document.getElementById('slideBackground');

// Hàm thay đổi ảnh nền theo chỉ số index
const basePathBackground = getBasePath()

const setBackground = (index) => {
  if(!bg) {
    bg = document.getElementById('slideBackground');
  }
  if(!bg){
    return
  }
  bg.style.backgroundImage = `url(${basePathBackground}${images[index]})`;
};

const goToProject = (index) => {
  const basePath = getBasePath()
   window.location.href = `${basePath}${pages[index]}`;
};



// ============================================
// 4. Khởi tạo Swiper với hiệu ứng coverflow
// ============================================
function initSwiper() {
  if (typeof Swiper === 'undefined') {
    console.warn('🚫 Swiper chưa được load!');
    return false;
  }

  const container = document.querySelector('.swiper-projects');
  if (!container) {
    console.warn('🚫 DOM .swiper-projects chưa có!');
    return false;
  }

  const width = window.innerWidth;

  let slidesPerView, spaceBetween, rotate, stretch, depth, modifier;

  if (width <= 768) { // Mobile
    slidesPerView = 1.8;
    spaceBetween = 20;
    rotate = 40;
    stretch = 0;
    depth = 100;
    modifier = 1;
  } else if (width <= 1024) { // iPad
    slidesPerView = 3;
    spaceBetween = 60;
    rotate = 35;
    stretch = 40;
    depth = 150;
    modifier = 0.8;
  } else if (width <= 1280) { // Macbook 13"
    slidesPerView = 3;
    spaceBetween = 80;
    rotate = 30;
    stretch = 60;
    depth = 200;
    modifier = 0.7;
  } else { // Desktop lớn
    slidesPerView = 3;
    spaceBetween = 120;
    rotate = 40;
    stretch = 80;
    depth = 300;
    modifier = 0.5;
  }

  const swiper = new Swiper(".swiper-projects", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    spaceBetween: spaceBetween,
    slidesPerView: slidesPerView,
      watchSlidesProgress: true,
    coverflowEffect: {
      rotate: rotate,
      stretch: stretch,
      depth: depth,
      modifier: modifier,
      slideShadows: false
    },
    on: {
      init(swiper) {
        setBackground(swiper.realIndex);
      },
      slideChange(swiper) {
        setBackground(swiper.realIndex);
      },
      click(swiper) {
        const clickedSlide = swiper.clickedSlide;
        if (!clickedSlide) return;

        const originalIndex = parseInt(clickedSlide.dataset.index, 10);
        if (isNaN(originalIndex)) return;

        goToProject(originalIndex);
      }
    }
  });

  return true;
}


function retryInitSwiper(retries = 50, delay = 300) {
  const success = initSwiper();
  if (!success && retries > 0) {
    setTimeout(() => retryInitSwiper(retries - 1, delay), delay);
  } else if (!success) {
    console.error('❌ Không thể khởi tạo Swiper sau 50 lần thử.');
  }
}

retryInitSwiper(); 
