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

applyCollabContactEmail();
