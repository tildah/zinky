var win = window,
  docEl = document.documentElement,
  menu = document.getElementById('menu-wrapper');

win.onscroll = function () {
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

// TODO: use a pure js library  
// jQuery(function ($) {
//   $("#content-menu").scrollTo();
// });
smoothScroll.init();

var customScroll = new scrollbot(".scrollable", 8);
customScroll.setStyle({
  'background': '#00e676',
  'border-radius': '20px'
}, {
    'background': '#fff',
    'opacity': '1'
  })