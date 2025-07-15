// ************** CLICK BACK HOME **************

const barbaGoHeader = window.barbaGo || null;

const logos = document.querySelectorAll('.logo')



logos?.forEach(logo => {
  logo.addEventListener('click', () => {


    window.location.href = '/';
    
    // if (barbaGoHeader) {
    //  barbaGoHeader('/');
    // } else {
    //   window.location.href = '/';
    // }
  });
});
