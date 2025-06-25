
const cardsEffect = window.cardsEffect || {};

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
    // const thumbnail = item.querySelector('.product-thumbnail');
    const popup = item.querySelector('.product-popup');
    const closeBtn = item.querySelector('.close-btn');

    item.addEventListener('click', () => {
      const rect = item.getBoundingClientRect();
      

      // Đặt popup theo vị trí gốc của item
      popup.style.top = rect.top + 'px';
      popup.style.left = rect.left + 'px';
      popup.style.width = rect.width + 'px';
      popup.style.height = rect.height + 'px';
      popup.style.position = 'fixed';
        
       transition: ;
    //   popup.style.transform = 'scale(0.8)';

      // Bắt buộc render lần đầu
      requestAnimationFrame(() => {
         popup.style.transition = 'all 0.4s ease-in-out';
        popup.classList.add('product-item-active');
        popup.style.transform = 'scale(1)';
      });
    // setTimeout(() => {
    //     popup.style.transition = 'all 0.4s ease-in-out';
    //     popup.classList.add('product-item-active');
    //     // popup.style.transform = 'scale(1)';
    // }, 200)

      document.body.style.overflow = 'hidden';
    });

   closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation()
      const rect = item.getBoundingClientRect();

      console.log('popup', popup);
      
    
      popup.classList.remove('product-item-active');
      popup.style.top = rect.top + 'px';
      popup.style.left = rect.left + 'px';
      popup.style.width = rect.width + 'px';
      popup.style.height = rect.height + 'px';
    //   popup.style.transform = 'scale(0.8)';

      document.body.style.overflow = 'auto';

      setTimeout(() => {
        popup.removeAttribute('style');
      }, 400);
    });
  });