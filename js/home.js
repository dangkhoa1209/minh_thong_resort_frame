
// baner
let text = document.getElementById('text');
let leaf = document.getElementById('leaf');
let hill1 = document.getElementById('hill1');
let hill4 = document.getElementById('hill4');
let hill5 = document.getElementById('hill5');

window.addEventListener('scroll', function () {
    let value = window.scrollY;
    text.style.marginTop = value * 2.5 + 'px';
    leaf.style.top = value * -1.5 + 'px';
    leaf.style.left = value * 1.5 + 'px';
    hill5.style.left = value * 1.5 + 'px';
    hill4.style.left = value * -1.5 + 'px';
    hill1.style.top = value * 1 + 'px';
});

// products
const cardsEffect = window.cardsEffect || {};
const productsContainer = document.querySelector('.products');
const products = document.querySelectorAll('.product')
productsContainer.style.setProperty('--products-count', products.length)
productsContainer.style.setProperty(
    '--product-height',
    `${products[0].clientHeight}px`
)

Array.from(products).forEach((product, index) => {
    const offsetTop = 0 
    product.style.paddingTop = `${offsetTop}px`
    if (index === products.length - 1) {
        return
    }
    const toScale = 0.75
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




barba.init({
  transitions: [
    {
      name: 'instant',
      leave() {
        return Promise.resolve(); // không delay
      },
      enter() {
        return Promise.resolve(); // không delay
      }
    }
  ]
});

const items = document.querySelectorAll('.product');

items.forEach(item => {
  const popup = item.querySelector('.product__inner');

  item.addEventListener('click', (e) => {
    e.stopPropagation()
    const rect = item.getBoundingClientRect();
        document.body.style.overflow = 'hidden';


    // Thiết lập vị trí ban đầu cho popup (từ vị trí item)
    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.width = rect.width + 'px';
    popup.style.height = rect.height + 'px';
    popup.style.zIndex = 9999;
    item.style.zIndex = '1000';
    popup.style.position = 'fixed';

    // Render phóng to
    requestAnimationFrame(() => {
        popup.style.transition = 'all 0.8s ease-in-out';
      popup.classList.add('product-item-active');
      popup.style.top = '0';
      popup.style.left = '0';
      popup.style.width = '100vw';
      popup.style.height = '100vh';
      popup.style.borderRadius = '0px';

      setTimeout(() => {
       barba.go('/pages/four-seasons-resort-the-nam-hai.html');
    }, 1000);
    });
   
  });
});






