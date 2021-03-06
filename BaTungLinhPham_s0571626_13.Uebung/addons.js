/** GTAT2 Game Technology & Interactive Systems **/
/** 13. Übung  **/
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
    dPutter = 0.08;
    lengthPutter = 3 * dPutter;
    sx0 = 0;
    sy0 = 0;
    sx = 1;
    sx1 = pgPoints[2][0];
    sx2 = pgPoints[3][0];
    sx3 = pgPoints[13][0];
    sy = dBall / 2 + 0.8 * dPutter;
    sy2 = pgPoints[3][1] + sy;
    xBall = 0;
    yBall = dBall / 2 + 0.8 * dPutter;
    START = false;
    t = 0;
    dragging = false;
    dragged = false;
    vStick = 0;
    sxStick = 0;
    syStick = 0;
    hitTheBall = false;
    initialized = false;
    v0 = 0;
    g0_ = 0;
    speedUp = false;
    score = false;
    vWind = generateRandomWindSpeed(vWindMax);
    totalAttempts++;
    normalAngle = 0;
    directionAngle = 0;
    rolling = false;
    hit = false;
}

function getDirection(current, last) {
    if (hit) {
        return 1;
    } else {
        if (current < last) {
            return 1;
        } else if (current == last) {
            return 0;
        } else if (current > last) {
            return -1;
        }
    }
}

function shotBall() {
    if (START) {
        if (!rolling) {
            flyMode();
        } else {
            rollingMode();
        }
        checkScore();
    }
}

function flyMode() {
    t = t + dt;
    v0x = v0x - (dt * cw * p * 2 * Math.PI * sq(dBall) * (v0x - vWind) * sqrt(sq(v0x - vWind) + sq(v0y))) / 2 / mBall;
    v0y = v0y - (dt * cw * p * 2 * Math.PI * sq(dBall) * v0y * sqrt(sq(v0x - vWind) + sq(v0y))) / 2 / mBall;

    v0 = sqrt(sq(v0x) + sq(v0y));
    xBall = sx0 - v0x * dt;
    yBall = sy + v0y * dt - g * (sq(t) - sq(t - dt)) / 2;
    sx0 = xBall;
    sy = yBall;
    hitTheGround();
}

function rollingMode() {
    var dir = getDirection(xBall, sx);
    sx = xBall; //last position
    //1st plane
    if (xBall > pgPoints[2][0] && xBall <= pgPoints[1][0]) {
        speedUp = false;
        applyRollingFriction(CrGrass, 0);
        if (v0 >= 0) {
            v0 = v0 - g_ * dt;
        }
        if (dir == 1) {
            xBall = sx - dt * v0;
        } else if (dir == -1) {
            xBall = sx + dt * v0;
        }
        yBall = dBall / 2;
    }

    //1st slope 
    else if (xBall <= pgPoints[2][0] && xBall > pgPoints[3][0]) {
        applyRollingFriction(CrGrass, radA);
        if (v0 >= 0 && !speedUp) {
            v0 = v0 - g_ * dt;
        } else {
            speedUp = true;
            v0 = v0 + g_ * dt;
        }
        if (dir == 1) {
            xBall = sx - dt * v0;
        } else if (dir == -1) {
            xBall = sx + dt * v0;
        }

        yBall = sy0 - (xBall - sx1) * tan(radA);
    }

    //2nd slope
    else if (xBall <= pgPoints[3][0] && xBall > pgPoints[4][0]) {
        speedUp = true;
        applyRollingFriction(CrGrass, Math.PI - radB);
        v0 = v0 + g_ * dt;
        xBall = sx - dt * v0;
        yBall = sy2 + (xBall - sx2) * tan(radB);
    }

    //2nd plane
    else if (xBall <= pgPoints[4][0] && xBall > pgPoints[5][0]) {
        speedUp = false;
        applyRollingFriction(CrGrass, 0);
        if (v0 >= 0) {
            v0 = v0 - g_ * dt;
        }
        xBall = sx - dt * v0;
        yBall = dBall / 2;
    }

    //water
    else if (xBall <= pgPoints[5][0] && xBall > pgPoints[8][0]) {
        yBall = pgPoints[6][1] + dBall / 2;
        START = false;
    }

    //3rd plane
    else if (xBall <= pgPoints[8][0] && xBall > pgPoints[9][0]) {
        speedUp = false;
        applyRollingFriction(CrGrass, 0);
        if (v0 >= 0) {
            v0 = v0 - g_ * dt;
        }
        xBall = sx - dt * v0;
        yBall = dBall / 2;
    }

    //hole
    else if (xBall <= pgPoints[9][0] && xBall > pgPoints[12][0]) {
        yBall = pgPoints[10][1] + dBall / 2;
        START = false;
    }

    //4th plane
    else if (xBall <= pgPoints[12][0] && xBall > pgPoints[13][0]) {
        speedUp = false;
        applyRollingFriction(CrGrass, 0);
        if (v0 >= 0) {
            v0 = v0 - g_ * dt;
        }
        if (dir == 1) {
            xBall = sx - dt * v0;
        } else if (dir == -1) {
            xBall = sx + dt * v0;
        }
        yBall = dBall / 2;
    }

    //3rd slope
    else if (xBall <= pgPoints[13][0] && xBall > pgPoints[14][0]) {
        applyRollingFriction(CrGrass, radC);
        speedUp = true;
        v0 = v0 + g_ * dt;
        if (dir == 1) {
            xBall = sx - dt * v0;
        } else if (dir == -1) {
            xBall = sx + dt * v0;
        }
        yBall = sy0 - (xBall - sx3) * tan(radC);
    }

    if (xBall > pgPoints[1][0]) {
        START = false;
    }
}

