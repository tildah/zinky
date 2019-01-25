var win = window,
  docEl = document.documentElement,
  menu = document.getElementById('menu-wrapper');

win.onscroll = function() {
  updateHeaderColor();
};

function updateHeaderColor() {
  var sTop = (win.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
  if (sTop > 160) {
    menu.classList.add("fixed-menu");
    menu.classList.remove("absolute-menu");
  } else {
    menu.classList.add("absolute-menu");
    menu.classList.remove("fixed-menu");
  }
}

updateHeaderColor();

smoothScroll.init();

var customScroll = new scrollbot(".scrollable", 8);
customScroll.setStyle({
  'background': '#24b2b7',
  'border-radius': '20px'
}, {
  'background': '#fff',
  'opacity': '1'
})

var noisy = {};

/*
 * Checking localStorage for cached dataURL to use or else it generate
 * one. In this version it also adds the noise to the body tag.
 */
noisy.init = function() {
  var body = document.getElementsByTagName('body')[0],
    noise = this.noise = localStorage['noise'];

  if (!noise) {
    console.debug('No noise in the storage.');
    noise = this.generate_noise();
  }

  body.setAttribute('style', 'background-image: url("' + noise + '")');
};

/*
 * Generete the noice and returns the data-url.
 * @return <string> data-url
 */
noisy.generate_noise = function() {
  var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    body = document.getElementsByTagName('body')[0],
    canvasHeight = ch = canvas.height = 50,
    canvasWidth = canvas.width = 50,
    html = document.getElementsByTagName('html')[0],
    num;

  html.appendChild(canvas);

  // Drawing noise on the canvas.
  while (canvasWidth--) {
    while (canvasHeight--) {
      num = Math.floor(Math.random() * 255)
      context.fillStyle = "rgba(" + num + "," + num + "," + num + "," + .02 + ")";
      context.fillRect(canvasWidth, canvasHeight, 1, 1);
    }
    canvasHeight = ch; // Reset canvasHeight.
  }

  // Storing the data-url.
  localStorage['noise'] = canvas.toDataURL();

  return canvas.toDataURL();
};

noisy.init();