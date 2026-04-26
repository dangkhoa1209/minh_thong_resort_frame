loadComponent("../components/header/index.html", "place-header", "dark");
loadComponent("../components/footer/index.html", "place-footer");

function normalizePhoneForTel(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) {
    return `+${raw.slice(1).replace(/[^\d]/g, "")}`;
  }
  return raw.replace(/[^\d]/g, "");
}

function buildGoogleMapLink(address) {
  const raw = String(address || "").trim();
  if (!raw) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
}

async function fetchPublicContactInfo() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/public/settings/contact`);
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch (_error) {
    return null;
  }
}

function applyContactInfo(contact) {
  if (!contact) return;

  const email = String(contact.email || "").trim();
  const phone = String(contact.phone || "").trim();
  const address = String(contact.address || "").trim();

  const emailIconLink = document.getElementById("contact-email-icon-link");
  const emailTextLink = document.getElementById("contact-email-text-link");
  const phoneIconLink = document.getElementById("contact-phone-icon-link");
  const phoneTextLink = document.getElementById("contact-phone-text-link");
  const addressIconLink = document.getElementById("contact-address-link");
  const addressTextLink = document.getElementById("contact-address-text");

  if (email) {
    const mailHref = `mailto:${email}`;
    if (emailIconLink) emailIconLink.href = mailHref;
    if (emailTextLink) {
      emailTextLink.href = mailHref;
      emailTextLink.textContent = email;
    }
  }

  if (phone) {
    const tel = normalizePhoneForTel(phone);
    const telHref = tel ? `tel:${tel}` : "";
    if (phoneIconLink && telHref) phoneIconLink.href = telHref;
    if (phoneTextLink) {
      if (telHref) phoneTextLink.href = telHref;
      phoneTextLink.textContent = phone;
    }
  }

  if (address) {
    const mapHref = buildGoogleMapLink(address);
    if (addressIconLink && mapHref) addressIconLink.href = mapHref;
    if (addressTextLink) {
      if (mapHref) addressTextLink.href = mapHref;
      addressTextLink.textContent = address;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  const contact = await fetchPublicContactInfo();
  applyContactInfo(contact);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("contact-form-name");
    const email = document.getElementById("contact-form-email");
    const description = document.getElementById("contact-form-description");

    const data = {
      name: name.value,
      email: email.value,
      description: description.value,
      source: "contact_page",
    };

    status.textContent = "Sending...";
    status.style.color = "#888";
    status.classList.add("active");

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/mail/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      status.textContent = "Thank you! Your message has been sent.";
      status.style.color = "green";
      form.reset();
    } catch (_error) {
      status.textContent = "Failed to send. Please try again.";
      status.style.color = "red";
    }
  });
});
