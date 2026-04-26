import { http } from "./http";

async function getLogo() {
  const response = await http.get("/admin/settings/logo");
  return response.data;
}

async function updateLogo(payload) {
  const response = await http.put("/admin/settings/logo", payload);
  return response.data;
}

async function getContact() {
  const response = await http.get("/admin/settings/contact");
  return response.data;
}

async function updateContact(payload) {
  const response = await http.put("/admin/settings/contact", payload);
  return response.data;
}

async function getPublicContact() {
  const response = await http.get("/public/settings/contact");
  return response.data;
}

async function getPublicLogo() {
  const response = await http.get("/public/settings/logo");
  return response.data;
}

async function getHomeBanner() {
  const response = await http.get("/admin/settings/home-banner");
  return response.data;
}

async function updateHomeBanner(payload) {
  const response = await http.put("/admin/settings/home-banner", payload);
  return response.data;
}

async function getPublicHomeBanner() {
  const response = await http.get("/public/settings/home-banner");
  return response.data;
}

export {
  getLogo,
  updateLogo,
  getContact,
  updateContact,
  getPublicContact,
  getPublicLogo,
  getHomeBanner,
  updateHomeBanner,
  getPublicHomeBanner,
};
