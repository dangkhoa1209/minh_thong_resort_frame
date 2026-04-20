loadComponent("../../components/header/index.html", "place-header");
loadComponent("../../components/footer/index.html", "place-footer");
loadComponent("../../components/slide-project/index.html", "place-slide-project");

const popup = document.getElementById("popup");

function getCurrentProjectSlug() {
  const fileName = window.location.pathname.split("/").pop() || "";
  return fileName.replace(".html", "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ratioToClass(layout, ratio) {
  if (ratio && /^(\d+):(\d+)$/.test(ratio)) {
    const [w, h] = ratio.split(":");
    return `ratio-${w}-${h}`;
  }
  return layout === 2 ? "ratio-4-3" : "ratio-16-9";
}

function bindThumbIds() {
  document.querySelectorAll(".product-thumbnail").forEach((img, index) => {
    img.dataset.thumbId = `thumb-${index}`;
  });
}

function closePopup() {
  const popupImg = popup.querySelector(".popup-img");
  if (!popupImg) return;

  const sourceId = popupImg.dataset.sourceId;
  const original = document.querySelector(`.product-thumbnail[data-thumb-id="${sourceId}"]`);
  if (!original) return;

  const toRect = original.getBoundingClientRect();
  const fromRect = popupImg.getBoundingClientRect();
  const scale = Math.min(toRect.width / fromRect.width, toRect.height / fromRect.height);

  const clone = popupImg.cloneNode();
  clone.classList.remove("popup-img");
  Object.assign(clone.style, {
    position: "fixed",
    left: `${fromRect.left}px`,
    top: `${fromRect.top}px`,
    width: `${fromRect.width}px`,
    height: `${fromRect.height}px`,
    objectFit: "cover",
    zIndex: "9999",
    borderRadius: "0px",
    transformOrigin: "top left",
    transform: "scale(1)",
    transition: "all 0.5s ease-in-out",
  });

  document.body.appendChild(clone);
  popup.style.display = "none";
  popup.innerHTML = "";
  void clone.offsetWidth;

  Object.assign(clone.style, {
    left: `${toRect.left}px`,
    top: `${toRect.top}px`,
    transform: `scale(${scale})`,
    borderRadius: "20px",
  });

  setTimeout(() => clone.remove(), 500);
}

function initPopupPreview() {
  bindThumbIds();

  document.addEventListener("click", (event) => {
    const img = event.target.closest(".product-thumbnail");
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const clone = img.cloneNode();
    clone.classList.remove("product-thumbnail");

    const naturalW = img.naturalWidth || 16;
    const naturalH = img.naturalHeight || 9;
    const aspectRatio = naturalW / naturalH;
    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.95;
    let targetW = maxW;
    let targetH = maxW / aspectRatio;

    if (targetH > maxH) {
      targetH = maxH;
      targetW = maxH * aspectRatio;
    }

    Object.assign(clone.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      objectFit: "contain",
      objectPosition: "center",
      zIndex: "9999",
      borderRadius: "20px",
      transformOrigin: "top left",
      transform: "scale(1)",
      transition: "all 0.5s ease-in-out",
    });

    document.body.appendChild(clone);
    void clone.offsetWidth;

    requestAnimationFrame(() => {
      Object.assign(clone.style, {
        left: `${(window.innerWidth - targetW) / 2}px`,
        top: `${(window.innerHeight - targetH) / 2}px`,
        width: `${targetW}px`,
        height: `${targetH}px`,
        borderRadius: "0px",
      });
    });

    setTimeout(() => {
      clone.dataset.sourceId = img.dataset.thumbId;
      clone.classList.add("popup-img");
      popup.innerHTML = '<span class="popup-close" id="popupClose">✕</span>';
      popup.appendChild(clone);
      popup.style.display = "flex";
      document.getElementById("popupClose").addEventListener("click", closePopup);
    }, 500);
  });

  popup.addEventListener("click", (event) => {
    if (event.target === popup) closePopup();
  });
}

function renderProjectDetail(data) {
  const bannerImg = document.querySelector(".banner .banner__img");
  if (bannerImg && data.banner_image) {
    bannerImg.src = data.banner_image;
  }

  const thinTitle = document.querySelector(".about__title--thin");
  const boldTitle = document.querySelector(".about__title--bold");
  const contentNode = document.querySelector(".about__content p");
  if (thinTitle) thinTitle.textContent = data.banner_subtitle || "";
  if (boldTitle) boldTitle.textContent = data.banner_title || data.title || "";
  if (contentNode) contentNode.textContent = data.content || "";

  const productsContainer = document.querySelector(".products");
  if (!productsContainer || !Array.isArray(data.image_rows) || data.image_rows.length === 0) {
    return;
  }

  productsContainer.innerHTML = data.image_rows
    .map((row) => {
      const className = ratioToClass(row.layout, row.ratio);
      const images = (row.images || [])
        .map((item) => {
          const url = typeof item === "string" ? item : item.url;
          return `
            <div class="product-item ${className}">
              <img loading="lazy" src="${escapeHtml(url)}" class="product-thumbnail" alt="">
            </div>
          `;
        })
        .join("");
      return `<div class="product">${images}</div>`;
    })
    .join("");

  bindThumbIds();
}

async function loadProjectDetail() {
  const slug = getCurrentProjectSlug();
  if (!slug) return;

  try {
    const response = await fetch(`${getBasePath()}/api/public/projects/${slug}`);
    if (!response.ok) return;
    const payload = await response.json();
    if (payload?.data) {
      renderProjectDetail(payload.data);
    }
  } catch (_error) {
    // Keep fallback static HTML when API fails.
  }
}

initPopupPreview();
loadProjectDetail();
