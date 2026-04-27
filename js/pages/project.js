loadComponent("../../components/header/index.html", "place-header");
loadComponent("../../components/footer/index.html", "place-footer");
loadComponent("../../components/slide-project/index.html", "place-slide-project");

const popup = document.getElementById("popup");

function getCurrentProjectSlug() {
  const query = new URLSearchParams(window.location.search);
  const slugFromQuery = query.get("project") || query.get("slug");
  if (slugFromQuery) return slugFromQuery;
  const fileName = window.location.pathname.split("/").pop() || "";
  const slugFromFile = fileName.replace(".html", "");
  if (slugFromFile === "project-detail") return "";
  return slugFromFile;
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
  const knownRatios = new Set(["3:4", "4:3", "4:5", "16:9", "855:1068"]);
  if (ratio && /^(\d+):(\d+)$/.test(ratio)) {
    if (!knownRatios.has(ratio)) {
      return "";
    }
    const [w, h] = ratio.split(":");
    return `ratio-${w}-${h}`;
  }
  return layout === 2 ? "ratio-4-3" : "ratio-16-9";
}

function ratioToStyle(layout, ratio) {
  if (ratio && /^(\d+):(\d+)$/.test(ratio)) {
    const [w, h] = ratio.split(":");
    return `aspect-ratio: ${w} / ${h};`;
  }

  return layout === 2 ? "aspect-ratio: 4 / 3;" : "aspect-ratio: 16 / 9;";
}

function bindThumbIds() {
  document.querySelectorAll(".product-thumbnail").forEach((img, index) => {
    img.dataset.thumbId = `thumb-${index}`;
  });
}

function upsertMetaByName(name, content) {
  if (!name || !content) return;
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  if (!property || !content) return;
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
}

function updateProjectSeo(data) {
  const title = [data.title, data.name].filter(Boolean).join(" | ");
  const readableTitle = title || "Resort Project";
  const location = data.location ? ` in ${data.location}` : "";
  const year = data.year ? ` (${data.year})` : "";
  const description = `Project ${readableTitle}${location}${year} by Abel Dang Production, specializing in premium resort and hotel photography.`;
  const canonicalUrl = window.location.href;
  const ogImage = data.banner_image ? getAssetUrl(data.banner_image) : "";

  document.title = `${readableTitle} | Abel Dang Production`;
  upsertMetaByName("description", description);
  upsertMetaByName(
    "keywords",
    `Abel Dang, chụp ảnh resort, chụp ảnh khách sạn, ${readableTitle}, resort photography, hotel photography`
  );
  upsertMetaByProperty("og:title", `${readableTitle} | Abel Dang Production`);
  upsertMetaByProperty("og:description", description);
  upsertMetaByProperty("og:url", canonicalUrl);
  if (ogImage) {
    upsertMetaByProperty("og:image", ogImage);
    upsertMetaByName("twitter:image", ogImage);
  }
  upsertMetaByName("twitter:title", `${readableTitle} | Abel Dang Production`);
  upsertMetaByName("twitter:description", description);
  upsertCanonical(canonicalUrl);

  const schemaNode = document.getElementById("project-schema");
  if (schemaNode) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: readableTitle,
      description,
      url: canonicalUrl,
      creator: {
        "@type": "Organization",
        name: "Abel Dang Production",
      },
      image: ogImage || undefined,
      datePublished: data.year ? String(data.year) : undefined,
      keywords: [
        "Abel Dang",
        "chụp ảnh resort",
        "chụp ảnh khách sạn",
        "resort photography",
        "hotel photography",
      ],
    };
    schemaNode.textContent = JSON.stringify(schema);
  }
}

function updateProjectNotFoundSeo() {
  const title = "Project not found | Abel Dang Production";
  const description = "This project does not exist or is no longer available.";
  document.title = title;
  upsertMetaByName("description", description);
  upsertMetaByProperty("og:title", title);
  upsertMetaByProperty("og:description", description);
  upsertMetaByProperty("og:url", window.location.href);
  upsertMetaByName("twitter:title", title);
  upsertMetaByName("twitter:description", description);
  upsertCanonical(window.location.href);
}

function renderProjectNotFound() {
  updateProjectNotFoundSeo();

  const container = document.querySelector(".container");
  if (!container) return;

  container.innerHTML = `
    <section class="project-not-found px py">
      <div class="project-not-found__inner">
        <p class="project-not-found__eyebrow">404</p>
        <h1>Project not found</h1>
        <p>This project does not exist or is no longer available.</p>
        <a href="/pages/gallery.html">Back to Gallery</a>
      </div>
    </section>
    <div id="place-footer"></div>
  `;

  loadComponent("../../components/footer/index.html", "place-footer");
}

function initBaseProjectSeo() {
  const pageUrl = window.location.href;
  upsertCanonical(pageUrl);
  upsertMetaByProperty("og:url", pageUrl);

  const title = document.title || "Abel Dang Production";
  upsertMetaByProperty("og:title", title);
  upsertMetaByName("twitter:title", title);
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
    bannerImg.src = getAssetUrl(data.banner_image);
  }

  const thinTitle = document.querySelector(".about__title--thin");
  const boldTitle = document.querySelector(".about__title--bold");
  const contentNode = document.querySelector(".about__content p");
  const locationNode = document.querySelector(".about__meta p:first-child .font-thin");
  const yearNode = document.querySelector(".about__meta p:last-child .font-thin");
  const thinTitleText = data.title || data.banner_title || "";
  const boldTitleText = data.name || data.banner_subtitle || "";
  if (thinTitle) thinTitle.textContent = thinTitleText;
  if (boldTitle) boldTitle.textContent = boldTitleText;
  if (locationNode) locationNode.textContent = data.location || "";
  if (yearNode) yearNode.textContent = data.year || "";
  if (contentNode) contentNode.textContent = data.content || "";
  if (bannerImg && (thinTitleText || boldTitleText)) {
    bannerImg.alt = `${thinTitleText} ${boldTitleText}`.trim();
  }
  updateProjectSeo(data);

  const productsContainer = document.querySelector(".products");
  if (!productsContainer) {
    return;
  }

  const imageRows = Array.isArray(data.image_rows) ? data.image_rows : [];
  if (imageRows.length === 0) {
    productsContainer.innerHTML = "";
    return;
  }

  productsContainer.innerHTML = imageRows
    .map((row) => {
      const className = ratioToClass(row.layout, row.ratio);
      const ratioStyle = ratioToStyle(row.layout, row.ratio);
      const images = (row.images || [])
        .map((item) => {
          const url = typeof item === "string" ? item : item.url;
          if (!url) return "";
          return `
            <div class="product-item ${className}" style="${ratioStyle}">
              <img loading="lazy" src="${escapeHtml(getAssetUrl(url))}" class="product-thumbnail" alt="">
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
  if (!slug) {
    renderProjectNotFound();
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/public/projects/${slug}`);
    if (!response.ok) {
      renderProjectNotFound();
      return;
    }
    const payload = await response.json();
    if (payload?.data) {
      renderProjectDetail(payload.data);
      return;
    }
    renderProjectNotFound();
  } catch (_error) {
    renderProjectNotFound();
  }
}

initPopupPreview();
initBaseProjectSeo();
loadProjectDetail();
