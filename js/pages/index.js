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

