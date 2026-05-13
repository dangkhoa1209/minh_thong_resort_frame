import { http } from "./http";

function getUploadErrorMessage(error) {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.error?.message;

  if (status === 413) {
    return serverMessage || "File qua lon. Server/nginx dang gioi han kich thuoc upload.";
  }
  if (status === 422 && serverMessage) {
    return serverMessage;
  }
  if (!error?.response) {
    return "Upload that bai. File co the qua lon (413) hoac server chua cau hinh CORS/upload limit.";
  }
  return serverMessage || error?.message || "Upload failed";
}

async function uploadProjectImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await http.post("/admin/media/upload-project", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export { getUploadErrorMessage, uploadProjectImage };
