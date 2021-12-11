/** GTAT2 Game Technology & Interactive Systems **/
/** 9. Übung  **/
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
var dBall = 0.019; // ball diameter in [m]
var ballColor = "#aaaa00"; //ball color
var mBall = 0.0025; //[kg]

//Speed Controller
//******************************************************
const vWater = 5.3; //start speed of the ball to go into water
const vHole = 6.6; //start speed of the ball to go into the hole
var v = 5.8;
//******************************************************

var v0; // start speed [m/s]
var v0x, v0y;
var START = false;

var newBtnXPos, newBtnYPos;
var resetBtnXPos, resetBtnYPos;

var totalAttemptsXPos, totalAttemptsYPos;
var totalHolesXPos, totalHolesYPos;

const fps = 60;
var t;
var dt;

const g = 9.81;
var g_;
var g0_ = 0;
var rad;
let vec1, vec2;

var sx, sx1, sx2;
var sy, sy2;

var speedUp;
var score;

//RollingFriction
var CrGrass = 0.2;
var CrSand = 0.3;

//FlowFriction
var p = 1.3; //[kg/m^3]
var cw = 0.45; // 

//Wind Speed
var vWind;

var totalAttemptsTxt, totalHolesTxt;
var totalAttempts, totalHoles;

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

    totalAttemptsXPos = 10 * gridX;
    totalAttemptsYPos = 10 * gridY;

    totalHolesXPos = 10 * gridX;
    totalHolesYPos = 15 * gridY;

    dt = 1 / fps;

    translate(x0, y0);
    vec1 = createVector(pgPoints[1][0] - pgPoints[2][0], pgPoints[1][1] - pgPoints[2][1]);
    vec2 = createVector(pgPoints[2][0] - pgPoints[3][0], pgPoints[2][1] - pgPoints[3][1]);
    rad = vec2.angleBetween(vec1);

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

    //Statistic

    //Total attempts + total holes
    totalAttemptsTxt = "Total attempts: " + totalAttempts;
    totalHolesTxt = "Total holes:      " + totalHoles;
    push();
    textAlign(START, CENTER);
    textSize(1.5 * fontSize);
    text(totalAttemptsTxt, totalAttemptsXPos, totalAttemptsYPos);
    text(totalHolesTxt, totalHolesXPos, totalHolesYPos);
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
    //NewBtn
    if (mouseX > newBtnXPos &&
        mouseX < newBtnXPos + buttonWidth &&
        mouseY > newBtnYPos &&
        mouseY < newBtnYPos + buttonHeight) {
        START = true;
        totalAttempts++;
    }
    //ResetBtn
    if (mouseX > resetBtnXPos &&
        mouseX < resetBtnXPos + buttonWidth &&
        mouseY > resetBtnYPos &&
        mouseY < resetBtnYPos + buttonHeight) {
        resetBallState();
    }
}