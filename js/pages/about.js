loadComponent('../components/header/index.html', 'place-header')
loadComponent('../components/footer/index.html', 'place-footer')

document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".production__block");

  function adjustHeights() {
    blocks.forEach(block => {
      const image = block.querySelector(".production__image");
      const text = block.querySelector(".production__text");

      if (image && text) {
        const imageHeight = image.offsetHeight;
         text.style.minHeight = imageHeight + "px";
      }
    });
  }

  // Gọi khi load và khi resize
  adjustHeights();
  window.addEventListener("resize", adjustHeights);
});
