/* template GTAT2 Game Technology & Interactive Systems */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var playWidth = canvasWidth * 0.8;
var playHeight = canvasHeight * 0.6;

var centerX = canvasWidth / 2;
var centerY = canvasHeight / 2;

var zeroPointX = canvasWidth * 25.0 / 29.7;
var zeroPointY = canvasHeight * 15.3 / 21.0;

function setup() { /* here are program-essentials to put */
    createCanvas(windowWidth, windowHeight);
}

function draw() { /* here is the dynamic part to put */
    /* administrative work */

    /* calculations */

    /* display */

    background
    fill(210, 210, 210);
    noStroke();
    rectMode(CENTER);
    rect(centerX, centerY, playWidth, playHeight);

    //playground
    fill(204, 102, 0);
    strokeWeight(1);
    stroke(0, 0, 255);

    beginShape();
    vertex(zeroPointX - playWidth * 21.4 / 23.1, zeroPointY - playHeight * 3.0 / 15.3);
    vertex(zeroPointX - playWidth * 21.4 / 23.1, zeroPointY + playHeight * 1.2 / 15.3);
    vertex(zeroPointX + playWidth * 1.7 / 23.1, zeroPointY + playHeight * 1.2 / 15.3);
    vertex(zeroPointX + playWidth * 1.7 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 4 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 6.9 / 23.1, zeroPointY - playHeight * 1.4 / 15.3);
    vertex(zeroPointX - playWidth * 9.8 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 11.2 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 11.4 / 23.1, zeroPointY + playHeight * 0.6 / 15.3);
    vertex(zeroPointX - playWidth * 12.9 / 23.1, zeroPointY + playHeight * 0.6 / 15.3);
    vertex(zeroPointX - playWidth * 13.1 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 16 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 16 / 23.1, zeroPointY + playHeight * 0.6 / 15.3);
    vertex(zeroPointX - playWidth * 16.6 / 23.1, zeroPointY + playHeight * 0.6 / 15.3);
    vertex(zeroPointX - playWidth * 16.6 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 18.6 / 23.1, zeroPointY);
    endShape(CLOSE);

    //sand
    stroke(153, 102, 0);
    noFill()
    strokeWeight(4);

    beginShape();
    vertex(zeroPointX - playWidth * 21.4 / 23.1, zeroPointY - playHeight * 3.0 / 15.3);
    vertex(zeroPointX - playWidth * 18.6 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 16.6 / 23.1, zeroPointY);
    endShape();

    //grass
    stroke(0, 51, 0);

    beginShape();
    vertex(zeroPointX - playWidth * 16 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 13.1 / 23.1, zeroPointY);
    endShape();

    beginShape();
    vertex(zeroPointX + playWidth * 1.7 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 4 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 6.9 / 23.1, zeroPointY - playHeight * 1.4 / 15.3);
    vertex(zeroPointX - playWidth * 9.8 / 23.1, zeroPointY);
    vertex(zeroPointX - playWidth * 11.2 / 23.1, zeroPointY);
    endShape();

    //water
    fill(0, 0, 255);
    strokeWeight(1);
    stroke(0, 0, 255);

    beginShape();
    vertex(zeroPointX - playWidth * 11.25 / 23.1, zeroPointY + playHeight * 0.2 / 15.3);
    vertex(zeroPointX - playWidth * 11.4 / 23.1, zeroPointY + playHeight * 0.6 / 15.3);
    vertex(zeroPointX - playWidth * 12.9 / 23.1, zeroPointY + playHeight * 0.6 / 15.3);
    vertex(zeroPointX - playWidth * 13.05 / 23.1, zeroPointY + playHeight * 0.2 / 15.3);
    endShape(CLOSE);

    //balls
    fill(255, 150, 0);
    stroke(255, 150, 0);

    ellipse(zeroPointX, zeroPointY - playWidth * 0.2 / 23.1, playWidth * 0.4 / 23.1);
}

function windowResized() { /* responsive part */
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    resizeCanvas(windowWidth, windowHeight);
}