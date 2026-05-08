loadComponent('../components/header/index.html', 'place-header', 'dark')
loadComponent('../components/footer/index.html', 'place-footer')

async function fetchPublicContactInfo() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/public/settings/contact`);
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch (_error) {
    return null;
  }
}

async function applyCollabContactEmail() {
  const emailLink = document.getElementById("collab-contact-email");
  if (!emailLink) return;

  const contact = await fetchPublicContactInfo();
  const email = String(contact?.email || "").trim();
  if (!email) return;

  emailLink.href = `mailto:${email}`;
  emailLink.textContent = email;
}

async function fetchPublicCollaborationImages() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/public/collaboration-images`);
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch (_error) {
    return null;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyInlineFormatting(text) {
  let formatted = escapeHtml(text);
  formatted = formatted.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    '<a href="$2" class="font-bold" style="color: inherit; text-decoration: none;">$1</a>'
  );
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return formatted;
}

function renderRichContent(content) {
  const lines = String(content || "").split(/\r?\n/);
  const blocks = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      `<ul class="ul">${listBuffer
        .map((item) => `<li><p class="content">${applyInlineFormatting(item)}</p></li>`)
        .join("")}</ul>`
    );
    listBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = String(rawLine || "").trim();
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2).trim());
      return;
    }

    flushList();
    blocks.push(`<p class="content">${applyInlineFormatting(line)}</p>`);
  });

  flushList();
  return blocks.join("");
}

function applyCollaborationContent(data) {
  if (!data || typeof data !== "object") return;

  const titleElement = document.getElementById("collab-title");
  const subtitleElement = document.getElementById("collab-subtitle");
  const contentElement = document.getElementById("collab-content");

  const title = String(data.title || "").trim();
  const subtitle = String(data.subtitle || "").trim();
  const content = String(data.content || "").trim();

  if (titleElement && title) titleElement.textContent = title;
  if (subtitleElement && subtitle) subtitleElement.textContent = subtitle;
  if (contentElement && content) contentElement.innerHTML = renderRichContent(content);
}

async function applyCollaborationImages() {
  const collaborationData = await fetchPublicCollaborationImages();
  if (!collaborationData) return;

  applyCollaborationContent(collaborationData);

  const images = Array.isArray(collaborationData.images) ? collaborationData.images : [];
  if (images.length === 0) return;

  document.querySelectorAll("[data-collaboration-image]").forEach((image) => {
    const index = Number(image.getAttribute("data-collaboration-image")) - 1;
    const url = String(images[index] || "").trim();
    if (!url) return;
    image.src = getAssetUrl(url);
  });
}

applyCollabContactEmail();
applyCollaborationImages();
