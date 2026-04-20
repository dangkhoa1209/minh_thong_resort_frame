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

async function updateProjectDisplay(id, payload) {
  const response = await http.patch(`/admin/projects/${id}/display`, payload);
  return response.data;
}

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectDisplay,
};
