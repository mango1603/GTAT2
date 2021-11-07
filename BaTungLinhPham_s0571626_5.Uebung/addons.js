/** GTAT2 Game Technology & Interactive Systems **/
/** 5. Übung  **/
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
    sx = 1;
    sx1 = pgPoints[2][0];
    sx2 = pgPoints[3][0];
    sy = dBall / 2;
    sy2 = pgPoints[3][1] + sy;
    xBall = 0;
    yBall = dBall / 2;
    START = false;
    t = 0;
    t2 = 0;
}

function getDirection(current, last) {
    if (current < last) {
        return 1;
    } else if (current == last) {
        return 0;
    } else if (current > last) {
        return -1;
    }
}

function shotBall() {
    if (START) {
        var dir = getDirection(xBall, sx);
        sx = xBall;
        v1x = v1 * cos(rad);
        v1y = v1 * sin(rad);
        console.log(v1);

        //1st plane
        if (xBall > pgPoints[2][0] && xBall <= pgPoints[1][0]) {
            //movement from the right to the left
            if (dir == 1) {
                xBall = sx - dt * v0;
            }
            //movement from the left to the right
            else if (dir == -1) {
                xBall = sx + dt * v0;
            }
            yBall = dBall / 2;
        }
        //1st slope 
        else if (xBall <= pgPoints[2][0] && xBall > pgPoints[3][0]) {
            t = t + dt;
            v = g_ * t / 2 - v0;
            v1 = Math.abs(v);
            xBall = sx1 + t * v;
            yBall = sy - (xBall - sx1) * tan(rad);
        }
        //after 1st slope
        else if (xBall <= pgPoints[3][0]) {
            t2 = t2 + dt;
            xBall = sx2 - v1x * t2;
            yBall = sy2 - g * sq(t2) / 2 + v1y * t2;
        }
        //ball reach the end of the right side
        if (xBall > pgPoints[1][0]) {
            START = false;
        }
    }
}


//kart. to intern
function kXi(a) {
    return (a + x0);
}

function kYi(b) {
    return (y0 - b);
}

//intern to kart
function iXk(a) {
    return (a - x0);
}

function iYk(b) {
    return (y0 - b);
}