/** GTAT2 Game Technology & Interactive Systems **/
/** 3. Übung  **/
/** Implementation based on 2. Übung-Lösung from Dr.-Ing. V. Naumburger*/
/************************************************************************************/

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var s; // scale
var x, y; // Coordinate

var basicLength = 5; // [m]
var bodyHeight = 1.8; //  [m]
var playgroundWidth = basicLength * 23.9 / 16.9; // [m]

var xBall, yBall; // golf ball
var dBall = 0.1; // ball diameter in [m]
var ballColor = "#aaaa00"; //ball color
var ballSpeed = 3.6; // [m/s]
var moveBall = false;

var newBtnXPos, newBtnYPos;
var resetBtnXPos, resetBtnYPos;

const fps = 60;
var t; // frame duration

function setup() { /* prepare program */
    frameRate(fps);
    createCanvas(windowWidth, windowHeight);
    evaluateConstants();

    s = 0.85 * canvasWidth / playgroundWidth
    x = 25.0 * canvasWidth / 29.7;
    y = 15.3 * canvasHeight / 21.0;

    newBtnXPos = 80 * gridX;
    newBtnYPos = 90 * gridY;

    resetBtnXPos = 10 * gridX;
    resetBtnYPos = 90 * gridY;

    t = 1 / fps;

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
    translate(x, y);
    scale(1, -1);
    playGround();

    //Golf ball
    fill(ballColor);
    shotBall();
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