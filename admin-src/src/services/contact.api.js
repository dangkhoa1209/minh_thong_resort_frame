import { http } from "./http";

async function getContacts(params) {
  const response = await http.get("/admin/contacts", { params });
  return response.data;
}

async function updateContactStatus(id, status) {
  const response = await http.patch(`/admin/contacts/${id}/status`, { status });
  return response.data;
}

export { getContacts, updateContactStatus };
