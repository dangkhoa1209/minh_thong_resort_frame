import { http } from "./http";

async function getProjects(params) {
  const response = await http.get("/admin/projects", { params });
  return response.data;
}

async function getProject(id) {
  const response = await http.get(`/admin/projects/${id}`);
  return response.data;
}

async function createProject(payload) {
  const response = await http.post("/admin/projects", payload);
  return response.data;
}

async function updateProject(id, payload) {
  const response = await http.put(`/admin/projects/${id}`, payload);
  return response.data;
}

async function updateProjectActive(id, isActive) {
  const response = await http.patch(`/admin/projects/${id}/active`, { is_active: isActive });
  return response.data;
}

async function deleteProject(id) {
  const response = await http.delete(`/admin/projects/${id}`);
  return response.data;
}

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectActive,
  deleteProject,
};
