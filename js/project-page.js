const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupClose = document.getElementById("popupClose");

document.querySelectorAll(".product-thumbnail").forEach((img, index) => {

  img.dataset.thumbId = `thumb-${index}`;

  img.addEventListener("click", () => {
    const rect = img.getBoundingClientRect();
    const clone = img.cloneNode();
    clone.classList.remove("product-thumbnail");

    // Set starting position
    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.objectFit = "contain";
    clone.style.objectPosition = "center";
    clone.style.zIndex = "9999";
    clone.style.borderRadius = "20px";
    clone.style.transition = "all 0.5s ease-in-out";

    document.body.appendChild(clone);

    requestAnimationFrame(() => { d
      clone.style.left = "50%";
      clone.style.top = "50%";
      clone.style.transform = "translate(-50%, -50%)";
      clone.style.maxWidth = "95%";
      clone.style.maxHeight = "95%";
      clone.style.width = "95%";
      clone.style.height = "95%";
    });

    // Show background after slight delay to keep transition smooth
    setTimeout(() => {
      clone.dataset.sourceId = img.dataset.thumbId;
      popup.style.display = "flex";
      popup.appendChild(clone);
      clone.classList.add("popup-img");
    }, 600);
  });
});

// Close logic
function closePopup() {
  const popupImage = popup.querySelector(".popup-img");
  if (!popupImage) return;
  const sourceId = popupImage.dataset.sourceId;
  const rect = popupImage.getBoundingClientRect();
  const originalImg = document.querySelector(`.product-thumbnail[data-thumb-id="${sourceId}"]`);
  const originalImgRect = originalImg.getBoundingClientRect();
  const clone = popupImage.cloneNode();

  document.body.appendChild(clone);
  popup.style.display = "none";
  clone.style.transform = "none";
  clone.classList.remove("popup-img");
  clone.style.position = "fixed";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.objectFit = "contain";
  clone.style.objectPosition = "center";
  clone.style.zIndex = "9999";
  clone.style.borderRadius = "20px";
  clone.style.transition = "all 0.5s ease-in-out";

  requestAnimationFrame(() => {
    clone.style.left = `${originalImgRect.left}px`;
    clone.style.top = `${originalImgRect.top}px`;
    clone.style.width = `${originalImgRect.width}px`;
    clone.style.height = `${originalImgRect.height}px`;
    clone.style.objectFit = "contain";
  });

  popupImage.remove();
  setTimeout(() => {
    clone.style.opacity = 0;
  }, 500);

  setTimeout(() => {
    document.body.removeChild(clone);
  }, 600);
}

popupClose.addEventListener("click", closePopup);
popup.addEventListener("click", e => {
  if (e.target === popup) {
    closePopup();
  }
});
