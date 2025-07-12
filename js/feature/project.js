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


// ************** OPEN PROJECT **************

// Setup click để mở rộng project__inner như fullscreen
const items = document.querySelectorAll('.project');

items.forEach(item => {
  const popup = item.querySelector('.project__inner');
  const pageTo = popup.dataset.pageTo; // Lấy route cần điều hướng khi mở rộng

  if (!pageTo) return; // Nếu không có route thì bỏ qua

  item.addEventListener('click', (e) => {
    e.stopPropagation();

    const rect = item.getBoundingClientRect(); // Lấy vị trí của item gốc
    document.body.style.overflow = 'hidden';   // Tránh scroll khi mở

    // Reset style ban đầu cho popup
    popup.classList.remove('expand-active');
    popup.style.transition = 'none';

    // Đặt popup trùng đúng vị trí gốc (để làm hiệu ứng từ chỗ cũ bay ra)
    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.width = rect.width + 'px';
    popup.style.height = rect.height + 'px';
    popup.style.transform = 'translateX(0)';
    popup.style.zIndex = 9999;

    // Force reflow để đảm bảo CSS transition hoạt động
    void popup.offsetWidth;

    // Animation bắt đầu: mở rộng kích thước
    requestAnimationFrame(() => {
      popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('expand-active');
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
