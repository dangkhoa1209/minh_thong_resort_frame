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

async function getHomePartners() {
  const response = await http.get("/admin/settings/home-partners");
  return response.data;
}

async function updateHomePartners(payload) {
  const response = await http.put("/admin/settings/home-partners", payload);
  return response.data;
}

async function getPublicHomePartners() {
  const response = await http.get("/public/settings/home-partners");
  return response.data;
}

async function getCollaborationImages() {
  const response = await http.get("/admin/collaboration-images");
  return response.data;
}

async function updateCollaborationImages(payload) {
  const response = await http.put("/admin/collaboration-images", payload);
  return response.data;
}

async function getPublicCollaborationImages() {
  const response = await http.get("/public/collaboration-images");
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
  getHomePartners,
  updateHomePartners,
  getPublicHomePartners,
  getCollaborationImages,
  updateCollaborationImages,
  getPublicCollaborationImages,
};
