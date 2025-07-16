loadComponent('../components/header/index.html', 'place-header')

const wrapper = document.querySelector('.experience-wrapper');
const items = document.querySelectorAll('.experience-item');
const placeHeader = document.getElementById('place-header');


items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    wrapper.classList.add('open');
    // Ẩn header
    placeHeader.style.display = 'none';
  });
});


const closeButtons = document.querySelectorAll('.close-btn');
closeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    items.forEach(i => i.classList.remove('active'));
    wrapper.classList.remove('open');
    // Hiện header lại
    placeHeader.style.display = '';
  });
});