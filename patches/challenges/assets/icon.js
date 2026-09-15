// Subida del icono de un reto desde el panel de admin.
// Sube la imagen como archivo estándar y escribe la ruta en el input `icon`.
(function () {
  if (window.__challengeIconUploadBound) return;
  window.__challengeIconUploadBound = true;

  const MAX_BYTES = 2 * 1024 * 1024;

  document.addEventListener("change", async function (event) {
    const input = event.target;
    if (!input.matches("[data-challenge-icon-upload]") || !input.files.length) return;

    const CTFd = window.CTFd;
    const wrapper = input.closest("[data-challenge-icon]");
    const target = wrapper.querySelector("input[name='icon']");
    const preview = wrapper.querySelector("[data-icon-preview]");
    const file = input.files[0];

    if (file.size > MAX_BYTES) {
      preview.innerHTML = '<span class="text-danger">Image must be smaller than 2 MB</span>';
      input.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "standard");
    formData.append("nonce", CTFd.config.csrfNonce);

    const response = await fetch(CTFd.config.urlRoot + "/api/v1/files", {
      method: "POST",
      credentials: "same-origin",
      headers: { "CSRF-Token": CTFd.config.csrfNonce },
      body: formData,
    });
    const body = await response.json();

    if (body.success) {
      const icon = CTFd.config.urlRoot + "/files/" + body.data[0].location;
      target.value = icon;
      preview.innerHTML = '<img src="' + icon + '" alt="" style="max-height: 64px;">';
    } else {
      preview.innerHTML = '<span class="text-danger">Upload failed</span>';
    }
    input.value = "";
  });
})();
