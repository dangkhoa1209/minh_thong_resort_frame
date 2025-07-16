// ************** CLICK BACK HOME **************

const barbaGoHeader = window.barbaGo || null;

const logos = document.querySelectorAll('.logo')



logos?.forEach(logo => {
  logo.addEventListener('click', () => {

    const basePath = getBasePath()

    console.log('basePath logo', basePath);
    

    window.location.href = basePath || '/';
    
    // if (barbaGoHeader) {
    //  barbaGoHeader('/');
    // } else {
    //   window.location.href = '/';
    // }
  });
});
