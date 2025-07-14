// ************** CLICK BACK HOME **************

const barbaGoHeader = window.barbaGo || null;

const logos = document.querySelectorAll('.logo')

console.log('logos', logos);


logos?.forEach(logo => {
  logo.addEventListener('click', () => {


    console.log('sdfsadfs');
    
    if (barbaGoHeader) {
     barbaGoHeader('/');
    } else {
      window.location.href = '/';
    }
  });
});
