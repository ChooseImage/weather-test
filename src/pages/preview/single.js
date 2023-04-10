let board;
let wrapper;
let id = '';
let bh = 1920;
let bw = 1080;

const reload = function () {
  if (new Date().getSeconds() % 15 == 0) location.reload();
  else window.requestAnimationFrame(reload);
};

document.addEventListener('DOMContentLoaded', ready);
const htmlExampleResize = function () {
  let ratio = 1920 / 1080;
  var w = window.innerWidth;
  var h = window.innerHeight;
  const wAdj = w;
  const hAdj = h;
  let scale = hAdj / bh;
  // console.log(scale)
  wrapper.style.transform = `scale(${scale}) translate(-50%,-50%)`;
};

function ready() {
  wrapper = document.querySelector('main');
  board = document.querySelector('.board');
  bw = board.offsetWidth;
  bh = board.offsetHeight;
  window.addEventListener('resize', htmlExampleResize);
  setTimeout(htmlExampleResize, 20);
  // setTimeout(reload, 2000)
}
