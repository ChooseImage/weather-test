import {getWeatherData} from '../../js/apis/climacell'
// import Gotham from '../assets/fonts/Gotham-Font/GothamMedium.ttf'
// import GothamBold from '../assets/fonts/Gotham-Font/GothamBold.ttf'
// import GothamItalic from '../assets/fonts/Gotham-Font/GothamMediumItalic.ttf'
import {WEATHER_CONDITIONS, UV_PROPERTIES, MONTHBOARD, WEEKBOARD} from '../../js/constants.js'
import { drawStuff, drawUnit, drawLink, makeWindow, drawBuildings } from './js/building.js'
import { drawRain, drawRainDrop, drawRipple } from './js/rain.js'
import { drawWind } from './js/wind.js'


let text
let windDir = 0
let windSpeed = 0
let temp1, temp2, temp3
let tFeel1, tFeel2, tFeel3
let weatherCode1, weatherCode2, weatherCode3, weatherCode
let humidity
let uvColorCode, colorUv, uvText

let backgroundColor

let bgIndex

let colorDay, colorNight

let weatherConColor

let fontRegular, fontItalic, fontBold

let timeCurent = new Date()
let dayCur = `${WEEKBOARD[timeCurent.getDay()]} ${MONTHBOARD[timeCurent.getMonth()]} ${timeCurent.getDate()}`

let timeCurrent = ``

//let timeCur = moment().format('h:mm a')
let timeCur = '12:34'
//let hourCur = Number(moment().format('H'))
let hourCur = 13

console.log(dayCur)

console.log(timeCur)
console.log(hourCur)
//console.dir(today)
// Rain
var speed = 0.5
var density = 5
var direction = 10

let t, dim
const Y_AXIS = 1
const X_AXIS = 2
let b1, b2, c1, c2

let img







let myp5 = new p5(function(p5){


    p5.preload = function(){
        fontRegular = p5.loadFont('https://github.com/ChooseImage/Reflection/blob/main/fonts/SourceCodePro-Bold.ttf?raw=true')
        fontItalic = p5.loadFont('https://github.com/ChooseImage/Reflection/blob/main/fonts/SourceCodePro-Bold.ttf?raw=true')
        fontBold = p5.loadFont('https://github.com/ChooseImage/Reflection/blob/main/fonts/SourceCodePro-Bold.ttf?raw=true')
    }

    p5.setup = function(){


        p5.blendMode(p5.SCREEN);
        p5.createCanvas(1080, 1920);

        t = 0;

        b1 = p5.color(255);
        b2 = p5.color(0);
        c1 = p5.color(204, 102, 0);
        c2 = p5.color(0, 102, 153);

        p5.angleMode(p5.DEGREES);

        colorDay = p5.color('#ffd445');
        colorNight = p5.color('#221b70')
    }

    p5.draw = function(){


        // -------------------------- Gradient Param ------------------------------
        let r= p5.width/2.2
        r = r*3.2
        let red = 255 * p5.noise(t+10)
        let g = 255 * p5.noise(t+15)
        let b = 255 * p5.noise(t+20)


        let pink = p5.color('#ffcdb2')
        let colorWarm = p5.color('#ff4800')
        let colorCold = p5.color('#004cff')

        let colorRain = p5.color('#52559e')
        let colorClear = p5.color('#f5d856')

        let colorDry = p5.color('#ab873a')
        let colorWet = p5.color('#201dad')

        // UV color 
        colorUv = p5.color(`${uvColorCode}`)


        // Temperture
        //temp1 = 90 Debug for visual values
        let tempInter = p5.map(temp1, 20, 95, 0, 1)
        let colorTemp = p5.lerpColor(colorCold, colorWarm, tempInter)

        // Humidity
        // humidity = 0.5 Debug for visual values
        let colorHum = p5.lerpColor(colorDry, colorWet, humidity)

        p5.stroke(235, 89, 147, 20)
        p5.strokeWeight(100)
        p5.noFill()

        t+= 0.001

        // -------------------------- Set Background Color according to current hour ------------------------------
        if(2 <= hourCur < 14){
            bgIndex = p5.map(hourCur, 2, 14, 0, 1)
            backgroundColor = p5.lerpColor(colorNight, colorDay, bgIndex)
        }else{
            if(hourCur < 2){
                hourCur += 24
            }
            bgIndex = p5.map(hourCur, 14, 25, 1, 0)
            backgroundColor = p5.lerpColor(colorDay, colorNight, bgIndex)
        }


        r = r/3.2
        
        p5.background(backgroundColor)
        //p5.background(pink)

        // ----------------------- Wind -----------------------
        //drawWind(42, windSpeed, backgroundColor)

        //p5.fill('blue')


 
        // ----------------------- Buildings -----------------------
        //drawStuff();
        //drawBuildings();

        // ----------------------- Weather / Station text -----------------------
        
        setGradient(p5.width/2-r/2, p5.height/2-r/2 + p5.height*0.1, r, r, backgroundColor, colorTemp, Y_AXIS);
        setGradient(p5.width/2-r/2, p5.height/2-r/2 + p5.height*0.1, r/2, r, backgroundColor, colorHum, X_AXIS);
        setGradient(p5.width/2-r/2, p5.height/2-r/2 + p5.height*0.1, r/2, r/2, backgroundColor, colorUv, Y_AXIS);



        if(p5.frameCount % 1 === 0) {
            speed = 0.0001;
            density = 1;
            direction = 10;
        
            p5.strokeWeight(4)
            //drawRain(speed, density, direction);
        }

        // ----------------------- Weather / Station text -----------------------
        displayWeather(p5)


    }
})

