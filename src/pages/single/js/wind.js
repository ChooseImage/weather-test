import { myp5 } from '../sketch.js'

let d = 55
let l = 10



const drawWind = (windDirection, windSpeed, bgColor) => {
    let c = myp5.color('grey')
    myp5.push()
    myp5.strokeWeight(3)

    l = myp5.map(windSpeed, 0, 5, 30, 50)
    let stroleW = myp5.map(windSpeed, 0, 5, 2, 7)

    myp5.angleMode(myp5.DEGREES)
    const offX = l * myp5.cos(windDirection);
    const offY = l * myp5.sin(windDirection);
    myp5.strokeWeight(stroleW)
    for(let i = 0; i < myp5.width+myp5.width/d; i += d){
      for(let j = 0; j < myp5.height+myp5.height/d; j += d){
        c.setAlpha(255*myp5.pow(myp5.noise(i*2000, j*100), 1.3))
        myp5.stroke(c)
        myp5.line(i, j, i+offX, j+offY);
      }
    }

    myp5.fill(bgColor)
    myp5.noStroke()
    myp5.rect(0, 0, 300-1, 1921)
    myp5.rect(1080-300, 0, 1080, 1920)
    myp5.rect(0, 0, 1080, 900)
    myp5.rect(0, 1920-530, 1080, 1920)

    myp5.pop()
  }


  export {
    drawWind
  }