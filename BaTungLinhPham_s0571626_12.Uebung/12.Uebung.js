/** GTAT2 Game Technology & Interactive Systems **/
/** 12. Übung  **/
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
var dBall = 0.048; // ball diameter in [m]
var ballColor = "#aaaa00"; //ball color
var mBall = 0.0459; //[kg]

//Speed Controller
//******************************************************
const vWater = 5.3; //start speed of the ball to go into water
const vHole = 6.6; //start speed of the ball to go into the hole
var v = 5.8; //[m/s]
//******************************************************

var v0; // start speed [m/s]
var v0x, v0y;
var START = false;

var newBtnXPos, newBtnYPos;
var resetBtnXPos, resetBtnYPos;

var totalAttemptsXPos, totalAttemptsYPos;
var totalHolesXPos, totalHolesYPos;
var windSpeedXPos, windSpeedYPos;

const fps = 60;
var t;
var dt;

const g = 9.81;
var g_;
var g0_ = 0;
var radA, radB, radC;

var sx, sx1, sx2, sx3;
var sy, sy2;

var speedUp;
var score;

//RollingFriction
var CrGrass = 0.2;
var CrSand = 0.5;

//FlowFriction
var p = 1.3; //[kg/m^3]
var cw = 0.45; // 

//Wind Speed
var vWind;
var vWindMax = 125 / 9; //[m / s] - 50km/h = 125/9 m/s 

var totalAttemptsTxt, totalHolesTxt, windSpeedTxt;
var totalAttempts, totalHoles;

//Golf Stick
var m = 1; // [kg]
var springConst = 40; // [N/m]
var attenuation = 4; // [s-1]
var omega;
let golfStick;
var lengthPutter = 0.45 * bodyHeight;
var dPutter = 0.15;
var putterColor = "#aa0000";

var dragging = false;
var dragged = false;
var vStick = 0;
var sStick = 0;
var hitTheBall = false;
var initialized = false;

var vecO, vecS, vecP;
var d, lPath, lSegment, normalAngle, directionAngle;

var vz, vt;

var rolling = false;

function setup() { /* prepare program */
    frameRate(60);
    createCanvas(windowWidth, windowHeight);
    evaluateConstants();

    omega = sqrt(springConst / m);

    M = 0.85 * canvasWidth / playgroundWidth;
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

    windSpeedXPos = 10 * gridX;
    windSpeedYPos = 20 * gridY;

    dt = 1 / fps;

    translate(x0, y0);

    radA = getAngleBetween(pgPoints[1][0], pgPoints[1][1], pgPoints[2][0], pgPoints[2][1], pgPoints[2][0], pgPoints[2][1], pgPoints[3][0], pgPoints[3][1]);
    radB = getAngleBetween(pgPoints[3][0], pgPoints[3][1], pgPoints[4][0], pgPoints[4][1], pgPoints[4][0], pgPoints[4][1], pgPoints[5][0], pgPoints[5][1]);
    radC = getAngleBetween(pgPoints[12][0], pgPoints[12][1], pgPoints[13][0], pgPoints[13][1], pgPoints[13][0], pgPoints[13][1], pgPoints[14][0], pgPoints[14][1]);

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
    windSpeedTxt = "Wind speed:      " + vWind.toFixed(2) + " m/s";
    push();
    textAlign(START, CENTER);
    textSize(1.5 * fontSize);
    text(totalAttemptsTxt, totalAttemptsXPos, totalAttemptsYPos);
    text(totalHolesTxt, totalHolesXPos, totalHolesYPos);
    text(windSpeedTxt, windSpeedXPos, windSpeedYPos);
    pop();

    /* calculation */

    /* display */

    //Playground
    push();
    translate(x0, y0);
    scale(1, -1);
    playGround();

    //Golf ball
    // if (rolling) {
    //     push();
    //     rotate(normalAngle);
    //     fill(ballColor);
    //     shotBall();
    //     ellipse(xBall * M, yBall * M, dBall * M);
    //     pop();
    // } else {
    fill(ballColor);
    shotBall();
    ellipse(xBall * M, yBall * M, dBall * M);
    // }

    //Zero-point marker
    push();
    stroke(0);
    strokeWeight(2);
    line(5, 0, -5, 0);
    line(0, 5, 0, -5);
    pop();

    //Golf Stick
    golfStick = new GolfStick(0, dPutter * M / 2, 0, 0.7 * lengthPutter * M, dPutter * M);
    golfStick.drawGolfStick();

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
        newBallState();
    }
    //ResetBtn
    if (mouseX > resetBtnXPos &&
        mouseX < resetBtnXPos + buttonWidth &&
        mouseY > resetBtnYPos &&
        mouseY < resetBtnYPos + buttonHeight) {
        resetBallState();
    }
}

function mousePressed() {
    golfStick.pressGolfStick();
}

function mouseReleased() {
    golfStick.releaseGolfStick();
}