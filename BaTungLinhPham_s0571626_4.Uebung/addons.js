/** GTAT2 Game Technology & Interactive Systems **/
/** 3. Übung  **/
/** Implementation based on 2. Übung-Lösung from Dr.-Ing. V. Naumburger*/
/************************************************************************************/

/* Playground Point Collection*/
var pgPoints = [
    [0.82, -0.3], // 0 
    [0.82, 0], // 1 
    [-1.2, 0], // 2
    [-2.1, 0.4], // 3
    [-3.0, 0], // 4
    [-3.4, 0], // 5
    [-3.43, -0.2], // 6
    [-4.0, -0.2], // 7
    [-4.03, 0], // 8
    [-4.9, 0], // 9
    [-4.9, -0.2], // 10
    [-5.1, -0.2], // 11
    [-5.1, 0], // 12
    [-5.7, 0], // 13
    [-6.56, 0.9], // 14
    [-6.56, -0.3], // 15			
];

var fontSize;

var normPixel, normPixelX, normPixelY;
var grid, gridX, gridY;
var buttonWidth, buttonHeight;

function evaluateConstants() {
    normPixelX = width / 1000.0;
    normPixelY = height / 1000.0;
    normPixel = sqrt(normPixelX * normPixelY);
    fontSize = 12 * normPixel;

    /* Raster 100 x100 */
    gridX = width / 100.0;
    gridY = height / 100.0;
    grid = sqrt(gridX * gridY);
    buttonWidth = 9 * gridX;
    buttonHeight = 6 * grid;
}

function playGround() {
    //Water hole
    fill(0, 0, 200);
    rect(pgPoints[8][0] * M, pgPoints[7][1] * M, (pgPoints[5][0] - pgPoints[8][0]) * M, 0.9 * (pgPoints[5][1] - pgPoints[6][1]) * M);

    // Playground
    fill(100, 50, 0);
    beginShape();
    for (var i = 0; i < pgPoints.length; i++)
        vertex(pgPoints[i][0] * M, pgPoints[i][1] * M);
    endShape();

    //Pitch
    push();
    strokeWeight(5);
    noFill();
    push();
    stroke(0, 200, 0);
    beginShape();
    for (var i = 1; i < 6; i++)
        vertex(pgPoints[i][0] * M, pgPoints[i][1] * M);
    endShape();
    line(pgPoints[8][0] * M, pgPoints[8][1] * M, pgPoints[9][0] * M, pgPoints[9][1] * M);
    pop();

    //Sand
    push();
    stroke(200, 200, 0);
    beginShape();
    for (var i = 12; i < 15; i++)
        vertex(pgPoints[i][0] * M, pgPoints[i][1] * M);
    endShape();
    pop();
    pop();
}

function resetBallState() {
    xBall = 0;
    yBall = dBall / 2;
    moveBall = false;
    t = 0;
    s = 1;
}

function getBallPos() {
    if (xBall > pgPoints[2][0] && xBall <= pgPoints[1][0]) {
        state = 1;
    } else if (xBall > pgPoints[3][0] && xBall <= pgPoints[2][0]) {
        state = 2;
    } else {
        state = 0;
    }
}

function getDirection() {
    if (xBall < s) {
        return 1;
    } else if (xBall = s) {
        return 0;
    } else if (xBall > s) {
        return -1;
    }
}

function shotBall() {
    if (moveBall) {
        var dir = getDirection();
        s = xBall;

        if (state == 1) {
            if (dir == 1) {
                xBall = s - dt * v0;
            } else {
                xBall = s + dt * v0;
            }
            yBall = dBall / 2;
        } else if (state == 2) {
            t = t + dt;
            xBall = s1 - t * v0 + g_ * sq(t) / 2;
            yBall = dBall / 2 - (xBall - s1) * tan(rad);
        } else {
            moveBall = false;
        }
    }
}