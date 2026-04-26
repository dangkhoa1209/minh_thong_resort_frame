import { http } from "./http";

async function getUsers(params) {
  const response = await http.get("/admin/auth/users", { params });
  return response.data;
}

async function createUser(payload) {
  const response = await http.post("/admin/auth/users", payload);
  return response.data;
}

async function updateUser(id, payload) {
  const response = await http.patch(`/admin/auth/users/${id}`, payload);
  return response.data;
}

export { getUsers, createUser, updateUser };
