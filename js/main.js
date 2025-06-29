
const cardsEffect = window.cardsEffect || {};

let text = document.getElementById('text');
let leaf = document.getElementById('leaf');
let hill1 = document.getElementById('hill1');
let hill4 = document.getElementById('hill4');
let hill5 = document.getElementById('hill5');

window.addEventListener('scroll', function () {
    let value = window.scrollY;
    text?.style.marginTop = value * 2.5 + 'px';
    leaf?.style.top = value * -1.5 + 'px';
    leaf?.style.left = value * 1.5 + 'px';
    hill5?.style.left = value * 1.5 + 'px';
    hill4?.style.left = value * -1.5 + 'px';
    hill1?.style.top = value * 1 + 'px';
});

const productsContainer = document.querySelector('.products');

console.log(productsContainer);

const products = document.querySelectorAll('.product')
productsContainer.style.setProperty('--products-count', products.length)
productsContainer.style.setProperty(
    '--product-height',
    `${products[0].clientHeight}px`
)

Array.from(products).forEach((product, index) => {
    const offsetTop = 20 + index * 20
    product.style.paddingTop = `${offsetTop}px`
    if (index === products.length - 1) {
        return
    }
    const toScale = 1 - (products.length - 1 - index) * 0.05

    console.log('toScale', toScale);
    
    const nextProduct = products[index + 1]
    const productInner = product.querySelector('.product__inner')

    cardsEffect.ScrollObserver.Element(nextProduct, {
        offsetTop,
        offsetBottom: window.innerHeight - product.clientHeight
    }).onScroll(({ percentageY }) => {
        productInner.style.scale = cardsEffect.valueAtPercentage({
            from: 1,
            to: toScale,
            percentage: percentageY
        })
        productInner.style.filter = `brightness(${cardsEffect.valueAtPercentage({
            from: 1,
            to: 0.6,
            percentage: percentageY
        })})`
    })
})  

// Mobile menu toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.navigation');

burger?.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.navigation a');
navLinks?.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
    });
});  



const items = document.querySelectorAll('.product-item');

items.forEach(item => {
  const popup = item.querySelector('.product-popup');

  item.addEventListener('click', () => {
    const rect = item.getBoundingClientRect();

    // Thiết lập vị trí ban đầu cho popup (từ vị trí item)
    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.width = rect.width + 'px';
    popup.style.height = rect.height + 'px';
    popup.style.position = 'fixed';

    // Render phóng to
    requestAnimationFrame(() => {
        popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('product-item-active');
      popup.style.top = '0';
      popup.style.left = '0';
      popup.style.width = '100vw';
      popup.style.height = '100vh';
    });

    // Giả lập "render nội dung chi tiết" sau 400ms
    setTimeout(() => {
      // Nếu chưa có close-btn thì render nội dung chi tiết
      if (!popup.querySelector('.close-btn')) {
        popup.insertAdjacentHTML('beforeend', `
          <button class="close-btn">X</button>
          <div class="popup-content">
            <p><b>Chi tiết nè</b></p>
            <img src="https://picsum.photos/522/693?random=11" />
            <img src="https://picsum.photos/522/693?random=12" />
          </div>
        `);

        // Gán sự kiện đóng sau khi render nút X
        const closeBtn = popup.querySelector('.close-btn');
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closePopup(item, popup);
        });
      }

      // Cho scroll sau khi render xong nội dung
      popup.style.overflowY = 'auto';

    }, 400);

    document.body.style.overflow = 'hidden';
  });
});

function closePopup(item, popup) {
  const rect = item.getBoundingClientRect();

  popup.classList.remove('product-item-active');
  popup.style.transition = 'all 0.4s ease-in-out';
  popup.style.top = rect.top + 'px';
  popup.style.left = rect.left + 'px';
  popup.style.width = rect.width + 'px';
  popup.style.height = rect.height + 'px';
  popup.style.overflow = 'hidden';

  document.body.style.overflow = 'auto';

  setTimeout(() => {
    // Reset lại nội dung (chỉ giữ ảnh preview nếu muốn)
    popup.innerHTML = `<img src="https://picsum.photos/522/693?random=1" class="preview-image">`;
    popup.removeAttribute('style');
  }, 400);
}
