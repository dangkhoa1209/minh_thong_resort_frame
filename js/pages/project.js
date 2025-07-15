loadComponent('/components/header/index.html', 'place-header')
loadComponent('/components/footer/index.html', 'place-footer')
loadComponent('/components/slide-project/index.html', 'place-slide-project')


// === CẤU HÌNH MỞ ẢNH PHÓNG TO TỪ THUMBNAIL ===
const popup = document.getElementById("popup");          // Phần tử popup (dùng để hiển thị ảnh lớn)
const popupClose = document.getElementById("popupClose"); // Nút đóng popup (sẽ được gán lại động sau)

// Lặp qua từng thumbnail có class "product-thumbnail"
document.querySelectorAll(".product-thumbnail").forEach((img, index) => {
  img.dataset.thumbId = `thumb-${index}`; // Gán ID riêng cho mỗi ảnh để tracking

  img.addEventListener("click", () => {
    const rect = img.getBoundingClientRect();  // Lấy vị trí/size hiện tại của ảnh thumbnail
    const clone = img.cloneNode();             // Clone ảnh để tạo hiệu ứng
    clone.classList.remove("product-thumbnail"); // Gỡ class thumbnail khỏi bản clone

    // Tính tỉ lệ khung ảnh gốc (dựa trên kích thước thật)
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const aspectRatio = naturalW / naturalH;

    // Tính kích thước tối đa ảnh sẽ phóng (chiếm 95% màn hình)
    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.95;

    let targetW = maxW;
    let targetH = maxW / aspectRatio;

    // Nếu ảnh vượt chiều cao, scale lại theo chiều cao
    if (targetH > maxH) {
      targetH = maxH;
      targetW = maxH * aspectRatio;
    }

    // Tính vị trí để căn giữa popup
    const targetLeft = (window.innerWidth - targetW) / 2;
    const targetTop = (window.innerHeight - targetH) / 2;

    // Gán style ban đầu cho ảnh clone (nằm đúng vị trí ảnh gốc)
    Object.assign(clone.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      objectFit: "contain",      // hoặc cover tùy ý
      objectPosition: "center",
      zIndex: "9999",
      borderRadius: "20px",
      transformOrigin: "top left",
      transform: "scale(1)",
      transition: "all 0.5s ease-in-out"
    });

    document.body.appendChild(clone); // Thêm vào DOM
    void clone.offsetWidth;           // Force reflow (đảm bảo animation chạy)

    // Bắt đầu animation chuyển về vị trí chính giữa + scale lên
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

    // Sau khi chuyển động hoàn tất (500ms), hiển thị vào popup
    setTimeout(() => {
      clone.dataset.sourceId = img.dataset.thumbId;
      clone.classList.add("popup-img");

      // Gán lại nội dung popup, thêm nút close
      popup.innerHTML = '<span class="popup-close" id="popupClose">✕</span>';
      popup.appendChild(clone);
      popup.style.display = "flex";

      // Gắn sự kiện đóng popup
      document.getElementById("popupClose").addEventListener("click", closePopup);
    }, 500);
  });
});


// === ĐÓNG POPUP VÀ ANIMATION THU NHỎ VỀ ẢNH GỐC ===
function closePopup() {
  const popupImg = popup.querySelector(".popup-img");  // Ảnh lớn đang hiển thị
  if (!popupImg) return;

  const sourceId = popupImg.dataset.sourceId;
  const original = document.querySelector(`.product-thumbnail[data-thumb-id="${sourceId}"]`);
  if (!original) return;

  const toRect = original.getBoundingClientRect();     // Vị trí thumbnail
  const fromRect = popupImg.getBoundingClientRect();   // Vị trí ảnh lớn

  // Tính tỉ lệ scale ngược về thumbnail
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.min(scaleX, scaleY);              // Scale đồng đều theo chiều nhỏ hơn

  const targetLeft = toRect.left;
  const targetTop = toRect.top;

  // Clone lại ảnh lớn để thực hiện animation
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
    transformOrigin: "top left",
    transform: "scale(1)",
    transition: "all 0.5s ease-in-out"
  });

  document.body.appendChild(clone);
  popup.style.display = "none";
  popup.innerHTML = ""; // Clear nội dung popup

  // Force reflow để chuẩn bị cho animation
  void clone.offsetWidth;

  // Animate thu nhỏ lại về vị trí ảnh thumbnail
  Object.assign(clone.style, {
    left: `${targetLeft}px`,
    top: `${targetTop}px`,
    transform: `scale(${scale})`,
    borderRadius: "20px"
  });

  // Xóa ảnh clone sau animation
  setTimeout(() => {
    clone.remove();
  }, 500);
}


// === ĐÓNG POPUP KHI CLICK NỀN ĐEN ===
popup.addEventListener("click", e => {
  if (e.target === popup) closePopup();
});



