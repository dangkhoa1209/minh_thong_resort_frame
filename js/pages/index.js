// ============================================
// 1. Load footer HTML động
// ============================================
// Tải nội dung HTML từ /components/footer/index.html và chèn vào phần tử có id "footer-placeholder"
fetch('/components/footer/index.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html;
  });



// ============================================
// 2. Toggle mở/đóng các mục trong danh sách why choose us
// ============================================
document.querySelectorAll('.faq-item').forEach(faqItem => {
  faqItem.addEventListener('click', (event) => {
    const item = event.currentTarget; // Lấy chính phần tử đang được click
    const isActive = item.classList.contains('active');

    // Bỏ class 'active' khỏi tất cả .faq-item
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

    // Nếu item chưa có 'active' thì thêm vào lại
    if (!isActive) {
      item.classList.add('active');
    }
  });
});


// ============================================
// 3. Cài đặt hình nền động theo từng slide Swiper
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
  "/assets/images/four-seasons-resort-the-nam-hai/9.webp"
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
const swiper = new Swiper(".swiper-projects", {
  effect: "coverflow",       // 👈 Kích hoạt hiệu ứng 3D coverflow
  grabCursor: true,          // 👈 Đổi con trỏ chuột khi kéo
  centeredSlides: true,      // 👈 Slide trung tâm sẽ nằm chính giữa
  loop: true,                // 👈 Cho phép lặp vô tận
  spaceBetween: 120,         // 👈 Khoảng cách giữa các slide
  slidesPerView: 3,          // 👈 Hiển thị 3 slide cùng lúc
  // Cấu hình hiệu ứng coverflow
  coverflowEffect: {
    rotate: 30,              // 👈 Góc xoay của slide
    stretch: 80,             // 👈 Khoảng cách ép ngang giữa các slide
    depth: 300,              // 👈 Độ sâu không gian 3D
    modifier: 0.5,           // 👈 Hệ số điều chỉnh tổng thể
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


