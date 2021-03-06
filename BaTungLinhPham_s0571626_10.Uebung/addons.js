/** GTAT2 Game Technology & Interactive Systems **/
/** 10. Übung  **/
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

    //Frag Stick
    push();
    stroke(0, 0, 0);
    strokeWeight(5);
    beginShape();
    vertex(-5.3 * M, 0);
    vertex(-5.3 * M, 1.3 * M);
    endShape();
    pop();

    //Frag
    push();
    strokeWeight(2);
    stroke(0, 0, 250);
    fill(250, 250, 0);
    beginShape();
    vertex(-5.3 * M, 1.25 * M);
    vertex(-5.3 * M, 1.05 * M);
    vertex((-5.3 - 0.6 * (vWind / vWindMax)) * M, 1.15 * M);
    vertex(-5.3 * M, 1.25 * M);
    endShape();
    pop();
}

function resetBallState() {
    newBallState();
    totalAttempts = 0;
    totalHoles = 0;
}

function newBallState() {
    sx = 1;
    sx1 = pgPoints[2][0];
    sx2 = pgPoints[3][0];
    sy = dBall / 2;
    sy2 = pgPoints[3][1] + sy;
    xBall = 0;
    yBall = dBall / 2;
    START = false;
    t = 0;
    dragging = false;
    dragged = false;
    vStick = 0;
    sStick = 0;
    hitTheBall = false;
    initialized = false;
    v0 = 0;
    g_ = g * sin(rad);
    g0_ = 0;
    speedUp = false;
    score = false;
    vWind = generateRandomWindSpeed(vWindMax);
    totalAttempts++;
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
            //calculate speed
            applyRollingFriction(CrGrass, 0);
            //v = 0 ->STOP
            if (v0 >= 0) {
                v0 = v0 - g_ * dt;
            }

            //calculate position
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
            //calculate speed
            applyRollingFriction(CrGrass, rad);
            //v<=0 -> change direction + speed increasing
            if (v0 >= 0 && !speedUp) {
                v0 = v0 - g_ * dt;
            } else {
                speedUp = true;
                v0 = v0 + g_ * dt;
            }

            //calculate position
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
            //calculate speed
            //apply flow friction 
            v0x = v0 * cos(rad);
            v0y = v0 * sin(rad);
            v0 = sqrt(sq(v0x - vWind) + sq(v0y));

            v0x = v0x - dt * cw * p * 2 * Math.PI * sq(dBall) * (v0x - vWind) * v0 / 2 / mBall;
            v0y = v0y - dt * cw * p * 2 * Math.PI * sq(dBall) * v0y * v0 / 2 / mBall;

            v0 = sqrt(sq(v0x) + sq(v0y));
            //special cases
            //if the ball fall into the water hole
            if (yBall < pgPoints[5][1] && xBall <= pgPoints[5][0] && xBall > pgPoints[8][0]) {
                if (xBall <= pgPoints[8][0] || yBall >= pgPoints[6][1] + dBall / 2) {
                    xBall = sx;
                    yBall = pgPoints[6][1] + dBall / 2;
                } else {
                    xBall = sx2 - v0x * dt;
                    if (xBall <= pgPoints[8][0]) {
                        xBall = pgPoints[7][0] + dBall / 2;
                    }
                    yBall = sy2 + v0y * dt - g * (sq(t) - sq(t - dt)) / 2;
                }
            }
            //if the ball fall into the hole
            else if (yBall < pgPoints[9][1] && xBall <= pgPoints[9][0] && xBall > pgPoints[12][0]) {
                //SCORE
                if (!score && yBall > pgPoints[10][1]) {
                    totalHoles++;
                    score = true;
                }
                //position in hole
                if (xBall <= pgPoints[12][0] || yBall >= pgPoints[10][1] + dBall / 2) {
                    xBall = sx;
                    yBall = pgPoints[10][1] + dBall / 2;
                } else {
                    xBall = sx2 - v0x * dt;
                    if (xBall <= pgPoints[12][0]) {
                        xBall = pgPoints[12][0] + dBall / 2;
                    }
                    yBall = sy2 + v0y * dt - g * (sq(t) - sq(t - dt)) / 2;
                }
            }
            //ball flying
            else {
                xBall = sx2 - v0x * dt;
                yBall = sy2 + v0y * dt - g * (sq(t) - sq(t - dt)) / 2;
            }
            sx2 = xBall;
            sy2 = yBall;
        }

        //ball reach the end of the right side
        if (xBall > pgPoints[1][0]) {
            START = false;
        }
    }
}

function applyRollingFriction(Cr, rad) {
    if (!speedUp) {
        g_ = g * sin(rad) + Cr * g * cos(rad);
    } else {
        g_ = g * sin(rad) - Cr * g * cos(rad);
    }
}

function generateRandomWindSpeed(threshold) {
    return (Math.random() * threshold * 2 - threshold);
}

function getRacketSpeed() {

}

class GolfStick {
    constructor(x1, y1, x2, y2, diameter) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.diameter = diameter;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    drawGolfStick() {
        if (dragging && (mouseX - x0) >= this.x1) {
            sStick = (mouseX - x0) + this.offsetX;
        }

        if (sStick < this.x1 && dragged && !initialized) {
            hitTheBall = true;
            initialized = true;
            v0 = Math.abs(vStick * 0.01) * 2;
            START = true;
        }

        if (dragged) {
            if (sStick >= this.x1 && !hitTheBall) {
                vStick = vStick - (2 * vStick + sq(omega) * sStick) * dt
            } else {
                vStick = vStick - (2 * attenuation * vStick + sq(omega) * sStick) * dt
            }
        }
        sStick = sStick + vStick * dt;

        //Draw
        strokeWeight(2);
        line(sStick, this.y1, sStick, this.y2);
        fill(putterColor);
        strokeWeight(1);
        ellipse(sStick, this.y1, this.diameter);
    }

    pressGolfStick() {
        if (mouseX > sStick + x0 - dPutter * M / 2 &&
            mouseX < sStick + x0 + dPutter * M / 2 &&
            mouseY > this.y1 + y0 - 3 * dPutter * M / 2 &&
            mouseY < this.y1 + y0 - dPutter * M / 2 && !dragged) {
            dragging = true;
            this.offsetX = sStick - (mouseX - x0);
        }
    }

    releaseGolfStick() {
        if (dragging) {
            dragged = true;
            dragging = false;
        }
    }
}