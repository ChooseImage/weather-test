import { myp5 } from '../sketch.js'

//Building
let w = 1080;
let h = 1920;
let woff = w*0.1;
let hoff = h*0.06;
let off = 0.3;

// front building
let x1 = 400;
let y1 = 400;
let w1 = 120;
let d1 = 100;
  
// rear building 
let x2 = 400;
let y2 = 400;
let w2 = 120;
let d2 = 100;
  
  
let xGap = 10;
let yGap = 10;
let sizeX = 200;
let sizeY = 30;
let sizeZ = 80;

let numCols;
let numRows;
let winSize = 8;




// BUILDING

const drawBuildings = () => {
    let AposX, BposX, Aheight, Bheight, Adepth, Bdepth, Awidth, Bwidth;
    AposX = -100;
    Aheight = 1300;
    Adepth = 129;
    Awidth = 220;
    const index = Math.random()

    for(let i=0; i< 6; i++){

        let offx = myp5.noise(200*i) * myp5.width * 2;
        let offy = (myp5.noise(40*i) - 0.5) * 600;
        let offw = (myp5.noise(2000*i)-0.5) * 140;
        let offd = (myp5.noise(2000*i)-0.5) * 140;
        drawUnit(AposX + offx, Aheight + offy, Awidth + offw, Adepth + offd);
    }
}

const drawStuff = () => {
    let outofBoundsA = 60;
    let outofBoundsB = 70;
    
    //fill(PARAMS.squareColor);
    myp5.noStroke();
    myp5.rect(0,0,600);
    
  
    
    off = 0.3;
    
    //Rear
    //drawUnit(100, 500, 300, 120);
    
    
    // BRIDGES
  
    
    //Front
    let AposX, BposX, Aheight, Bheight, Adepth, Bdepth, Awidth, Bwidth;
    AposX = 700;
    Aheight = 1200;
    Adepth = 129;
    Awidth = 220;

    BposX = 610;
    Bheight = 1600;
    Bdepth = 110;
    Bwidth = 140;



    drawUnit(AposX, Aheight, Awidth, Adepth);
    drawUnit(BposX, Bheight, Bwidth, Bdepth);
    //drawUnit(PARAMS.BposX, PARAMS.BHeight, PARAMS.Bwidth, PARAMS.Bdepth);
  
    
    numCols = 100;
    numRows = 200;
    winSize = 20;

//makeWindow(PARAMS.AposX, PARAMS.AHeight,PARAMS.AWindowColumns, PARAMS.AWindowRows, PARAMS.AWindowSize, 1, PARAMS.AWindowsPosX, PARAMS.AWindowsPosY);


  }


const drawUnit = (x1, y1, w1/*width*/, w2/*depth*/) => {
  
    let h1 = h;
    myp5.noStroke();
    
    let X1, X2, Y1, Y2, Y3, Y4;
    
    X1 = x1;
    X2 = x1+ w1;
    Y1 = y1;
    Y2 = y1+h;
    Y3 = y1+h+w1*off;
    Y4 = y1+w1*off;
    
    
    const offr = Math.random(-40, 40);
    const offg = Math.random(-40, 40);
    const offb = Math.random(-40, 40);
    // RIGHT FACING SIDE
    let pink = myp5.color('#fcedeb');
    myp5.fill(252 + offr, 237 + offg, 235 + offb);
  
    myp5.beginShape();
    myp5.vertex(X1, Y1); // TOP LEFT
    myp5.vertex(X1, Y2); // BOT LEFT
    myp5.vertex(X2, Y3); // BOT RIGHT
    myp5.vertex(X2, Y4); // TOP RIGHT
    myp5.endShape();
    
    // LEFT FACING SIDE
    
    let I1, I2, J1, J2, J3, J4;
    
    I1 = x1;
    I2 = x1 - w2;
    J1 = y1;
    J2 = y1+h;
    J3 = y1+h+w2*off;
    J4 = y1+w2*off;
    
    //push();
    myp5.fill('ffcdb2');
    
    myp5.beginShape();
    myp5.vertex(I1, J1);
    myp5.vertex(I1, J2);
    myp5.vertex(I2, J3);
    myp5.vertex(I2, J4);
    myp5.endShape();
    //pop();
    
    myp5.push();
    myp5.fill(0, 60);
    
    myp5.beginShape();
    myp5.vertex(I1, J1);
    myp5.vertex(I1, J2);
    myp5.vertex(I2, J3);
    myp5.vertex(I2, J4);
    myp5.endShape();
    myp5.pop();
    
}
  
