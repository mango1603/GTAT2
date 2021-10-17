/* template GTAT2 Game Technology & Interactive Systems */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var playWidth = canvasWidth;
var playHeight = playWidth / 2;

var centerX = canvasWidth / 2;
var centerY = canvasHeight / 2;

var zeroPointX = centerX - playWidth / 2;
var zeroPointY = centerY - playHeight / 2;

function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
}

function draw() {							/* here is the dynamic part to put */
  /* administrative work */

  /* calculations */

  /* display */

  //background
  fill(210, 210, 210);
  rectMode(CENTER);
  rect(centerX, centerY, playWidth, playHeight);

  //playground
  fill(204, 102, 0);
  strokeWeight(2);
  stroke(0,0,255);

  beginShape();
  vertex(zeroPointX, (zeroPointY + playHeight) * 0.70);
  vertex(zeroPointX, (zeroPointY + playHeight));
  vertex((zeroPointX + playWidth), (zeroPointY + playHeight));
  vertex((zeroPointX + playWidth), (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.75, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.64, (zeroPointY + playHeight) * 0.8);
  vertex((zeroPointX + playWidth) * 0.53, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.46, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.45, (zeroPointY + playHeight) * 0.95);
  vertex((zeroPointX + playWidth) * 0.38, (zeroPointY + playHeight) * 0.95);
  vertex((zeroPointX + playWidth) * 0.37, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.24, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.24, (zeroPointY + playHeight) * 0.95);
  vertex((zeroPointX + playWidth) * 0.21, (zeroPointY + playHeight) * 0.95);
  vertex((zeroPointX + playWidth) * 0.21, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.12, (zeroPointY + playHeight) * 0.9);
  endShape(CLOSE);

  //flag
  stroke(0,0,0);
  strokeWeight(4);
  noFill()

  beginShape();
  vertex((zeroPointX + playWidth) * 0.18, (zeroPointY + playHeight) * 0.65);
  vertex((zeroPointX + playWidth) * 0.18, (zeroPointY + playHeight) * 0.9);
  endShape();

  stroke(0,0,255);
  fill(255,255,0);
  strokeWeight(3);

  beginShape();
  vertex((zeroPointX + playWidth) * 0.18, (zeroPointY + playHeight) * 0.66);
  vertex((zeroPointX + playWidth) * 0.12, (zeroPointY + playHeight) * 0.68);
  vertex((zeroPointX + playWidth) * 0.18, (zeroPointY + playHeight) * 0.70);
  endShape();

  //sand
  stroke(153, 102, 0);
  noFill()
  strokeWeight(4);

  beginShape();
  vertex(zeroPointX, (zeroPointY + playHeight) * 0.70);
  vertex((zeroPointX + playWidth) * 0.12, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.21, (zeroPointY + playHeight) * 0.9);
  endShape();

  //grass
  stroke(0, 51, 0);

  beginShape();
  vertex((zeroPointX + playWidth), (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.97, (zeroPointY + playHeight) * 0.9);
  endShape();

  beginShape();
  vertex((zeroPointX + playWidth) * 0.85, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.75, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.64, (zeroPointY + playHeight) * 0.8);
  vertex((zeroPointX + playWidth) * 0.53, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.46, (zeroPointY + playHeight) * 0.9);
  endShape();

  beginShape();
  vertex((zeroPointX + playWidth) * 0.24, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.37, (zeroPointY + playHeight) * 0.9);
  endShape();

  //standpoint
  stroke(0, 153, 0);

  beginShape();
  vertex((zeroPointX + playWidth) * 0.85, (zeroPointY + playHeight) * 0.9);
  vertex((zeroPointX + playWidth) * 0.97, (zeroPointY + playHeight) * 0.9);
  endShape();

  //water
  fill(0, 0, 255);
  strokeWeight(1);
  stroke(0,0,255);

  beginShape();
  vertex((zeroPointX + playWidth) * 0.458, (zeroPointY + playHeight) * 0.91);
  vertex((zeroPointX + playWidth) * 0.45, (zeroPointY + playHeight) * 0.95);
  vertex((zeroPointX + playWidth) * 0.38, (zeroPointY + playHeight) * 0.95);
  vertex((zeroPointX + playWidth) * 0.372, (zeroPointY + playHeight) * 0.91);
  endShape(CLOSE);

  //balls
  fill(255, 150, 0);
  stroke(255, 150, 0);

  ellipse((zeroPointX + playWidth) * 0.89, (zeroPointY + playHeight) * 0.9 - (zeroPointX + playWidth) * 0.008, (zeroPointX + playWidth) * 0.016, (zeroPointX + playWidth) * 0.016);
  ellipse((zeroPointX + playWidth) * 0.74, (zeroPointY + playHeight) * 0.79, (zeroPointX + playWidth) * 0.016, (zeroPointX + playWidth) * 0.016)
}

function windowResized() {					/* responsive part */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}

