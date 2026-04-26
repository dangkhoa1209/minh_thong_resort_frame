import { http } from "./http";

async function login(payload) {
  const response = await http.post("/admin/auth/login", payload);
  return response.data;
}

async function getMe() {
  const response = await http.get("/admin/auth/me");
  return response.data;
}

async function changePassword(payload) {
  const response = await http.post("/admin/auth/change-password", payload);
  return response.data;
}

export { login, getMe, changePassword };
