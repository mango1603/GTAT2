/**************************************************/
/* Autor:  Dr. Volkmar Naumburger                 */
/*                                                */
/* Schräger Wurf                                  */
/* Lösung der DGl. nach EULER-CAUCHY              */
/* Stand: 14.08.2019                              */
/*                                                */
/* v0.0: Umstellung auf p5.js                     */
/**************************************************/

/* Zweck: Darstellung der physikalisch korrekten Bewegung eines
Objektes, Eingabe Anfangsgeschwindigkeit und Startwinkel */

/* Variablendeklaration */
var vVector; // Vektor der Startgeschwindigkeit
var x_Axis, y_Axis; // Koordinatensystem

var parameterX = []; // Zwischenspeicherung der Parameter x, y und t
var parameterY = [];
var parameterT = [];
var i, iMax = 0; // Index und max. Anzahl der Parameter pro Darstellungsfenster
var j = 0; // Fensterzähler

var M; // dyn. Maßstab
var x, vx; // Objektkoordinaten
var y, vy;
var vx0 = 14; // Startgeschwindigkeit m/s
var vy0 = 25;
var normV = 1; // Normierung des Startgeschwindigkeitsvektors
var t = 0; // Zeit
var dt; // Zeitquant - wird auf die Bildwechselrate bezogen
var frmRate; // Fliesskommadarstellung für Kehrwertbildung notwendig!

var d = 1.0; // Kugeldurchmesser 1 m
var xMax = 80; // max. Länge 100 m
var yMax = 40; // max. Höhe 40 m

var x0e, y0e; // Mittelpunkt der Ellipse
var r; // Hauptachsen der Ellipse (d.h. halbe Breite und Höhe !!!)
var g = 9.81;


//*********** die folgenden Variablen sind Pflicht! *********************/
var result;
var canvas;
var canvasID = "pGrund_0024"; // ist eine Variable!!!

function setup() {
    mediaType = getMediaType();
    canvas = createCanvas(930, height);
    canvas.parent(canvasID);
    touchEvents = document.getElementById(canvasID);

    evaluateConstants(85, 90); // Deklarierung wichtiger Parameter und Konstanten
    backgroundColor = '#a8a8ff'; // Hintergrundfarbe
    textColor = manageColor(backgroundColor)[1]; // Textfarbe für numerische Angaben

    xi0 = 0.1 * width; // Koordinatenursprung
    yi0 = 4 * height / 5;

    M = 0.8 * width / xMax; // dynamischer Maßstab
    frmRate = 60;
    frameRate(frmRate);
    dt = 1.0 / frmRate;

    vVector = new Arrow(M, normV, '#0000ff');
    x_Axis = new Xaxis(0, 0, xMax, 0, 6, M, " m", 'u'); //xPos, yPos, xMax, xMin, intervalls, scale, unitName, position
    y_Axis = new Yaxis(0, 0, yMax, 0, 4, M, " m", 'l'); //xPos, yPos, yMax, yMin, intervalls, scale, unitName, position
}

function draw() {
    background(backgroundColor);
    startProgram();
    //****************************************** Administration ********************************************
    // Hier wird in Pixeln gerechnet!
    prepareScreen("Schräger Wurf", "parametrische Darstellung von P(x,y), wobei x=f(t) und y=f(t)", 0, 50, 7);
    displayLine("t: " + formatNumber(t, 1, 2) + " s", 0, "LEFT", 70, 20); // strng, c, align, xPos, yPos
    displayLine("vx0: " + vx0 + " m/s    vy0: " + vy0 + " m/s", 0, "LEFT", 70, 25);

    //*************************************** Berechnung der Bewegung ***************************************		
    if (START) {
        result = vVector.moveArrow(0, 0, vx0, vy0); // Startgeschwindigkeitsvektor
        vx0 = result[1];
        vy0 = result[2];
        x = 0; // Startbed. einstellen
        vx = vx0;
        y = 0;
        vy = vy0;

        if (INIT) {
            t = 0;
            iMax = 0;
            j = 0;
            dt = 1.0 / frmRate;
            INIT = true;
            START = false; // Rücksetzen der einmaligen Startbedingung
        }
    } else {
        /* Berechnung der Zeitfunktion */
        vy = vy - g * dt;
        y = y + vy * dt;
        if (y <= d / 2 && vy <= 0) // bei Bodenberührung keine y-Bewegung mehr möglich
        {
            vy = 0;
            y = d / 2;
        }
        x = x + vx * dt;

        if (endProgram(x >= xMax))
            dt = 0;
        else {
            dt = 1 / frmRate;
            if (j++ == 25) // jeder 25. Wert wird gespeichert
            {
                parameterT[iMax] = t;
                parameterX[iMax] = x;
                parameterY[iMax] = y;
                iMax++;
                j = 0;
                console.log(j + " " + iMax + " " + t);
            }
            t = t + dt;
        }
    }

    //****************************************** Darstellung ************************************************
    // Hier wird in Metern gerechnet!
    stroke(0);
    x_Axis.drawXaxis();
    y_Axis.drawYaxis();
    fill(255, 255, 0);
    stroke(0);
    ellipse(kXi(x * M), kYi(y * M), d * M, d * M); // Objekt
    fill(0);

    for (i = 0; i < iMax; i++) { // Zeitpunkt markieren
        fill('#005500');
        noStroke();
        ellipse(kXi(parameterX[i] * M), kYi(parameterY[i] * M), 5, 5);
        fill(0);
        text("P(" + formatNumber(i, 1, 0) + ")", kXi(parameterX[i] * M), kYi(50 * normPixel + parameterY[i] * M));
        text("t:" + formatNumber(parameterT[i], 1, 2) + " s", kXi(parameterX[i] * M), kYi(35 * normPixel + parameterY[i] * M));
        text("x:" + formatNumber(parameterX[i], 1, 2) + " m", kXi(parameterX[i] * M), kYi(20 * normPixel + parameterY[i] * M));
        text("y:" + formatNumber(parameterY[i], 1, 2) + " m", kXi(parameterX[i] * M), kYi(5 * normPixel + parameterY[i] * M));
    }
}