try {
  barba.init({
    sync: true,
    preventRunning: true,
    transitions: [
      {
        name: 'instant',
        leave() {
          return Promise.resolve();
        },
        enter() {
          return Promise.resolve();
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
