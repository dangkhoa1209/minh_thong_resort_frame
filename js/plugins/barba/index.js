try {
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

  window.barbaGo = function (url, delay) {
    if (!delay) {
      return  barba.go(url); 
    } else {
      setTimeout(() => {
         barba.go(url);
      }, delay);
    }
  };

} catch (error) {
  console.log('error', error);
}
