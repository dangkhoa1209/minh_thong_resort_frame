import { http } from "./http";

async function getHomeHighlights(params) {
  const response = await http.get("/admin/home-highlights", { params });
  return response.data;
}

async function getHomeHighlight(id) {
  const response = await http.get(`/admin/home-highlights/${id}`);
  return response.data;
}

async function createHomeHighlight(payload) {
  const response = await http.post("/admin/home-highlights", payload);
  return response.data;
}

async function updateHomeHighlight(id, payload) {
  const response = await http.put(`/admin/home-highlights/${id}`, payload);
  return response.data;
}

async function deleteHomeHighlight(id) {
  const response = await http.delete(`/admin/home-highlights/${id}`);
  return response.data;
}

async function getHeroSlides(params) {
  const response = await http.get("/admin/hero-slides", { params });
  return response.data;
}

async function getHeroSlide(id) {
  const response = await http.get(`/admin/hero-slides/${id}`);
  return response.data;
}

async function createHeroSlide(payload) {
  const response = await http.post("/admin/hero-slides", payload);
  return response.data;
}

async function updateHeroSlide(id, payload) {
  const response = await http.put(`/admin/hero-slides/${id}`, payload);
  return response.data;
}

async function deleteHeroSlide(id) {
  const response = await http.delete(`/admin/hero-slides/${id}`);
  return response.data;
}

export {
  getHomeHighlights,
  getHomeHighlight,
  createHomeHighlight,
  updateHomeHighlight,
  deleteHomeHighlight,
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
