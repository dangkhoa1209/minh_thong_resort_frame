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