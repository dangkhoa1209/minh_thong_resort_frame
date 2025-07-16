// ************** CLICK BACK HOME **************

const barbaGoHeader = window.barbaGo || null;

const logos = document.querySelectorAll('.logo')



logos?.forEach(logo => {
  logo.addEventListener('click', () => {
    const basePath = getBasePath()    
    window.location.href = basePath || '/';
  });
});
