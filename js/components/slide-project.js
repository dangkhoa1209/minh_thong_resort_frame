const fallbackSlides = [
  { image_1: "/assets/images/ana-mandara/5.webp", project_url: "/pages/project/ana-mandara-villas-dalat.html" },
  { image_1: "/assets/images/binh-an/1.webp", project_url: "/pages/project/binh-an-village-dalat.html" },
  { image_1: "/assets/images/four-seasons-resort-the-nam-hai/1.webp", project_url: "/pages/project/four-seasons-resort-the-nam-hai.html" },
  { image_1: "/assets/images/marriott-renaissance-hoi-an/1.webp", project_url: "/pages/project/marriott-renaissance-hoi-an.html" },
  { image_1: "/assets/images/mercure-hotel/1.webp", project_url: "/pages/project/mercure-hotel-vung-tau.html" },
  { image_1: "/assets/images/pear-hoi-an/1.webp", project_url: "/pages/project/pear-hoi-an.html" },
];

let slidesData = [...fallbackSlides];
let bg = document.getElementById("slideBackground");

function getProjectCover(item) {
  return item?.banner_image || item?.image_1 || "";
}

function getCurrentProjectSlug() {
  const fileName = window.location.pathname.split("/").pop() || "";
  return fileName.replace(".html", "");
}

function setBackground(index) {
  if (!bg) bg = document.getElementById("slideBackground");
  if (!bg || !slidesData[index]) return;
  bg.style.backgroundImage = `url(${getAssetUrl(getProjectCover(slidesData[index]))})`;
}

function goToProject(index) {
  const item = slidesData[index];
  if (!item) return;
  window.location.href = `${getBasePath()}${item.project_url}`;
}

function renderSlides() {
  const wrapper = document.querySelector(".swiper-projects .swiper-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = slidesData
    .map(
      (item, index) =>
        `<div class="swiper-slide" data-index="${index}"><img src="${getAssetUrl(getProjectCover(item))}" /></div>`
    )
    .join("");
}

async function loadOtherProjectsFromApi() {
  const slug = getCurrentProjectSlug();
  if (!slug) return;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/public/projects/${slug}/other-projects?limit=6`);
    if (!response.ok) return;
    const payload = await response.json();
    if (Array.isArray(payload?.data) && payload.data.length > 0) {
      slidesData = payload.data;
    }
  } catch (_error) {
    // Keep fallback.
  }
}

function initSwiper() {
  if (typeof Swiper === "undefined") return false;
  const container = document.querySelector(".swiper-projects");
  if (!container) return false;

  const width = window.innerWidth;
  let slidesPerView; let spaceBetween; let rotate; let stretch; let depth; let modifier;
  if (width <= 768) {
    slidesPerView = 1.8; spaceBetween = 20; rotate = 40; stretch = 0; depth = 100; modifier = 1;
  } else if (width <= 1024) {
    slidesPerView = 3; spaceBetween = 60; rotate = 35; stretch = 40; depth = 150; modifier = 0.8;
  } else if (width <= 1280) {
    slidesPerView = 3; spaceBetween = 80; rotate = 30; stretch = 60; depth = 200; modifier = 0.7;
  } else {
    slidesPerView = 3; spaceBetween = 120; rotate = 40; stretch = 80; depth = 300; modifier = 0.5;
  }

  new Swiper(".swiper-projects", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    spaceBetween,
    slidesPerView,
    coverflowEffect: { rotate, stretch, depth, modifier, slideShadows: false },
    on: {
      init(swiper) { setBackground(swiper.realIndex); },
      slideChange(swiper) { setBackground(swiper.realIndex); },
      click(swiper, event) {
        const clickedSlide = swiper.clickedSlide || event.target.closest(".swiper-slide");
        if (!clickedSlide) return;
        const originalIndex = parseInt(clickedSlide.dataset.index, 10);
        if (!Number.isNaN(originalIndex)) goToProject(originalIndex);
      },
    },
  });

  return true;
}

function retryInitSwiper(retries = 50, delay = 300) {
  const success = initSwiper();
  if (!success && retries > 0) {
    setTimeout(() => retryInitSwiper(retries - 1, delay), delay);
  }
}

(async function bootstrapSlideProjects() {
  await loadOtherProjectsFromApi();
  renderSlides();
  retryInitSwiper();
})();
