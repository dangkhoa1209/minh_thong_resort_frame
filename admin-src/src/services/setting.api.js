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

export { getLogo, updateLogo, getContact, updateContact };
