const barbaGo = window.barbaGo || null;

const logos = document.querySelectorAll('.logo')

console.log('logos', logos);

logos?.forEach(logo => {
  logo.addEventListener('click', () => {
    
    if (barbaGo) {
     barbaGo('/');
    } else {
      window.location.href = '/';
    }
  });
});
