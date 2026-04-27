let slidesData = [];
let bg = document.getElementById("slideBackground");

function getProjectCover(item) {
  return item?.banner_image || item?.image_1 || "";
}

function isProjectActive(item) {
  return item?.is_active !== false;
}

const CUSTOM_PROJECT_SLUGS = new Set([
  "ana-mandara-villas-dalat",
  "binh-an-village-dalat",
  "four-seasons-resort-the-nam-hai",
  "marriott-renaissance-hoi-an",
  "mercure-hotel-vung-tau",
  "pear-hoi-an",
]);

function getProjectPageUrl(item) {
  const slug = item?.slug || "";
  if (!slug) return item?.project_url || "";
  const defaultStaticUrl = `/pages/project/${slug}.html`;
  if (item?.project_url && item.project_url !== defaultStaticUrl) {
    return item.project_url;
  }
  if (CUSTOM_PROJECT_SLUGS.has(slug)) {
    return item?.project_url || defaultStaticUrl;
  }
  return `/pages/project/project-detail.html?slug=${encodeURIComponent(slug)}`;
}

function setSlidesVisible(visible) {
  const section = document.querySelector(".slide-projects");
  if (!section) return;
  section.style.display = visible ? "" : "none";
}

function getCurrentProjectSlug() {
  const query = new URLSearchParams(window.location.search);
  const slugFromQuery = query.get("project") || query.get("slug");
  if (slugFromQuery) return slugFromQuery;
  const fileName = window.location.pathname.split("/").pop() || "";
  const slugFromFile = fileName.replace(".html", "");
  if (slugFromFile === "project-detail") return "";
  return slugFromFile;
}

function setBackground(index) {
  if (!bg) bg = document.getElementById("slideBackground");
  if (!bg || !slidesData[index]) return;
  bg.style.backgroundImage = `url(${getAssetUrl(getProjectCover(slidesData[index]))})`;
}

function goToProject(index) {
  const item = slidesData[index];
  if (!item) return;
  const projectUrl = getProjectPageUrl(item);
  if (!projectUrl) return;
  window.location.href = `${getBasePath()}${projectUrl}`;
}

function renderSlides() {
  const wrapper = document.querySelector(".swiper-projects .swiper-wrapper");
  if (!wrapper) return false;
  if (!Array.isArray(slidesData) || slidesData.length === 0) {
    wrapper.innerHTML = "";
    setSlidesVisible(false);
    return false;
  }

  slidesData = slidesData.filter((item) => Boolean(getProjectCover(item)));
  if (slidesData.length === 0) {
    wrapper.innerHTML = "";
    setSlidesVisible(false);
    return false;
  }

  setSlidesVisible(true);
  wrapper.innerHTML = slidesData
    .map(
      (item, index) =>
        `<div class="swiper-slide" data-index="${index}"><img src="${getAssetUrl(getProjectCover(item))}" /></div>`
    )
    .join("");
  return true;
}

async function loadOtherProjectsFromApi() {
  const slug = getCurrentProjectSlug();
  try {
    if (slug) {
      const response = await fetch(`${getApiBaseUrl()}/public/projects/${slug}/other-projects?limit=6`);
      if (response.ok) {
        const payload = await response.json();
        const items = (Array.isArray(payload?.data) ? payload.data : []).filter(isProjectActive);
        if (items.length > 0) {
          return items;
        }
      }
    }

    const fallbackResponse = await fetch(`${getApiBaseUrl()}/public/projects?page=1&limit=6`);
    if (!fallbackResponse.ok) return [];
    const fallbackPayload = await fallbackResponse.json();
    const fallbackItems = (Array.isArray(fallbackPayload?.data?.items) ? fallbackPayload.data.items : []).filter(isProjectActive);
    if (!slug) return fallbackItems;
    return fallbackItems.filter((item) => item?.slug !== slug);
  } catch (_error) {
    return [];
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

function waitForSlideContainer(retries = 50, delay = 120) {
  return new Promise((resolve) => {
    const check = (left) => {
      const wrapper = document.querySelector(".swiper-projects .swiper-wrapper");
      if (wrapper) {
        resolve(true);
        return;
      }
      if (left <= 0) {
        resolve(false);
        return;
      }
      setTimeout(() => check(left - 1), delay);
    };
    check(retries);
  });
}

async function bootstrapSlideProjects() {
  const ready = await waitForSlideContainer();
  if (!ready) return;
  setSlidesVisible(false);
  slidesData = await loadOtherProjectsFromApi();
  const hasSlides = renderSlides();
  if (!hasSlides) return;
  retryInitSwiper();
}

bootstrapSlideProjects();
