let triptych
let wrapper
let id = '';
let bh = 1920
let bw = 1080


const reload = function() {
    if (new Date().getSeconds() % 15 == 0)
        location.reload()
    else
        window.requestAnimationFrame(reload)
}

document.addEventListener('DOMContentLoaded', ready);
const htmlExampleResize = function() {
    let ratio = 1920 / 1080
    var w = window.innerWidth;
    var h = window.innerHeight;
    const wAdj = w / 3
    let scale = wAdj / bw
    if (w / h > 1.8)
        scale = h / bh
    wrapper.style.transform = `scale(${scale}) translate(-50%,-50%)`
}

function ready() {
    triptych = document.querySelectorAll('.board')
    wrapper = document.querySelector('main')
    // console.log(triptych[0].getComputedStyle())
    bw = triptych[0].offsetWidth
    bh = triptych[0].offsetHeight
    window.addEventListener('resize', htmlExampleResize);
    setTimeout(htmlExampleResize, 20)
    // setTimeout(reload, 2000)
}