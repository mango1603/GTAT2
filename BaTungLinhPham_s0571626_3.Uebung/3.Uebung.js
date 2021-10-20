/** GTAT2 Game Technology & Interactive Systems **/
/** 3. Übung  **/
/** Implementation based on 2. Übung-Lösung from Dr.-Ing. V. Naumburger*/
/************************************************************************************/

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var s; // scale
var x, y; // Coordinate

var basicLength = 5; // in [m]
var bodyHeight = 1.8; //  in [m]
var playgroundWidth = basicLength * 23.9 / 16.9; //  in [m]

var xBall, yBall; // golf ball
var dBall = 0.1; // ball diameter in [m]
var colorBall = "#aaaa00"; //ball color

function setup() { /* prepare program */
    createCanvas(windowWidth, windowHeight);
    evaluateConstants();

    s = 0.85 * canvasWidth / playgroundWidth
    x = 25.0 * canvasWidth / 29.7;
    y = 15.3 * canvasHeight / 21.0;

    xBall = 0;
    yBall = dBall / 2;
}

function draw() {
    background(200);
    /* administration */

    //Intro text
    push();
    textAlign(CENTER, CENTER);
    textSize(2.5 * fontSize);
    text("The Golf Game", 50 * gridX, 10 * gridY);
    textSize(2.0 * fontSize);

    //Buttons

    // NEW-Button
    fill('#00ff00');
    rect(80 * gridX, 90 * gridY, buttonWidth, buttonHeight);
    fill(0);
    text("NEW", 80 * gridX + 0.5 * buttonWidth, 90 * gridY + 0.5 * buttonHeight);

    // RESET-Button
    fill('#ff0000');
    rect(10 * gridX, 90 * gridY, buttonWidth, buttonHeight);
    fill(0);
    text("RESET", 10 * gridX + 0.5 * buttonWidth, 90 * gridY + 0.5 * buttonHeight);
    pop();
    /* calculation */

    /* display */

    //Playground
    push();
    translate(x, y);
    scale(1, -1);
    playGround();

    //Golf ball
    fill(colorBall);
    ellipse(xBall * s, yBall * s, dBall * s);

    //Zero-point marker
    push();
    stroke(0);
    strokeWeight(2);
    line(10, 0, -10, 0);
    line(0, 10, 0, -10);
    pop();

    pop();
}

function windowResized() { /* responsive design */
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    resizeCanvas(windowWidth, windowHeight);
}