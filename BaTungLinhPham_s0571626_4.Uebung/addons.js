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
    rect(pgPoints[8][0] * s, pgPoints[7][1] * s, (pgPoints[5][0] - pgPoints[8][0]) * s, 0.9 * (pgPoints[5][1] - pgPoints[6][1]) * s);

    // Playground
    fill(100, 50, 0);
    beginShape();
    for (var i = 0; i < pgPoints.length; i++)
        vertex(pgPoints[i][0] * s, pgPoints[i][1] * s);
    endShape();

    //Pitch
    push();
    strokeWeight(5);
    noFill();
    push();
    stroke(0, 200, 0);
    beginShape();
    for (var i = 1; i < 6; i++)
        vertex(pgPoints[i][0] * s, pgPoints[i][1] * s);
    endShape();
    line(pgPoints[8][0] * s, pgPoints[8][1] * s, pgPoints[9][0] * s, pgPoints[9][1] * s);
    pop();

    //Sand
    push();
    stroke(200, 200, 0);
    beginShape();
    for (var i = 12; i < 15; i++)
        vertex(pgPoints[i][0] * s, pgPoints[i][1] * s);
    endShape();
    pop();
    pop();
}

function resetBallState() {
    xBall = 0;
    yBall = dBall / 2;
    moveBall = false;
}

function shotBall() {
    if (moveBall && xBall >= pgPoints[2][0]) {
        xBall = xBall - t * ballSpeed;
    }

    if (xBall == pgPoints[2][0]) {
        moveBall = false;
    }
}