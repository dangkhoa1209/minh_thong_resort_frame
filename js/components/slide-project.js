
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
const setBackground = (index) => {
  bg.style.backgroundImage = `url(${images[index]})`;
};


// ============================================
// 4. Khởi tạo Swiper với hiệu ứng coverflow
// ============================================
const isMobile = window.innerWidth <= 768;

const swiper = new Swiper(".swiper-projects", {
  effect: "coverflow",       // 👈 Kích hoạt hiệu ứng 3D coverflow
  grabCursor: true,          // 👈 Đổi con trỏ chuột khi kéo
  centeredSlides: true,      // 👈 Slide trung tâm sẽ nằm chính giữa
  loop: true,                // 👈 Cho phép lặp vô tận
  spaceBetween: isMobile ? 20 : 120,
  slidesPerView: isMobile ? 1.8 : 3,
  // Cấu hình hiệu ứng coverflow
  coverflowEffect: {
   rotate: isMobile ? 40 : 30,
    stretch: isMobile ? 0 : 80,
    depth: isMobile ? 100 : 300,
    modifier: isMobile ? 1 : 0.5,
    slideShadows: false      // 👈 Tắt đổ bóng nếu không cần
  },

  // Sự kiện của Swiper
  on: {
    init(swiper) {
      // Gán hình nền khi khởi tạo
      setBackground(swiper.realIndex);
    },
    slideChange(swiper) {
      // Gán lại hình nền khi chuyển slide
      setBackground(swiper.realIndex);
    },
    click(swiper, event) {
      const clickedIndex = swiper.clickedIndex;
      const clickedSlide = swiper.clickedSlide;

      console.log('clickedIndex', clickedIndex);
      console.log('clickedSlide', clickedSlide);


      // TODO: go to project
    }
  }
});


