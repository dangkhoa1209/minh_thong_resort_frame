// ============================================
//  Load footer HTML động
// ============================================
// Tải nội dung HTML từ /components/footer/index.html và chèn vào phần tử có id "place-footer"
if (window.ABEL_LOGOS?.initLogos) {
  window.ABEL_LOGOS.initLogos();
}

loadComponent('./components/header/index.html', 'place-header')
loadComponent('./components/footer/index.html', 'place-footer')

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const HOME_PARTNER_FALLBACK = [
  "/uploads/default/partners/asset-2.svg",
  "/uploads/default/partners/asset-3.svg",
  "/uploads/default/partners/asset-4.svg",
  "/uploads/default/partners/asset-5.svg",
  "/uploads/default/partners/asset-6.svg",
];

function renderHomePartners(logos) {
  const track = document.getElementById("home-partner-track");
  const partnerSection = document.querySelector(".partner");
  if (!track || !partnerSection) return;

  const items = (Array.isArray(logos) ? logos : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  if (items.length === 0) {
    track.innerHTML = "";
    partnerSection.style.display = "none";
    return;
  }

  const slideContent = items
    .map(
      (url, index) =>
        `<div class="partner-item"><img src="${escapeHtml(getAssetUrl(url))}" class="partner-logo" alt="Partner ${index + 1}"></div>`
    )
    .join("");

  track.innerHTML = `
    <div class="slide">${slideContent}</div>
    <div class="slide">${slideContent}</div>
  `;
  partnerSection.style.display = "";
}

async function loadHomePartners() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/public/settings/home-partners`);
    if (!response.ok) {
      renderHomePartners(HOME_PARTNER_FALLBACK);
      return;
    }
    const payload = await response.json();
    const logos = payload?.data?.logos;
    if (!Array.isArray(logos) || logos.length === 0) {
      renderHomePartners(HOME_PARTNER_FALLBACK);
      return;
    }
    renderHomePartners(logos);
  } catch (_error) {
    renderHomePartners(HOME_PARTNER_FALLBACK);
  }
}

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

const PROJECT_STATIC_SLUG_ALIASES = {
  "resort-spa-ana-mandara-villas": "ana-mandara-villas-dalat",
  "resort-binh-an-village": "binh-an-village-dalat",
  "resort-spa-renaissance": "marriott-renaissance-hoi-an",
  "hotel-mercure-vung-tau": "mercure-hotel-vung-tau",
  "resort-citadines-pearl-hoi-an": "pear-hoi-an",
};

function getProjectPageUrl(item) {
  const slug = item?.slug || "";
  if (!slug) return item?.project_url || "#";
  const staticSlug = PROJECT_STATIC_SLUG_ALIASES[slug] || slug;
  if (CUSTOM_PROJECT_SLUGS.has(staticSlug)) {
    return `/pages/project/${staticSlug}.html`;
  }
  const defaultStaticUrl = `/pages/project/${slug}.html`;
  if (item?.project_url && item.project_url !== defaultStaticUrl) {
    return item.project_url;
  }
  return `/pages/project/project-detail.html?slug=${encodeURIComponent(slug)}`;
}

function setHomeProjectsVisible(visible) {
  const section = document.querySelector(".projects");
  if (!section) return;
  section.style.display = visible ? "" : "none";
}

function renderHomeProjects(items) {
  const container = document.querySelector(".projects");
  if (!container) {
    return;
  }

  const activeItems = (Array.isArray(items) ? items : []).filter(isProjectActive);

  if (activeItems.length === 0) {
    container.innerHTML = "";
    setHomeProjectsVisible(false);
    return;
  }

  setHomeProjectsVisible(true);

  container.innerHTML = activeItems
    .map((item, index) => {
      const pageTo = getProjectPageUrl(item);
      const cover = getProjectCover(item);
      return `
        <div class="project" data-index="${index}">
          <div class="project__inner" data-page-to="${escapeHtml(pageTo)}">
            <img loading="lazy" src="${escapeHtml(getAssetUrl(cover))}" class="project-thumbnail" alt="${escapeHtml(item.title)}">
            <div class="project-meta">
              <h2 class="project-title font-style-montserrat">${escapeHtml(item.title || item.short_description || "")}</h2>
              <h2 class="project-desc font-style-montserrat">${escapeHtml(item.name || item.title || "")}</h2>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (typeof window.initCardsEffect === "function") {
    window.initCardsEffect();
  }
}

