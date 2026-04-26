let arrow = document.querySelector(".footer-arrow");
let input = document.querySelector(".footer-input");
let statusField = document.getElementById("footer-form-status");

function normalizePhoneForTel(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) {
    return `+${raw.slice(1).replace(/[^\d]/g, "")}`;
  }
  return raw.replace(/[^\d]/g, "");
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

function applyFooterContactInfo(contact) {
  if (!contact) return;

  const addressNode = document.getElementById("footer-address-text");
  const emailLink = document.getElementById("footer-email-link");
  const phoneLink = document.getElementById("footer-phone-link");
  const facebookLink = document.getElementById("footer-facebook-link");
  const instagramLink = document.getElementById("footer-instagram-link");

  const address = String(contact.address || "").trim();
  const email = String(contact.email || "").trim();
  const phone = String(contact.phone || "").trim();
  const facebook = String(contact.facebook || "").trim();
  const instagram = String(contact.instagram || "").trim();

  if (addressNode && address) {
    addressNode.textContent = address;
  }
  if (emailLink && email) {
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
  }
  if (phoneLink && phone) {
    phoneLink.textContent = phone;
    const tel = normalizePhoneForTel(phone);
    if (tel) {
      phoneLink.href = `tel:${tel}`;
    }
  }
  if (facebookLink && facebook) {
    facebookLink.href = facebook;
  }
  if (instagramLink && instagram) {
    instagramLink.href = instagram;
  }
}

async function submitFooterContact() {
  const email = input.value.trim();
  statusField.textContent = "Sending...";
  statusField.style.color = "#888";
  statusField.classList.add("active");

  if (!email) {
    statusField.textContent = "Please enter a valid email.";
    statusField.style.color = "red";
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/mail/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    statusField.textContent = "Thank you! Your email has been sent.";
    statusField.style.color = "green";
    input.value = "";
  } catch (_error) {
    statusField.textContent = "Failed to send. Please try again.";
    statusField.style.color = "red";
  }
}

async function start() {
  const contactInfo = await fetchPublicContactInfo();
  applyFooterContactInfo(contactInfo);

  arrow.addEventListener("click", submitFooterContact);
}

if (!arrow || !input || !statusField) {
  setTimeout(() => {
    arrow = document.querySelector(".footer-arrow");
    input = document.querySelector(".footer-input");
    statusField = document.getElementById("footer-form-status");
    if (!arrow || !input || !statusField) {
      return;
    }
    start();
  }, 500);
} else {
  start();
}
