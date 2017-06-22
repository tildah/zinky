var win = window,
  docEl = document.documentElement,
  menu = document.getElementById('content-menu');

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

jQuery(function ($) {
  $("#content-menu").scrollTo();
});

$(document).ready(function () {
  $("#content-menu").niceScroll({
    cursorcolor: "#00e676",
    cursorborder: "0px solid #fff",
  });
});