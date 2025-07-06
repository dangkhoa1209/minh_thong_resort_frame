
const cardsEffect = window.cardsEffect || {};
const barbaGo = window.barbaGo || null;


const projectsContainer = document.querySelector('.projects');
const projects = document.querySelectorAll('.project')
projectsContainer.style.setProperty('--projects-count', projects.length)
projectsContainer.style.setProperty(
  '--project-height',
  `${projects[0].clientHeight}px`
)

Array.from(projects).forEach((project, index) => {
  const offsetTop = 0
  project.style.paddingTop = `${offsetTop}px`
  if (index === projects.length - 1) {
    return
  }
  const toScale = 0.85
  const nextproject = projects[index + 1]
  const projectInner = project.querySelector('.project__inner')

  cardsEffect.ScrollObserver.Element(nextproject, {
    offsetTop,
    offsetBottom: window.innerHeight - project.clientHeight
  }).onScroll(({ percentageY }) => {
    projectInner.style.scale = cardsEffect.valueAtPercentage({
      from: 1,
      to: toScale,
      percentage: percentageY
    })
    projectInner.style.filter = `brightness(${cardsEffect.valueAtPercentage({
      from: 1,
      to: 0.6,
      percentage: percentageY
    })})`
  })
})

const items = document.querySelectorAll('.project');

items.forEach(item => {
  const popup = item.querySelector('.project__inner');
  const pageTo = popup.dataset.pageTo;

  if (!pageTo) return;

  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = item.getBoundingClientRect();
    document.body.style.overflow = 'hidden';

    // Reset class & transition để chuẩn bị vị trí ban đầu
    popup.classList.remove('expand-active');
    popup.style.transition = 'none';

    // Thiết lập vị trí ban đầu (khớp item)
    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.width = rect.width + 'px';
    popup.style.height = rect.height + 'px';
    popup.style.transform = 'translateX(0)';
   
    popup.style.zIndex = 9999;

    // Force reflow để đảm bảo transition được kích hoạt
    void popup.offsetWidth;

    // Bắt đầu transition
    requestAnimationFrame(() => {
      popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('expand-active');
      popup.style.scale = '1';
      popup.style.filter = 'brightness(1)';
      barbaGo?.(pageTo, 1000);
    });
  });
});