async function loadHomeProjects() {
  try {
    setHomeProjectsVisible(false);
    const response = await fetch(`${getApiBaseUrl()}/public/home/projects`);
    if (!response.ok) {
      renderHomeProjects([]);
      return;
    }
    const payload = await response.json();
    renderHomeProjects(payload.data || []);
  } catch (_error) {
    renderHomeProjects([]);
  }
}

loadHomeProjects();
loadHomePartners();



// ============================================
//  Toggle mở/đóng các mục trong danh sách why client choose us
// ============================================
document.querySelectorAll('.faq-item').forEach(faqItem => {
  faqItem.addEventListener('click', (event) => {
    const item = event.currentTarget; // Lấy chính phần tử đang được click
    const isActive = item.classList.contains('active');

    // Bỏ class 'active' khỏi tất cả .faq-item
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

    // Nếu item chưa có 'active' thì thêm vào lại
    if (!isActive) {
      item.classList.add('active');
    }
  });
});


document.querySelectorAll('button[data-href]').forEach(button => {
  button.addEventListener('click', () => {
    const url = button.getAttribute('data-href');
    const pathPage = getBasePath()
    setTimeout(() => {
      window.location.href = pathPage + url;
    }, 100);
  });
});


  const body = document.body;
  body.classList.add('no-scroll');


 const preloader = document.getElementById('preloader');
  // Đợi logo chạy xong (~1.2s) rồi ẩn preloader
  setTimeout(() => {
    preloader.classList.add('hidden');

    // Sau khi ẩn + 0.8s mới cho cuộn (đợi chạy animation đầu trang)
    setTimeout(() => {
      body.classList.remove('no-scroll');
    }, 1000);
  }, 1300);



const bg = document.querySelector('.banner__img.gb');
const logo = document.querySelector('.banner__img.logo');
const nonbg = document.querySelector('.banner__img.nonbg');
const bannerSection = document.querySelector('.banner');

let isCustomHomeBanner = false;
let ticking = false;

function applyCustomHomeBanner(bannerImage) {
  if (!bannerSection || !bg || !bannerImage) return;
  isCustomHomeBanner = true;
  bannerSection.classList.add("banner--custom");
  bg.src = getAssetUrl(bannerImage);
}

async function loadHomeBannerSetting() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/public/settings/home-banner`);
    if (!response.ok) return;
    const payload = await response.json();
    const bannerImage = String(payload?.data?.banner_image || "").trim();
    if (bannerImage) {
      applyCustomHomeBanner(bannerImage);
    }
  } catch (_error) {
    // Keep default effect banner when setting API is unavailable.
  }
}

function updateScrollEffects() {  
  const scrollY = window.scrollY;

  const maxPercent = 20; // giới hạn ±20%
  const bgOffsetPercent = Math.min(scrollY * 0.05, maxPercent);     // nền đi xuống
  const nonbgOffsetPercent = Math.max(scrollY * -0.03, -maxPercent); // foreground đi lên
  const logoOffset = scrollY * 0.8;

  // Dùng translate3d để bật GPU, scale đặt sẵn bằng CSS
  bg.style.transform = `translate3d(0, ${bgOffsetPercent}%, 0) scale(1)`;
  nonbg.style.transform = `translate3d(0, ${nonbgOffsetPercent}%, 0) scale(1)`;
  logo.style.transform = `translate3d(-50%, calc(-50% + ${logoOffset}px), 0)`;

  ticking = false;
}

function initHomeBannerEffects() {
  if (isCustomHomeBanner) return;
  if (!bg || !logo || !nonbg) return;

  logo.addEventListener('animationend', () => {
    logo.classList.add('animation-done');
  });

  window.addEventListener('scroll', () => {
    if (!logo.classList.contains('animation-done')) return;
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
}

(async function bootstrapHomeBanner() {
  await loadHomeBannerSetting();
  initHomeBannerEffects();
})();
