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

  const toScale = 0.9; // Tỷ lệ thu nhỏ khi scroll
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
const introduceSection = document.querySelector('#introduce');

items.forEach(item => {
  const popup = item.querySelector('.project__inner');
  let pageTo = popup.dataset.pageTo;

  if (!pageTo) return;

  const basePath = getBasePath();
  if (basePath) pageTo = basePath + pageTo;

  item.addEventListener('click', (e) => {
    e.stopPropagation();

    const currentIndex = parseInt(item.dataset.index, 10);

    // Kiểm tra #introduce có đang trên màn hình không
    let introduceInView = false;
    let introduceTop = 0;
    if (introduceSection) {
      const rectIntro = introduceSection.getBoundingClientRect();
      introduceInView =
        rectIntro.top < window.innerHeight && rectIntro.bottom > 0;
      introduceTop = rectIntro.top;
    }

    // Di chuyển các project sau
    items.forEach(other => {
      const otherIndex = parseInt(other.dataset.index, 10);
      if (otherIndex > currentIndex) {
        if (introduceInView) {
          // Tính khoảng cách di chuyển sao cho đáy .projects cách top introduce 20px
          const projectRect = other.getBoundingClientRect();
          const projectBottom = projectRect.bottom;
          const targetBottom = introduceTop - 20;
          const moveDistance = targetBottom - projectBottom;

          // Nếu project hiện tại chạm trước thì chỉ di chuyển phần cần thiết
          other.style.transform = `translateY(${moveDistance}px)`;
          other.style.opacity = '0';
        } else {
          // Bay thẳng xuống ngoài màn hình (150vh)
          other.style.transform = 'translateY(150vh)';
          other.style.opacity = '0';
        }
        other.style.transition = 'all 0.8s ease-in-out';
        other.style.pointerEvents = 'none';
      }
    });

    // Xử lý mở rộng project được click
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

    const img = popup.querySelector('img');
    const computedStyle = window.getComputedStyle(img);
    const currentTransform = computedStyle.transform;
    img.style.transition = 'none';
    img.style.transform = currentTransform;

    void popup.offsetWidth;

    requestAnimationFrame(() => {
      popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('expand-active');

      img.style.transition = 'transform 0.5s ease';
      img.style.transform = 'scale(1)';

      popup.style.scale = '1';
      popup.style.filter = 'brightness(1)';

      if (barbaGoProject) {
        barbaGoProject(pageTo, 1000);
      } else {
        setTimeout(() => {
          window.location.href = pageTo;
        }, 1000);
      }
    });
  });
});
