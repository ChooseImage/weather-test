let board;
let wrapper;
let id = '';
let bh = 1080;
let bw = 1920;

const reload = function () {
  if (new Date().getSeconds() % 15 == 0) location.reload();
  else window.requestAnimationFrame(reload);
};

document.addEventListener('DOMContentLoaded', ready);
const htmlExampleResize = function () {
  let ratio = 1080 / 1920;
  var w = window.innerWidth;
  var h = window.innerHeight;
  const wAdj = w;
  const hAdj = h;
  let scale = wAdj / bw;
  if (w / h - ratio > 1) scale = hAdj / bh;
  wrapper.style.transform = `scale(${scale}) translate(-50%,-50%)`;
};

function ready() {
  wrapper = document.querySelector('main');
  board = document.querySelector('.board');
  bw = board.offsetWidth;
  bh = board.offsetHeight;
  window.addEventListener('resize', htmlExampleResize);
  setTimeout(htmlExampleResize, 20);

  var url =
    window.location != window.parent.location
      ? document.referrer
      : document.location.href;
  // console.log(url,'URL')
  if (url.split('?')[1]) {
    document.querySelectorAll('a').forEach(a => {
      a.href += '?' + url.split('?')[1];
    });
  }
}
