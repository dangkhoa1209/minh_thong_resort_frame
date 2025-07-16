
// ============================================
//  Cài đặt hình nền động theo từng slide Swiper
// ============================================

// Danh sách hình ảnh sử dụng làm nền khi chuyển slide
const images = [
  "/assets/images/four-seasons-resort-the-nam-hai/1.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/2.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/3.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/4.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/5.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/6.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/7.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/8.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/9.webp",
  "/assets/images/four-seasons-resort-the-nam-hai/10.webp"
];

// Phần tử nền cần thay đổi ảnh nền
const bg = document.getElementById('slideBackground');

// Hàm thay đổi ảnh nền theo chỉ số index
const basePathBackground = getBasePath()

const setBackground = (index) => {
  bg.style.backgroundImage = `url(${basePathBackground}${images[index]})`;
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
        console.log('clickedIndex', swiper.clickedIndex);
        console.log('clickedSlide', swiper.clickedSlide);
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
