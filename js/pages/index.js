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


const bg = document.getElementById('slideBackground');

const setBackground = (index) => {
  bg.style.backgroundImage = `url(${images[index]})`;
};

const swiper = new Swiper(".swiper-projects", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  spaceBetween: 120,               // 👈 khoảng cách giữa các slide
  slidesPerView: 3,
  coverflowEffect: {
    rotate: 30,
    stretch: 80,                  // 👈 khoảng cách giữa slide coverflow
    depth: 300,
    modifier: 0.5,
    slideShadows: false
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
