const popup = document.getElementById("popup");
const popupClose = document.getElementById("popupClose");

document.querySelectorAll(".product-thumbnail").forEach((img, index) => {
  img.dataset.thumbId = `thumb-${index}`;

  img.addEventListener("click", () => {
    const rect = img.getBoundingClientRect();
    const clone = img.cloneNode();
    clone.classList.remove("product-thumbnail");

    // Lấy tỉ lệ gốc ảnh
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const aspectRatio = naturalW / naturalH;

    // Tính kích thước max khớp màn hình theo 95vw / 95vh
    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.95;

    let targetW = maxW;
    let targetH = maxW / aspectRatio;

    if (targetH > maxH) {
      targetH = maxH;
      targetW = maxH * aspectRatio;
    }

    // Center to screen
    const targetLeft = (window.innerWidth - targetW) / 2;
    const targetTop = (window.innerHeight - targetH) / 2;

    // Initial thumbnail clone
    Object.assign(clone.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      objectFit: "contain", //contain cover
      objectPosition: "center",
      zIndex: "9999",
      borderRadius: "20px",
      transformOrigin: "top left",
      transform: "scale(1)",
      transition: "all 0.5s ease-in-out"
    });

    document.body.appendChild(clone);
    void clone.offsetWidth;

    // Animate to calculated full size
    requestAnimationFrame(() => {
      Object.assign(clone.style, {
        left: `${targetLeft}px`,
        top: `${targetTop}px`,
        width: `${targetW}px`,
        height: `${targetH}px`,
        transform: "scale(1)",
        borderRadius: "0px"
      });
    });

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

  const toRect = original.getBoundingClientRect();   // vị trí thumbnail
  const fromRect = popupImg.getBoundingClientRect(); // vị trí ảnh đang mở

  // Tính toán scale
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.min(scaleX, scaleY);

  // Tính lại vị trí để canh giữa ảnh thu nhỏ
  const targetLeft = toRect.left;
  const targetTop = toRect.top;

  // Clone ảnh hiện tại
  const clone = popupImg.cloneNode();
  clone.classList.remove("popup-img");

  Object.assign(clone.style, {
    position: "fixed",
    left: `${fromRect.left}px`,
    top: `${fromRect.top}px`,
    width: `${fromRect.width}px`,
    height: `${fromRect.height}px`,
    objectFit: "cover",
    zIndex: "9999",
    borderRadius: "0px",
    transformOrigin: "top left", // Để transform không lệch
    transform: "scale(1)",
    transition: "all 0.5s ease-in-out"
  });

  document.body.appendChild(clone);
  popup.style.display = "none";
  popup.innerHTML = "";

  // Force repaint
  void clone.offsetWidth;

  // Animate về vị trí thumbnail + scale lại
  Object.assign(clone.style, {
    left: `${targetLeft}px`,
    top: `${targetTop}px`,
    transform: `scale(${scale})`,
    borderRadius: "20px"
  });

  setTimeout(() => {
    clone.remove();
  }, 500);
}


popup.addEventListener("click", e => {
  if (e.target === popup) closePopup();
});