function checkScore() {
    if (START == false && xBall <= pgPoints[9][0] && xBall >= pgPoints[12][0]) {
        totalHoles++;
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

function hitTheGround() {
    for (let i = 0; i < pgPoints.length - 1; i++) {
        initVector(pgPoints[i][0], pgPoints[i][1], pgPoints[i + 1][0], pgPoints[i + 1][1], xBall, yBall);
        d = vecS.cross(vecO).mag() / vecS.mag();
        lPath = vecS.dot(vecO) / vecS.mag();
        lSegment = Math.sqrt(Math.pow(pgPoints[i][0] - pgPoints[i + 1][0], 2) + Math.pow(pgPoints[i][1] - pgPoints[i + 1][1], 2));
        if (lPath >= 0 && lPath <= lSegment) {
            vecP = vecS.div(Math.sqrt(Math.pow(pgPoints[i][0], 2) + Math.pow(pgPoints[i][1], 2))).mult(lPath);
            if (d <= dBall) {
                rolling = true;
                normalAngle = Math.atan(yBall - pgPoints[i][1], yBall - pgPoints[i][0]);
                getBallSpeedAfterGroundCollision();
            }
        }
    }
}

function getBallSpeedAfterGroundCollision() {
    directionAngle = Math.atan(v0y / v0x);

    //plane
    if ((xBall > pgPoints[2][0] && xBall <= pgPoints[1][0]) ||
        (xBall <= pgPoints[4][0] && xBall > pgPoints[5][0]) ||
        (xBall <= pgPoints[8][0] && xBall > pgPoints[9][0]) ||
        (xBall <= pgPoints[12][0] && xBall > pgPoints[13][0])) {
        v0 = v0 * Math.sin(directionAngle);
        v0 = abs(v0);
    }
    //positive slope 
    else if ((xBall <= pgPoints[2][0] && xBall > pgPoints[3][0]) ||
        (xBall <= pgPoints[13][0] && xBall > pgPoints[14][0])) {
        v0 = -abs(v0);
        hit = true;
    }
    //negative slope
    else if (xBall <= pgPoints[3][0] && xBall > pgPoints[4][0]) {
        v0 = v0 * Math.sin(normalAngle - directionAngle);
    }
}

function initVector(pix, piy, pi1x, pi1y, pObjx, pObjy) {
    vecO = createVector(pObjx - pix, pObjy - piy);
    vecS = createVector(pi1x - pix, pi1y - piy);
}

function getAngleBetween(x1, y1, x2, y2, x3, y3, x4, y4) {
    var vec1 = createVector(x1 - x2, y1 - y2);
    var vec2 = createVector(x3 - x4, y3 - y4);
    var angle = vec2.angleBetween(vec1);
    if (angle < Math.PI / 2) {
        return angle;
    } else {
        return Math.PI - angle;
    }
}

function toDegree(radians) {
    return radians * (180 / Math.PI);
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
        if (dragging && (mouseX - x0) >= this.x1 && -(mouseY - y0) >= 0 && -(mouseY - y0) <= 3 * this.diameter) {
            sxStick = (mouseX - x0) + this.offsetX;
            syStick = -(mouseY - y0) - this.offsetY;
        }

        if (abs(h) < hitDistance && abs(d) <= hitDistance && dragged && !initialized) {
            vStick = abs(vStick * 0.01);
            hitTheBall = true;
            initialized = true;
            this.calculateStartSpeed();
            START = true;
        }

        if (dragged) {
            if (sxStick >= this.x1 && !hitTheBall) {
                vStick = vStick - (2 * vStick + sq(omega) * sxStick) * dt
            } else {
                vStick = vStick - (2 * attenuation * vStick + sq(omega) * sxStick) * dt
            }
        }

        sxStick = sxStick + vStick * dt;
        h = yBall * M - syStick;
        d = sxStick - this.x1;
        //Draw
        strokeWeight(2);
        line(sxStick, syStick, sxStick, this.y2);
        fill(putterColor);
        strokeWeight(1);
        ellipse(sxStick, syStick, this.diameter);
    }

    pressGolfStick() {
        if (mouseX > sxStick + x0 - dPutter * M / 2 &&
            mouseX < sxStick + x0 + dPutter * M / 2 &&
            mouseY > this.y1 + y0 - 3 * dPutter * M / 2 &&
            mouseY < this.y1 + y0 - dPutter * M / 2 && !dragged) {
            dragging = true;
            this.offsetX = sxStick - (mouseX - x0);
            this.offsetY = syStick + (mouseY - y0);
        }
    }

    releaseGolfStick() {
        if (dragging) {
            dragged = true;
            dragging = false;
        }
    }

    calculateStartSpeed() {
        var sinBeta = h / hitDistance;
        var cosBeta = sqrt(1 - sq(sinBeta));
        var v1Z = vStick * cosBeta;
        //after collision
        var v2Z_ = (2 * mStick * v1Z) / (mStick + mBall);
        var v2T_ = 0;
        v0x = v2T_ * sinBeta + v2Z_ * cosBeta;
        v0y = -v2T_ * cosBeta + v2Z_ * sinBeta;
    }
}