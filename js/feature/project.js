// ************** CARD EFFECT **************

// Lấy các object được gắn trên window
const cardsEffect = window.cardsEffect || {}; // Thư viện xử lý hiệu ứng scroll
const barbaGoProject = window.barbaGo || null;       // Hàm chuyển trang với hiệu ứng (barba.js)

// DOM tới container & các phần tử project
const projectsContainer = document.querySelector('.projects');
const projects = document.querySelectorAll('.project');

// Cập nhật biến CSS tùy chỉnh cho số lượng & chiều cao project
projectsContainer.style.setProperty('--projects-count', projects.length);
projectsContainer.style.setProperty('--project-height', `${projects[0].clientHeight}px`);

// Duyệt qua từng project để gắn hiệu ứng scroll
Array.from(projects).forEach((project, index) => {
  const offsetTop = 0;

  // Set padding top (để giữ khoảng cách hoặc layout)
  project.style.paddingTop = `${offsetTop}px`;

  // Nếu là project cuối thì bỏ qua không cần xử lý scroll tiếp theo
  if (index === projects.length - 1) {
    return;
  }

  const toScale = 0.85; // Tỷ lệ thu nhỏ khi scroll
  const nextproject = projects[index + 1];
  const projectInner = project.querySelector('.project__inner');

  // Quan sát khi phần tử tiếp theo scroll đến màn hình
  cardsEffect.ScrollObserver.Element(nextproject, {
    offsetTop,
    offsetBottom: window.innerHeight - project.clientHeight
  }).onScroll(({ percentageY }) => {
    // Khi scroll tới điểm trigger, giảm scale và độ sáng
    projectInner.style.scale = cardsEffect.valueAtPercentage({
      from: 1,
      to: toScale,
      percentage: percentageY
    });

    projectInner.style.filter = `brightness(${cardsEffect.valueAtPercentage({
      from: 1,
      to: 0.6,
      percentage: percentageY
    })})`;
  });
});


const projects2 = document.querySelectorAll('.project');

function updateScaleOnScroll() {
  const windowHeight = window.innerHeight;

  projects2.forEach(project => {
    const rect = project.getBoundingClientRect();
    const projectMid = rect.top + rect.height / 2;
    const screenMid = windowHeight / 2;

    const distanceToCenter = Math.abs(projectMid - screenMid);
    const maxDistance = windowHeight / 2;

    const ratio = Math.min(distanceToCenter / maxDistance, 1);

    const img = project.querySelector('img');

    // Nếu ảnh nằm phía dưới trung tâm → áp dụng scale > 1
    if (projectMid > screenMid) {
      const scale = 1 + ratio * 0.2; // 1 → 1.2
      img.style.transform = `scale(${scale})`;
    } else {
      img.style.transform = 'scale(1)';
    }
  });
}


window.addEventListener('scroll', updateScaleOnScroll);
window.addEventListener('resize', updateScaleOnScroll);
window.addEventListener('load', updateScaleOnScroll);




// ************** OPEN PROJECT **************

// Setup click để mở rộng project__inner như fullscreen
const items = document.querySelectorAll('.project');

items.forEach(item => {
  const popup = item.querySelector('.project__inner');
  const pageTo = popup.dataset.pageTo;

  if (!pageTo) return;

  item.addEventListener('click', (e) => {
    e.stopPropagation();

    const rect = item.getBoundingClientRect();
    document.body.style.overflow = 'hidden';

    popup.classList.remove('expand-active');
    popup.style.transition = 'none';

    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.width = rect.width + 'px';
    popup.style.height = rect.height + 'px';
    popup.style.transform = 'translateX(0)';
    popup.style.zIndex = 9999;

    // Lấy scale hiện tại của ảnh
    const img = popup.querySelector('img');
    const computedStyle = window.getComputedStyle(img);
    const currentTransform = computedStyle.transform;

    // Áp lại scale hiện tại để không nhảy về scale(1) ngay lập tức
    img.style.transition = 'none';
    img.style.transform = currentTransform;

    void popup.offsetWidth;

    // Animation mở rộng
    requestAnimationFrame(() => {
      popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('expand-active');

      // Reset ảnh về scale(1) mượt
      img.style.transition = 'transform 0.5s ease';
      img.style.transform = 'scale(1)';

      popup.style.scale = '1';
      popup.style.filter = 'brightness(1)';

      if (barbaGoProject) {
        barbaGoProject(pageTo, 1000);
      } else {
        window.location.href = pageTo;
      }
    });
  });
});
