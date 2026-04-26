import { http } from "./http";

async function getDashboardSummary() {
  const response = await http.get("/admin/dashboard/summary");
  return response.data;
}

export { getDashboardSummary };
