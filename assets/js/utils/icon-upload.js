// Sube una imagen como multipart a un endpoint de la API y devuelve el JSON.
import CTFd from "../index";

export async function uploadIcon(endpoint, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nonce", CTFd.config.csrfNonce);

  const response = await fetch(CTFd.config.urlRoot + endpoint, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "CSRF-Token": CTFd.config.csrfNonce,
    },
    body: formData,
  });
  return response.json();
}

export async function removeIcon(endpoint) {
  const response = await CTFd.fetch(endpoint, { method: "DELETE" });
  return response.json();
}
