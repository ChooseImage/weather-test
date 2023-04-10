import { myp5 } from '../sketch';


const drawRain = (spd, dense, dir) =>  {
    for(let n = 0; n < 10 + 10 * dense; n ++) {
      let posX = myp5.randomGaussian(myp5.width/2, myp5.width/2);
      let posY = myp5.random(myp5.height + spd * 10 * 10) + myp5.height*0.22;
      drawRainDrop(posX, posY, spd, dir);
    }
}

const drawRainDrop = (x, y, spd, dir) => {
    myp5.push();
    myp5.translate(x, y);
    myp5.rotate(dir);
    for(let l = 0; l < 5 + spd * 10; l++) {
        myp5.stroke(250, myp5.map(l, 0, 5 + spd * 10, 40, 250))
        myp5.line(0, (l - 6 - spd * 10) * 7, 0, (l - 5 - spd * 10) * 7);
    }
    myp5.pop();
    // draw ripple on the ground
    if(y > myp5.height - myp5.height * 0.2) {
      drawRipple(x + myp5.random(-50, 50), y + myp5.random(-20, 20), spd);
    }
}

const drawRipple = (x, y, spd) => {
    myp5.push();
    myp5.stroke(255, 220);
    myp5.strokeWeight(0.4)
    let scale = myp5.random(0.08, 0.2);
    let width = (15 + spd * 12) * scale;
    let height = (5 + spd * 3) * scale;
    myp5.arc(x, y, width, height, -60, 240);
    myp5.pop();
}

export {
    drawRain,
    drawRainDrop,
    drawRipple
};