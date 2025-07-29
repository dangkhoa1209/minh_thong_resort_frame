// ============================================
//  Load footer HTML động
// ============================================
// Tải nội dung HTML từ /components/footer/index.html và chèn vào phần tử có id "place-footer"
loadComponent('./components/header/index.html', 'place-header')
loadComponent('./components/footer/index.html', 'place-footer')



// ============================================
//  Toggle mở/đóng các mục trong danh sách why client choose us
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


document.querySelectorAll('button[data-href]').forEach(button => {
  button.addEventListener('click', () => {
    const url = button.getAttribute('data-href');
    const pathPage = getBasePath()
    setTimeout(() => {
      window.location.href = pathPage + url;
    }, 100);
  });
});


 const preloader = document.getElementById('preloader');
  // Đợi logo chạy xong (~1.2s) rồi ẩn preloader
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 1300);



const bg = document.querySelector('.banner__img.gb');
const logo = document.querySelector('.banner__img.logo');
const nonbg = document.querySelector('.banner__img.nonbg');

logo.addEventListener('animationend', () => {
  logo.classList.add('animation-done');
});

// Biến để tránh update quá nhiều frame
let ticking = false;

window.addEventListener('scroll', () => {
  if (!logo.classList.contains('animation-done')) return;

  if (!ticking) {
   
    requestAnimationFrame(updateScrollEffects);
     ticking = true;
  }
});

function updateScrollEffects() {  
  const scrollY = window.scrollY;

  const maxPercent = 20; // giới hạn ±20%
  const bgOffsetPercent = Math.min(scrollY * 0.05, maxPercent);     // nền đi xuống
  const nonbgOffsetPercent = Math.max(scrollY * -0.03, -maxPercent); // foreground đi lên
  const logoOffset = scrollY * 0.8;

  // Dùng translate3d để bật GPU, scale đặt sẵn bằng CSS
  bg.style.transform = `translate3d(0, ${bgOffsetPercent}%, 0) scale(1)`;
  nonbg.style.transform = `translate3d(0, ${nonbgOffsetPercent}%, 0) scale(1)`;
  logo.style.transform = `translate3d(-50%, calc(-50% + ${logoOffset}px), 0)`;

  ticking = false;
}
