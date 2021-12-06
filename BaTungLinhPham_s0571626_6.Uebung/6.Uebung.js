/** GTAT2 Game Technology & Interactive Systems **/
/** 6. Übung  **/
/** Implementation based on 2. Übung-Lösung from Dr.-Ing. V. Naumburger*/
/************************************************************************************/

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M; // scale
var x0, y0; // Coordinate

var basicLength = 5; // [m]
var bodyHeight = 1.8; //  [m]
var playgroundWidth = basicLength * 23.9 / 16.9; // [m]

//Ball
var xBall, yBall; // golf ball
var dBall = 0.1; // ball diameter in [m]
var ballColor = "#aaaa00"; //ball color
var v = 3;
var v0; // start speed [m/s]
var v0x, v0y;
var START = false;

var newBtnXPos, newBtnYPos;
var resetBtnXPos, resetBtnYPos;

const fps = 60;
var t;
var dt;

const g = 9.81;
var g_;
var rad;
let vec1, vec2;

var sx, sx1, sx2;
var sy, sy2;

var speedUp;

//RollingFriction
var CrGrass = 0.2;
var CrSand = 0.3;

function setup() { /* prepare program */
    frameRate(fps);
    createCanvas(windowWidth, windowHeight);
    evaluateConstants();

    M = 0.85 * canvasWidth / playgroundWidth
    x0 = 25.0 * canvasWidth / 29.7;
    y0 = 15.3 * canvasHeight / 21.0;

    newBtnXPos = 80 * gridX;
    newBtnYPos = 90 * gridY;

    resetBtnXPos = 10 * gridX;
    resetBtnYPos = 90 * gridY;

    dt = 1 / fps;

    translate(x0, y0);
    vec1 = createVector(pgPoints[1][0] - pgPoints[2][0], pgPoints[1][1] - pgPoints[2][1]);
    vec2 = createVector(pgPoints[2][0] - pgPoints[3][0], pgPoints[2][1] - pgPoints[3][1]);
    rad = vec2.angleBetween(vec1);
    g_ = g * sin(rad);

    resetBallState();
}

function draw() {
    /* administration */
    background(200);

    // Buttons
    // NEW-Button
    push();
    fill('#00ff00');
    textAlign(CENTER, CENTER);
    textSize(2.0 * fontSize);
    rect(newBtnXPos, newBtnYPos, buttonWidth, buttonHeight);
    fill(0);
    text("NEW", newBtnXPos + 0.5 * buttonWidth, newBtnYPos + 0.5 * buttonHeight);

    // RESET-Button
    fill('#ff0000');
    rect(resetBtnXPos, resetBtnYPos, buttonWidth, buttonHeight);
    fill(0);
    text("RESET", resetBtnXPos + 0.5 * buttonWidth, resetBtnYPos + 0.5 * buttonHeight);
    pop();

    /* calculation */

    /* display */

    //Playground
    push();
    translate(x0, y0);
    scale(1, -1);
    playGround();

    //Golf ball
    fill(ballColor);
    shotBall();
    ellipse(xBall * M, yBall * M, dBall * M);

    //Zero-point marker
    push();
    stroke(0);
    strokeWeight(2);
    line(5, 0, -5, 0);
    line(0, 5, 0, -5);
    pop();

    pop();
}

function windowResized() { /* responsive design */
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
    if (mouseX > newBtnXPos &&
        mouseX < newBtnXPos + buttonWidth &&
        mouseY > newBtnYPos &&
        mouseY < newBtnYPos + buttonHeight) {
        START = true;
    }
    if (mouseX > resetBtnXPos &&
        mouseX < resetBtnXPos + buttonWidth &&
        mouseY > resetBtnYPos &&
        mouseY < resetBtnYPos + buttonHeight) {
        resetBallState();
    }
}