const displayWeather = (p5) => {

    p5.noStroke()
    // Top Background
    p5.fill(10)
    p5.rect(0, 0, p5.width, p5.height*0.2)

    // Current Forecast
    // p5.textFont(fontBold);
    p5.textSize(50);
    p5.fill(255, 240)
    p5.text("Current Forecast", 30, 90)

    // Station Name
    p5.fill(100, 250, 255)
    // p5.textFont(fontRegular);
    p5.textSize(102);
    p5.text("14 St-Union Sqare", 30, 220)

    // Date
    let date = 'Tuesday, December 10'
    date = dayCur
    p5.fill(255, 240)
    p5.textSize(50) 
    p5.text(date, 30, 310)


    // Forecast 1
    p5.textSize(100)
    p5.fill(255,240)
    // p5.textFont(fontBold)
    p5.text(timeCur, 40, 530)
    p5.fill(255,140)
    p5.text(Math.trunc( temp1 ) + "°", 520, 533)

    p5.textSize(50)
    p5.text('Feels like ' + Math.trunc(tFeel1) + "°", 40, 720)
    p5.fill(255,240)
    p5.text(weatherCode, 40, 790)
}

document.addEventListener('DOMContentLoaded', ready);

async function ready() {

    const weatherData = await getWeatherData(20, 20)

    const { timelines } = weatherData
    console.log(timelines)

    temp1 = timelines[0].intervals[0].values.temperature
    tFeel1 = timelines[0].intervals[0].values.temperatureApparent


    windDir = timelines[0].intervals[0].values.windDirection
    windSpeed = timelines[0].intervals[0].values.windSpeed

    weatherCode1 = timelines[0].intervals[0].values.weatherCode
    weatherCode1 = WEATHER_CONDITIONS[weatherCode1].split(',')
    weatherCode = weatherCode1[0]


    humidity = timelines[0].intervals[0].values.humidity * 0.01
    let uv = timelines[0].intervals[0].values.uvIndex
    uvColorCode = UV_PROPERTIES[uv][0]
    uvText = UV_PROPERTIES[uv][1]
    console.log(uvText)

}


const setGradient = (x, y, w, h, c1, c2, axis) => {


    myp5.noFill();
    if (axis === Y_AXIS) {
      // Top to bottom gradients
      for (let i = y; i <= y + h; i++) {
        let inter = myp5.map(i, y, y + h, 0, 1);
        let c = myp5.lerpColor(c1, c2, myp5.pow(inter, 1.5));
        myp5.stroke(c);
        myp5.line(x, i, x + w, i);
      }
    } else if (axis === X_AXIS) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = myp5.map(i, x, x + w, 0, 1);
        let c = myp5.lerpColor(c1, c2, myp5.pow(inter, 1.5));
        myp5.stroke(c);
        myp5.line(i, y, i, y + h);
      }
    }
}

export { myp5 }