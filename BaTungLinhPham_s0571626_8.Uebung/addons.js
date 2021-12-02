/** GTAT2 Game Technology & Interactive Systems **/
/** 6. Übung  **/
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
    v0 = v;
    speedUp = false;
    totalAttempts = 0;
    totalHoles = 0;
    score = false;
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
        sx = xBall; //last position
        //1st plane
        if (xBall > pgPoints[2][0] && xBall <= pgPoints[1][0]) {
            speedUp = false; //speed is reducing in inclined plane
            applyRollingFriction(CrGrass, 0);
            applyFlowFriction(v0);
            //v = 0 ->STOP
            if (v0 >= 0) {
                v0 = v0 - g_ * dt;
            }

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
            applyRollingFriction(CrGrass, rad);
            applyFlowFriction(v0);

            //v<=0 -> change direction + speed increasing
            if (v0 >= 0 && !speedUp) {
                v0 = v0 - g_ * dt;
            } else {
                speedUp = true;
                v0 = v0 + g_ * dt;
            }

            //movement from the right to the left
            if (dir == 1) {
                xBall = sx - dt * v0;
            }
            //movement from the left to the right
            else if (dir == -1) {
                xBall = sx + dt * v0;
            }
            yBall = sy - (xBall - sx1) * tan(rad);
        }
        //after 1st slope
        else if (xBall <= pgPoints[3][0]) {
            t = t + dt;
            applyFlowFriction(v0);
            v0x = v0 * cos(rad);
            v0y = v0 * sin(rad);
            //if the ball fall into the water hole
            if (yBall < pgPoints[5][1] && xBall <= pgPoints[5][0] && xBall > pgPoints[8][0]) {
                if (xBall <= pgPoints[8][0] || yBall >= pgPoints[6][1] + dBall / 2) {
                    xBall = sx;
                    yBall = pgPoints[6][1] + dBall / 2;
                } else {
                    xBall = sx2 - v0x * t;
                    if (xBall <= pgPoints[8][0]) {
                        xBall = pgPoints[7][0] + dBall / 2;
                    }
                    yBall = sy2 - g * sq(t) / 2 + v0y * t;
                }
            }
            //if the ball fall into the hole
            else if (yBall < pgPoints[9][1] && xBall <= pgPoints[9][0] && xBall > pgPoints[12][0]) {
                if (!score) {
                    totalHoles++;
                    score = true;
                }
                if (xBall <= pgPoints[12][0] || yBall >= pgPoints[10][1] + dBall / 2) {
                    xBall = sx;
                    yBall = pgPoints[10][1] + dBall / 2;
                } else {
                    xBall = sx2 - v0x * t;
                    if (xBall <= pgPoints[12][0]) {
                        xBall = pgPoints[12][0] + dBall / 2;
                    }
                    yBall = sy2 - g * sq(t) / 2 + v0y * t;
                }
            } else {
                xBall = sx2 - v0x * t;
                yBall = sy2 - g * sq(t) / 2 + v0y * t;
            }
        }

        //ball reach the end of the right side
        if (xBall > pgPoints[1][0]) {
            START = false;
        }

        console.log("Current Speed: " + v0);
    }
}

function applyRollingFriction(Cr, rad) {
    if (!speedUp) {
        g_ = g * sin(rad) + Cr * g * cos(rad);
    } else {
        g_ = g * sin(rad) - Cr * g * cos(rad);
    }
}

function applyFlowFriction(v) {
    g_ = g_ - cw * p * 2 * Math.PI * dBall * dBall * v * v / 2;
}