import { http } from "./http";

async function uploadProjectImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await http.post("/admin/media/upload-project", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export { uploadProjectImage };
