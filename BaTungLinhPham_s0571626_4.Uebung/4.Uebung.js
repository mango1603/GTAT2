/** GTAT2 Game Technology & Interactive Systems **/
/** 3. Übung  **/
/** Implementation based on 2. Übung-Lösung from Dr.-Ing. V. Naumburger*/
/************************************************************************************/

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M; // scale
var x, y; // Coordinate

var basicLength = 5; // [m]
var bodyHeight = 1.8; //  [m]
var playgroundWidth = basicLength * 23.9 / 16.9; // [m]

var xBall, yBall; // golf ball
var dBall = 0.1; // ball diameter in [m]
var ballColor = "#aaaa00"; //ball color
var v0 = 2.0; // [m/s]
var moveBall = false;

var newBtnXPos, newBtnYPos;
var resetBtnXPos, resetBtnYPos;

const fps = 60;
var dt, dt;
const g = 9.81;
var s, del;

function setup() { /* prepare program */
    frameRate(fps);
    createCanvas(windowWidth, windowHeight);
    evaluateConstants();

    M = 0.85 * canvasWidth / playgroundWidth
    x = 25.0 * canvasWidth / 29.7;
    y = 15.3 * canvasHeight / 21.0;

    newBtnXPos = 80 * gridX;
    newBtnYPos = 90 * gridY;

    resetBtnXPos = 10 * gridX;
    resetBtnYPos = 90 * gridY;
    dt = 1 / fps;

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
    if (moveBall) {
        if (xBall >= pgPoints[2][0]) {
            t = t + dt;
            xBall = -t * v0;
        } else if (xBall >= pgPoints[3][0] && xBall < pgPoints[2][0]) {

        }
    }




    /* display */

    //Playground
    push();
    translate(x, y);
    scale(1, -1);
    playGround();

    //Golf ball
    fill(ballColor);
    //shotBall();
    ellipse(xBall * M, yBall * M, dBall * M);


    push();
    translate(x, y);
    push();
    // translate(x0, y0);
    // s = Math.sqrt(Math.pow(xBall, 2) + Math.pow(yBall, 2));
    // del = Math.atan(yBall / xBall);
    // rotate(del);
    // xBall = s * Math.cos(del);
    // yBall = s * Math.sin(del);
    ellipse(xBall * M, yBall * M, dBall * M);
    // ellipse();
    // pop();
    // // pop();
    //s= 
    // xBall = s * cosB;
    // yBall = s * sinB;


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

function mouseClicked() {
    if (mouseX > newBtnXPos &&
        mouseX < newBtnXPos + buttonWidth &&
        mouseY > newBtnYPos &&
        mouseY < newBtnYPos + buttonHeight) {
        moveBall = true;
    }
    if (mouseX > resetBtnXPos &&
        mouseX < resetBtnXPos + buttonWidth &&
        mouseY > resetBtnYPos &&
        mouseY < resetBtnYPos + buttonHeight) {
        resetBallState();
    }
}