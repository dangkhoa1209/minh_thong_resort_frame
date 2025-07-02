const popup = document.getElementById("popup");
const popupClose = document.getElementById("popupClose");

document.querySelectorAll(".product-thumbnail").forEach((img, index) => {
  img.dataset.thumbId = `thumb-${index}`;

  img.addEventListener("click", () => {
    const rect = img.getBoundingClientRect();
    const clone = img.cloneNode();
    clone.classList.remove("product-thumbnail");

    // Setup initial style for zoom-in
    Object.assign(clone.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      objectFit: "cover",
      objectPosition: "center",
      zIndex: "9999",
      borderRadius: "20px",
      transition: "all 0.5s ease-in-out",
      transform: "none"
    });

    document.body.appendChild(clone);

    // Animate to center
    requestAnimationFrame(() => {
      Object.assign(clone.style, {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "95vw",
        height: "95vh",
        objectFit: "contain"
      });
    });

    // After animation complete, move to popup
    setTimeout(() => {
      clone.dataset.sourceId = img.dataset.thumbId;
      clone.classList.add("popup-img");

      popup.innerHTML = '<span class="popup-close" id="popupClose">✕</span>';
      popup.appendChild(clone);
      popup.style.display = "flex";

      document.getElementById("popupClose").addEventListener("click", closePopup);
    }, 500);
  });
});

function closePopup() {
  const popupImg = popup.querySelector(".popup-img");
  if (!popupImg) return;

  const sourceId = popupImg.dataset.sourceId;
  const original = document.querySelector(`.product-thumbnail[data-thumb-id="${sourceId}"]`);
  if (!original) return;

  const fromRect = popupImg.getBoundingClientRect();
  const toRect = original.getBoundingClientRect();

  const clone = popupImg.cloneNode();
  clone.classList.remove("popup-img");

  // Reset transform (no translate), then start from current position
  Object.assign(clone.style, {
    position: "fixed",
    left: `${fromRect.left}px`,
    top: `${fromRect.top}px`,
    width: `${fromRect.width}px`,
    height: `${fromRect.height}px`,
    objectFit: "contain",
    objectPosition: "center",
    zIndex: "9999",
    borderRadius: "20px",
    transform: "none",
    transition: "all 0.4s ease-in-out"
  });

  popup.style.display = "none";
  popup.innerHTML = "";

  document.body.appendChild(clone);

  // Animate to original thumbnail
  requestAnimationFrame(() => {
    Object.assign(clone.style, {
      left: `${toRect.left}px`,
      top: `${toRect.top}px`,
      width: `${toRect.width}px`,
      height: `${toRect.height}px`,
      objectFit: "cover",
      transform: "none"
    });
  });

  // Remove clone after animation
  setTimeout(() => {
    clone.remove();
  }, 400);
}

popup.addEventListener("click", e => {
  if (e.target === popup) closePopup();
});