const drawLink = (x, y, xGap, yGap, sizeX, sizeY, sizeZ) => {
    
    
    myp5.fill(40, 50, 140);
    x = 30;
      
    
    // RIGHT FACING SIDE
  
    let newX = x-xGap;
    let newY = y+yGap+sizeY;
    
    let U1, U2, V1, V2, V3, V4;
    
    U1 = x-xGap;
    U2 = U1 - sizeX;
    V1 = y+yGap+sizeY;
    V2 = y+yGap;
    V3 = y+yGap-sizeX*off;
    V4 = y+yGap+sizeY-sizeX*off
  
  
    
    myp5.beginShape();
    myp5.vertex(U1, V1); // BOT RIGHT
    myp5.vertex(U1, V2); // TOP RIGHT
    myp5.vertex(U2, V3); // TOP LEFT
    myp5.vertex(U2, V4); // BOT LEFT
    myp5.endShape();
     
    // DOWN FACING SIDE
    
    let N1, N2, N3, N4, M1, M2, M3, M4;
    
    myp5.fill(50,50,50);
    
    
    
    N1 = x-xGap;
    N2 = x-xGap-sizeZ;
    N3 = x-xGap-sizeX-sizeZ;
    N4 = x-xGap-sizeX;
    M1 = y+yGap+sizeY;
    M2 = y+yGap+sizeY+sizeZ*off;
    M3 = y+yGap+sizeY-sizeX*off+sizeZ*off;
    M4 = y+yGap+sizeY-sizeX*off;
    
    myp5.beginShape();
    myp5.vertex(N1, M1); // TOP RIGHT
    myp5.vertex(N2, M2); // BOT RIGHT
    myp5.vertex(N3, M3); // BOT LEFT
    myp5.vertex(N4, M4); // TOP LEFT
    myp5.endShape();
    
    
    myp5.push();
    myp5.fill(0,40);
    myp5.beginShape();
    myp5.vertex(N1, M1); // TOP RIGHT
    myp5.vertex(N2, M2); // BOT RIGHT
    myp5.vertex(N3, M3); // BOT LEFT
    myp5.vertex(N4, M4); // TOP LEFT
  
    myp5.endShape();
    myp5.pop();
}
    
const makeWindow = (x, y, numCols, numRows, winSize, margin, firstCol, offY) => {
      
    let winEdgeX = margin;
    let winEdgeY = offY;
      
   
    //print(outofBounds);
      
    myp5.push();
    myp5.fill(70, 20, 240);
    myp5.noStroke();
    //stroke(200);
    for(let col = firstCol; col<numCols; col++){
      for(let row = 0; row<numRows; row++){
        
        let u1, o1, u2, o2, o3, o4;
        
        u1 = x+winEdgeX+winSize*col;
        o1 = y+winEdgeY+winSize*row+winSize*col*off;
        u2 = u1+winSize; 
        o2 = o1+winSize;
        o4 = o1+winSize*off;
        o3 = o4+winSize;
        
        myp5.beginShape();
        myp5.vertex(u1,o1);
        myp5.vertex(u1,o2-margin);
        myp5.vertex(u2-margin,o3-margin);
        myp5.vertex(u2-margin,o4);
        myp5.endShape();
      }
    }
    myp5.pop();
}

export {
    drawStuff,
    drawUnit,
    drawLink,
    makeWindow,
    drawBuildings
  };
  