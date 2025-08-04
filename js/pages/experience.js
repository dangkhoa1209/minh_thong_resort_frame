loadComponent('../components/header/index.html', 'place-header');

const wrapper = document.querySelector('.experience-wrapper');
const items = document.querySelectorAll('.experience-item');
const placeHeader = document.getElementById('place-header');

items.forEach(item => {
  item.addEventListener('click', () => {
    // Nếu item đã active thì không làm gì cả
    if (item.classList.contains('active')) return;

    // Xóa trạng thái trước đó
    items.forEach(i => i.classList.remove('active', 'show-content'));

    item.classList.add('active');
    if (window.innerWidth > 768) {
      wrapper.classList.add('open');
    }

    placeHeader.style.display = 'none';
    // Chờ animation flex/width xong mới show content
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'flex' || e.propertyName === 'flex-grow' || e.propertyName === 'width') {
        item.classList.add('show-content');
        item.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    item.addEventListener('transitionend', onTransitionEnd);
  });
});


const closeButtons = document.querySelectorAll('.close-btn');
closeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(i => i.classList.remove('active', 'show-content'));
    wrapper.classList.remove('open');
    placeHeader.style.display = '';
  });
});
