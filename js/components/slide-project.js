
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
  "/assets/images/the-pear-hoi-an/1.webp"
];

const pages = [
  "/pages/project/ana-mandara-villas-dalat.html",
  "/pages/project/binh-an-village-dalat.html",
  "/pages/project/four-seasons-resort-the-nam-hai.html",
  "/pages/project/marriott-renaissance-hoi-an.html",
  "/pages/project/mercure-hotel-vung-tau.html",
  "/pages/project/mercure-hotel-vung-tau.html"
]

// Phần tử nền cần thay đổi ảnh nền
const bg = document.getElementById('slideBackground');

// Hàm thay đổi ảnh nền theo chỉ số index
const basePathBackground = getBasePath()

const setBackground = (index) => {
  console.log('BGindex', index);

  bg.style.backgroundImage = `url(${basePathBackground}${images[index]})`;
};

const goToProject = (index) => {
  const basePath = getBasePath()
  // console.log('${basePath}/${pages[index]}', `${basePath}${pages[index]}`);
   window.location.href = `${basePath}${pages[index]}`;
};



// ============================================
// 4. Khởi tạo Swiper với hiệu ứng coverflow
// ============================================
const isMobile = window.innerWidth <= 768;

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

  const swiper = new Swiper(".swiper-projects", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    spaceBetween: isMobile ? 20 : 120,
    slidesPerView: isMobile ? 1.8 : 3,
    coverflowEffect: {
      rotate: isMobile ? 40 : 30,
      stretch: isMobile ? 0 : 80,
      depth: isMobile ? 100 : 300,
      modifier: isMobile ? 1 : 0.5,
      slideShadows: false
    },
    on: {
      init(swiper) {
        setBackground(swiper.realIndex);
      },
      slideChange(swiper) {
        setBackground(swiper.realIndex);
      },
      click(swiper, event) {
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


function retryInitSwiper(retries = 50, delay = 100) {
  const success = initSwiper();
  if (!success && retries > 0) {
    setTimeout(() => retryInitSwiper(retries - 1, delay), delay);
  } else if (!success) {
    console.error('❌ Không thể khởi tạo Swiper sau 20 lần thử.');
  }
}

retryInitSwiper(); // Thử khởi tạo Swiper, nếu fail thì retry mỗi 500ms, tối đa 20 lần
