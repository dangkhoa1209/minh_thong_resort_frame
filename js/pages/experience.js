
  const wrapper = document.querySelector('.experience-wrapper');
  const items = document.querySelectorAll('.experience-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      wrapper.classList.add('open');
    });
  });
