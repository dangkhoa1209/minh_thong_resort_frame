loadComponent("../components/header/index.html", "place-header", "dark");
loadComponent("../components/footer/index.html", "place-footer", "dark");

const CUSTOM_PROJECT_SLUGS = new Set([
  "ana-mandara-villas-dalat",
  "binh-an-village-dalat",
  "four-seasons-resort-the-nam-hai",
  "marriott-renaissance-hoi-an",
  "mercure-hotel-vung-tau",
  "pear-hoi-an",
]);
const PAGE_SIZE = 6;

const productsContainer = document.querySelector(".products");
const loadMoreBtn = document.getElementById("load-more");
let currentPage = 1;
let totalPages = 1;
let loading = false;

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getProjectCover(item) {
  return item?.banner_image || item?.image_1 || "";
}

function isProjectActive(item) {
  return item?.is_active !== false;
}

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

function renderProjectCard(item) {
  const pageTo = getProjectPageUrl(item);
  const cover = getProjectCover(item);
  return `
    <div class="product-item">
      <div class="image-container" data-page-to="${escapeHtml(pageTo)}">
        <img loading="lazy" src="${escapeHtml(getAssetUrl(cover))}" class="product-thumbnail" alt="${escapeHtml(item.title || item.name || "Project image")}">
      </div>
      <div class="product-description">
        <p class="resort-name">${escapeHtml(item.title || item.short_description || "")}${item.name ? ` ${escapeHtml(item.name)}` : ""}</p>
        <p class="location">${escapeHtml(item.location || "")}</p>
      </div>
    </div>
  `;
}

function updateLoadMoreVisibility() {
  if (!loadMoreBtn) return;
  const hasMore = currentPage < totalPages;
  loadMoreBtn.style.display = hasMore ? "" : "none";
  loadMoreBtn.disabled = loading || !hasMore;
}

async function fetchProjects(page) {
  const response = await fetch(
    `${getApiBaseUrl()}/public/projects?page=${page}&limit=${PAGE_SIZE}`
  );
  if (!response.ok) throw new Error("Cannot load projects");

  const payload = await response.json();
  const data = payload?.data || {};
  return {
    items: Array.isArray(data.items) ? data.items : [],
    pagination: data.pagination || { page: 1, total_pages: 1 },
  };
}

async function loadProjects(page = 1) {
  if (loading || !productsContainer) return;
  loading = true;
  updateLoadMoreVisibility();

  try {
    const result = await fetchProjects(page);
    const items = (result.items || []).filter(isProjectActive);
    const pagination = result.pagination || {};

    currentPage = Number(pagination.page || page);
    totalPages = Number(pagination.total_pages || 1);

    const html = items.map(renderProjectCard).join("");
    if (page === 1) {
      productsContainer.innerHTML = html;
    } else {
      productsContainer.insertAdjacentHTML("beforeend", html);
    }
  } catch (_error) {
    if (page === 1) {
      productsContainer.innerHTML = "";
    }
  } finally {
    loading = false;
    updateLoadMoreVisibility();
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    if (loading || currentPage >= totalPages) return;
    loadProjects(currentPage + 1);
  });
}

if (productsContainer) {
  productsContainer.addEventListener("click", (e) => {
    const item = e.target.closest(".product-item");
    if (!item || !productsContainer.contains(item)) return;

    const popup = item.querySelector(".image-container");
    if (!popup) return;

    const pageToRaw = popup.dataset.pageTo;
    if (!pageToRaw) return;

    let pageTo = pageToRaw;
    const basePath = getBasePath();
    if (basePath && pageTo.startsWith("/")) {
      pageTo = basePath + pageTo;
    }

    const rect = item.getBoundingClientRect();
    document.body.style.overflow = "hidden";

    popup.classList.remove("expand-active");
    popup.style.transition = "none";
    popup.style.top = `${rect.top}px`;
    popup.style.left = `${rect.left}px`;
    popup.style.width = `${rect.width}px`;
    popup.style.height = `${rect.height}px`;
    popup.style.transform = "translateX(0)";
    popup.style.zIndex = 9999;

    const img = popup.querySelector("img");
    if (img) {
      const computedStyle = window.getComputedStyle(img);
      img.style.transition = "none";
      img.style.transform = computedStyle.transform;
    }

    void popup.offsetWidth;

    requestAnimationFrame(() => {
      popup.style.transition = "all 0.8s ease-in-out";
      popup.classList.add("expand-active");
      if (img) {
        img.style.transition = "transform 0.5s ease";
        img.style.transform = "scale(1)";
      }
      popup.style.scale = "1";
      popup.style.filter = "brightness(1)";

      const navigateWithBarba = typeof window.barbaGo === "function";
      if (navigateWithBarba) {
        window.barbaGo(pageTo, 900);
        return;
      }

      // Keep transition feeling smooth even when Barba is unavailable.
      setTimeout(() => {
        window.location.href = pageTo;
      }, 900);
    });
  });
}

updateLoadMoreVisibility();
loadProjects(1);
