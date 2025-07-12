document.querySelectorAll('.faq-item').forEach(faqItem => {
  faqItem.addEventListener('click', (event) => {
    const item = event.currentTarget; // hoặc dùng trực tiếp faqItem
    const isActive = item.classList.contains('active');

    // Bỏ active tất cả
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

    // Nếu chưa active thì thêm vào
    if (!isActive) {
      item.classList.add('active');
    }
  });
});


fetch('/components/footer/index.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html
  })

// slide project
const images = [
  "https://swiperjs.com/demos/images/nature-1.jpg",
  "https://swiperjs.com/demos/images/nature-2.jpg",
  "https://swiperjs.com/demos/images/nature-3.jpg",
  "https://swiperjs.com/demos/images/nature-4.jpg",
  "https://swiperjs.com/demos/images/nature-5.jpg"
];

const bg = document.getElementById('slideBackground');

const setBackground = (index) => {
  bg.style.backgroundImage = `url(${images[index]})`;
};

const swiper = new Swiper(".swiper-projects", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  spaceBetween: 30,
  slidesPerView: 5,
  coverflowEffect: {
    rotate: 20,            // Không xoay
    stretch: -50,         // Thu hẹp chiều ngang 2 bên
    depth: 150,           // Hiệu ứng 3D chiều sâu
    modifier: 1,
    slideShadows: false   // Tắt bóng nếu không cần
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  on: {
    init(swiper) {
      setBackground(swiper.realIndex);
    },
    slideChange(swiper) {
      setBackground(swiper.realIndex);
    }
  }
});