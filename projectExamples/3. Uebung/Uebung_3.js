/******************************* 2. Übung *******************************************/
/* Autor: Dr.-Ing. V. Naumburger	                                                */
/* Datum: 14.10.2021                                                                */
/************************************************************************************/

/*************************** Variablendeklaration ***********************************/
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M;											// Maßstab
var xi0, yi0;                                	// Koordinatenursprung intern
var basicLength = 5;							// Grundlänge in [m]
var bodyHeight = 1.8;							// Körpergröße in [m]
var playgroundWidth = basicLength*23.9/16.9;	// Playgroundbreite in [m]

var x0, y0;										// Koordinatenursprung	
var frmRate = 60;      							// Screen-Refreshrate 
var t, dt;                						// Zeitvariable, Increment der Zeitv.

var xBall, yBall;								// Golfball
var dBall = 0.1;								// Balldurchmesser real: 3,2cm => 0.032m
var colorBall = "#aaaa00";	
var vxBall, vyBall;								// Ballgeschwindigkeit
var vx0Ball = -3.6; 							// -3,6 m/s --> Startgeschwindigkeit 300 km/h = 300/3,6 m/s
var vy0Ball = 0;

var xPutter, yPutter;							// Golfschläger (Putter)
var gammaPutter = 0;							// Winkel des Golfschlägers
var lengthPutter = 0.35*bodyHeight;
var dPutter = 0.1;								// Durchmesser Golfschläger real: 3,2cm => 0.032m
var colorPutter = "#aaaaaa";	

var NewTrial, newTrial = false;					// Push-Button ""neuer Versuch", Variable
var Reset, reset, START, INIT;					// Reset-Button, Variable, Start der Bewegungsberechnung

var Putter, putter;								// Schläger, Maus sensibel

function setup() {								/* prepare program */
  	createCanvas(windowWidth, windowHeight);
	evaluateConstants(90, 90);					// Erzeuge elementare Konstanten
	M = 0.85*canvasWidth/playgroundWidth; 		// dynamischer Maßstab
	
	xi0 = 25.0*canvasWidth/29.7;				// Koordinatenursprung (willkürlich gewählt)
	yi0 = 15.3*canvasHeight/21.0;

	frameRate(frmRate); 						// setzen der Bildwechselfrequenz
	
	// Objectdeclarations
	NewTrial = new PushButton(80, 90, "NEW", '#00ff00', true);		// xPos, yPos, onName, onColor, modus
	Reset = new PushButton(10, 90, "Reset", '#ff0000', true);	
	START = true;
	INIT = false;
	t = 0; 
	dt = 0;
	xPutter = 0;								// Startlage Putter bezügl. "0"
	yPutter = dPutter/2;
	radiusPutter = lengthPutter;
	xBall = 0;									// Startlage Golfball
	yBall = dBall/2;
}

function draw() {
	background(255);							// Hintergrund: weiß
/* administration */
	push();
		textSize(2.5*fontSize);
		textAlign(CENTER);
		text("Das ultimative Golf-Spiel", 50*gridX, 10*gridY);
	pop();
	
	newTrial = NewTrial.drawButton(true);				// NewTrial-Button Darstellen und auswerten
	if (newTrial) 
		{
			newTrial = false;							// Pushbutton
			START = true;
			INIT = true;
			xBall = 0;									// Startlage Golfball wieder herstellen
			yBall = dBall/2;
		}

	reset = Reset.drawButton(true);
	if(reset)
		{
			reset = false;								// Pushbutton
			t = 0;
			dt = 0;
			xBall = 0;									// Startlage Golfball
			yBall = dBall/2;
		}
		
		
/* calculation */
	if (START)
		{
			if (INIT)
				{
					INIT = false;
					START = false;
					t = 0;
					dt = 1.0/frmRate;				// Zeitincrement
					xBall = 0;							// Startlage Golfball
					yBall = dBall/2;
					vxBall = vx0Ball;					// Startgeschwindigkeit setzen
				}
		}
	else
		{
			t = t + dt;									// Zeit incrementieren
			xBall = vxBall*t; 							// 1. Variante 
			//xBall = xBall + vxBall*dt;				// 2. Variante
			if (xBall <= G[2][0]) 
				{
					dt = 0;								// Bewegung anhalten
					START = true;
					console.log("stop"+" "+xBall);
				}
		}

/* display */
	push();
	translate(xi0, yi0);
	scale(1, -1);
		playGround();								// Playground darstellen

		push();										// Golfer
		translate(0, (lengthPutter + dPutter/2)*M);				// Verschieben in Drehpunkt
		rotate(PI/10);
			noFill();								// Drehpunkt
			ellipse(0,0, 0.05*M);
			fill(colorPutter);						// Golfschläger
			stroke(colorPutter);
			push();
				translate(0, -lengthPutter*M);		// Verschieben aus dem Drehpunkt
				ellipse(0, 0, dPutter*M);
				strokeWeight(3);
				line(0, 0, 0, 0.7*lengthPutter*M);  // Schlägerlänge reduziert
			pop();			
		pop();
		
		fill(colorBall);							// Golfball
		ellipse(xBall*M, yBall*M, dBall*M);

		push();										// markiert den Nullpunkt des Koordinatensystems
			stroke(0);	
			strokeWeight(2);
			line(10, 0, -10, 0);
			line(0, 10, 0, -10);
		pop();
	pop();
}

function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
