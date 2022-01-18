/******************************* 8. Übung *******************************************/
/* Autor: Dr.-Ing. V. Naumburger	                                                */
/* Datum: 18.11.2021                                                                */
/************************************************************************************/
/*	9. Strömungsreibung	- Wind														*/
/*************************** Variablendeklaration ***********************************/
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M;											// Maßstab
var xi0, yi0;                                	// Koordinatenursprung intern
var basicLength = 5;							// Grundlänge in [m]
var bodyHeight = 1.8;							// Körpergröße in [m]
var playgroundWidth = basicLength*23.9/16.9;	// Playgroundbreite in [m]
var myR_Rasen = 0.2, myR_Sand = 0.3;			// Rollreibungskoeffizienten				

var x0, y0;										// Koordinatenursprung	
var frmRate = 60;      							// Screen-Refreshrate 
var t, dt;                						// Zeitvariable, Increment der Zeitv.
var timeScale = 0.1;
var g = -9.81;									// Erdbeschleunigungskonstante [m/s²]

var s = 0, vs = 0;								// Weg, Weggeschwindigkeit
var aRR_i = [];									// Bremsverzögerung im i-ten Segment
var sign = 0;									// Richtungsinformation für Rollreibung
var rho = 1.3;         							// Luftdichte in kg/m³
var cw = 0.45;									// cw-Wert Vollkugel
var rm; 										// Reibungs-Masse-Verhältnis

var xBall, yBall;								// Golfball
var dBall = 0.1;								// Balldurchmesser optisch
var dBall_real = 0.038;							// wirklicher Balldurchmesser real: 42,67 => 0.043m
var mBall = 0.0025;								// Ballmasse  2,5 g, real: 45,93 g
var colorBall = "#aaaa00";	
var vxBall, vyBall;								// Ballgeschwindigkeit
var vx0Ball = 0; 								// Startgeschwindigkeit in m/s
var vy0Ball = 0;
var vWind, vWindMax = 15/3.6;					// Windgeschwindigkeit ~4 km/h
var normVWind = 0.15;							// Normalisierung der Windgeschwindigkeit zwecks Darstellung [m / m/s]

var xPutter, yPutter;							// Golfschläger (Putter)
var vPutter = 0;								// Puttergeschwindigkeit
var lengthPutter = 0.35*bodyHeight;
var dPutter = 0.1;								// Durchmesser Golfschläger real: 3,2cm => 0.032m
var colorPutter = "#aaaaaa";
var freePutter = false;							// Putter ist zum Schlag frei gegeben
var mPutter = 1;								// Puttermasse [kg]
var nPutter = 40;								// Federkonstante Putter/Golfer [N/m]
var dampPutter = 4;								// Dämpfung
var PutterInMove = false;						// Ausschwingen verhindern/erlauben

var flagRodHeight = 0.6*bodyHeight;				// Zielfahne: Stablänge
var flagLapHeight = 0.1*bodyHeight;				// Fahnenhöhe

var NewTrial, newTrial = false;					// Push-Button ""neuer Versuch", Variable
var Reset, reset, START, INIT;					// Reset-Button, Variable, Start der Bewegungsberechnung
var Debug, debug, Next, next;					// Debugging Buttons

var status = "start";							// state-machine

var Putter, putter;								// Schläger, Maus sensibel

function setup() {								/* prepare program */
  	createCanvas(windowWidth, windowHeight);
	evaluateConstants(90, 90);					// Erzeuge elementare Konstanten
	M = 0.85*canvasWidth/playgroundWidth; 		// dynamischer Maßstab
	
	xi0 = 25.0*canvasWidth/29.7;				// Koordinatenursprung (willkürlich gewählt)
	yi0 = 15.3*canvasHeight/21.0;

	frameRate(frmRate); 						// setzen der Bildwechselfrequenz
	timeScale = 1; //200/abs(vx0Ball*M);				// schnelle Bewegung
	
	// Objectdeclarations
	NewTrial = new PushButton(80, 90, "NEW", '#00ff00', true);		// xPos, yPos, onName, onColor, modus
	Reset = new PushButton(10, 90, "Reset", '#ff0000', true);
	Debug = new ToggleButton(40, 90, "debug", '#00ff00', "run", '#ff0000');						//xPos, yPos, onName, onColor, offName, offColor
	Next = new PushButton(50, 90, "next", '#00ff00', true);	

	// Putterersatz: Maus sensitiver Kreis
	Putter = new Circle(0.5*dPutter, M, true, '#ff0000', 'x'); 	// scheibarer Radius, M, Sichtbarkeit, c, mode 
	yPutter = dPutter/2;
	

	START = true;
	INIT = false;
	t = 0; 
	dt = 0;
	xPutter = dPutter;								// Startlage Putter bezügl. "0"
	yPutter = dPutter/2;
	xBall = 0, yBall = dBall/2;					// Startlage Golfball	
	vxBall = 0; vyBall = 0;						// Startgeschwindigkeit Golfball
	
	for (var i = 1; i < P.length - 1; i++)		// Berechnung der Neigungswinkel und Längen der Geradenstücke
		{
			beta_i[i] = atan2((P[i+1][1]-P[i][1]), (P[i+1][0]-P[i][0]));		// Segmentwinkel bezgl. x-Achse
			len_i[i] = sqrt(sq(P[i+1][1]-P[i][1]) + sq(P[i+1][0]-P[i][0]));		// Segmentlänge
			g_i[i] = g*sin(beta_i[i]);											// gewichtete Gravitationskonstante
			aRR_i[i] = g*myR_i[i]*cos(beta_i[i]);								// reibungsbedingte Verzögerung
			//console.log(i+" beta: "+degrees(beta_i[i])+"° l: "+len_i[i]+" g': "+g_i[i]+" aRR: "+aRR_i[i]);
		}
	beta_i[0] = PI;																// Neigungswinkel 1. plane
	len_i[0] = sqrt(sq(P[1][1]-N[1]) + sq(P[1][0]-N[0]));						// Länge 1. plane
	g_i[0] = 0;
	aRR_i[0] = -g*myR_i[0];														// reibungsbedingte Verzögerung
	rm = 0.5*(cw*rho*PI*sq(dBall_real/2))/mBall;      							// Zeitkonstante nach Newton
	vWind = 0;
}

function draw() {
	background(255);							// Hintergrund: weiß
	
/* administration */
	push();
		textSize(2.5*fontSize);
		textAlign(CENTER);
		text("(8.) Das ultimative Golf-Spiel", 50*gridX, 10*gridY);
		textSize(fontSize);
		text("timeScale: "+timeScale, 50*gridX, 12*gridY);
		text("t: "+nf(t,3,2), 10*gridX, 20*gridY);
	pop();
	
	newTrial = NewTrial.drawButton(true);				// NewTrial-Button Darstellen und auswerten
	if (newTrial) 
		{
			newTrial = false;							// Pushbutton
			START = true;
			INIT = false;
			status = "start";
			t = 0;
			dt = 0;
			s = 0;
			xBall = 0;									// Startlage Golfball
			yBall = dBall/2;
			vWind = random(-vWindMax, vWindMax);
			xPutter = dPutter;
			freePutter = false;
			PutterInMove = false;
		}

	reset = Reset.drawButton(true);
	if(reset)
		{
			reset = false;								// Pushbutton
			START = true;
			INIT = false;
			status = "start";
			t = 0;
			dt = 0;
			s = 0;
			xBall = 0;									// Startlage Golfball
			yBall = dBall/2;
			vWind = random(-vWindMax, vWindMax);
			xPutter = dPutter;
			freePutter = false;
			PutterInMove = false;
		}
		
	debug = Debug.drawButton();	
	next = Next.drawButton(debug);


	if(debug)
		{
			textSize(fontSize);
			text("status: "+status, 14*gridX, 20*gridY);
			text("s: "+nf(s,2,3) + "          vs: "+nf(vs,2,3), 14*gridX, 22*gridY);
			text("xBall: "+nf(xBall,2,3) + "     yBall: "+nf(yBall,2,3), 14*gridX, 24*gridY);
			text("\u03b2: "+nf(beta,3,0), 14*gridX, 26*gridY);
		}

/* calculation */
	if (START)
		{
			beta = PI;									// Startwerte für Darstellung setzen
			len = len_i[0];
			Point = N;
			// Alternativlösung für pendelnden Putter
			putter = Putter.inCircle(xPutter, 0.5*dPutter);
			xPutter = putter[1];
			 
			if (freePutter == true && putter[0] == false)		// Start der Putterbewegung feststellen
				{
					INIT = true;
					status = "start";
				}		
			freePutter = putter[0];								// Zustand merken



			if (INIT)									// Programm wird mit NEW-Button gestartet
				{
					INIT = false;
					START = false;
					t = 0;
					dt = timeScale/frmRate;				// Zeitincrement
					xBall = 0;							// Startlage Golfball
					yBall = dBall/2;
				}
		}
	else
		{
			if (next || !debug)
				{
					next = false;						// Schrittbetrieb
					if(status == "start" || PutterInMove)
						{
							var damping;
							var sqOmega = nPutter/mPutter;
							if (PutterInMove) damping = dampPutter; else damping = 0;
							
							vPutter = vPutter - (2*damping*vPutter + sqOmega*xPutter)*dt;
							xPutter = xPutter + vPutter*dt;
							if (xPutter <= dPutter && !PutterInMove) 
								{
									status = "ballHit";
									PutterInMove = true;
									vxBall = 2*vPutter;					// Startgeschwindigkeit nach dem Stoß (vPutter * 2!) setzen
									vyBall = 0;
								}
						}
						
					switch (status)										// Berechnung vorbereiten
						{					
							case "ballHit":		if (yBall <= dBall/2 && vyBall == 0)
													{
														status = "1.plane";					// Ball bleibt auf der Ebene
														s = 0;								// Anfangsbed. für calculation
														vs = abs(vxBall);
														sign = 1;							// Richtungsinformation für Rollreibung
														Point = N;							// Anfangsbed. für display	
														//console.log("start"+" "+xBall);
													}				
												else
													{
														status = "flight";					// Ball startet im schrägen Wurf
														//console.log("flight"+" "+xBall);
													}	

							case "1.plane":		if (len_i[0] > s && xBall <= P[0][0])
													{	// Ortsberechnung
														g_ = g_i[0];					// wirksame Hangabtriebsbeschleunigung
														beta = beta_i[0];
														len = len_i[0];
														aRR = aRR_i[0];					// wirksame Reibungsverzögerung
														xBall0 = N[0];
														//console.log("1.plane");		
													}
												else
													{	// Übergang 1.plane -> 1.slope
														status = "1.slope";				// Status ändern
														//console.log("goto 1.slope");
														s = 0;							// Weg rücksetzen
														xBall0 = P[1][0];				// für calculation
														beta = beta_i[1];				// für calculation & display
														len = len_i[1];
														aRR = aRR_i[1];					// wirksame Reibungsverzögerung
														Point = P[1];					// für display
													}

												if(xBall >= P[0][0])					// Endbedingung rechter Rand
													{
														status = "end";
														dt = 0;							// Stop
														beta = PI;
														len = len_i[0];
														aRR = aRR_i[0];					// wirksame Reibungsverzögerung
														Point = P[0];
														xBall0 = P[0][0];
														s = 0;
														//console.log("*"+P[0][0]);
													} 
												break;
							
							case "1.slope":		if (len_i[1] > s && s >= 0) 
													{	// Zeitfunktion berechnen
														g_ = g_i[1];
														beta = beta_i[1];
														len = len_i[1];
														aRR = aRR_i[1];					// wirksame Reibungsverzögerung
														xBall0 = P[1][0];
														//console.log("1.slope");		
													}
												else
													{
														if (s >= len_i[1])
															{	// Übergang 1.slope -> flight
																status = "on flight";
																console.log("goto flight ");
																beta = beta_i[1];
																xBall = xBall;								// Startbed. für Mittelpunkt (!) schrägen Wurf
																yBall = yBall;	
																vxBall = vs*cos(beta);
																vyBall = vs*sin(beta);
																break;
															}
														if (s <= 0) 
															{	// Übergang 1.slope -> 1.plane
																status = "1.plane";
																//console.log("goto 1.plane");
																s = len_i[0];
																beta = PI;
																len = len_i[0];
																aRR = aRR_i[0];					// wirksame Reibungsverzögerung
																xBall0 = N[0];
																Point = N;
															}
													}		
												break;
		
							case "2.slope":		if (len_i[2] > s && s >= 0) 
													{
														g_ = g_i[2];
														beta = beta_i[2];
														len = len_i[2];
														aRR = aRR_i[2];					// wirksame Reibungsverzögerung
														xBall0 = P[2][0];
														//console.log("2.slope");		
													}
												else
													{
														if (s >= len_i[2])
															{	// Übergang 2.slope -> 2.plane
																status = "2.plane";
																console.log("goto 2.plane"+" "+len_i[2]);
																s = 0;
																beta = beta_i[3];
																len = len_i[3];
																aRR = aRR_i[3];					// wirksame Reibungsverzögerung
																xBall0 = P[3][0];
																Point = P[3];
																break;
															}
														if (s <= 0) 
															{
																status = "error";				// Fehler: Rückkehr auf die 1. slope ist nicht möglich!
																console.log("error");
																s = 0;
																xBall0 = N[0];
															}
													}		
												break;

							case "2.plane":		if (len_i[3] > s)
													{	// Ortsberechnung
														g_ = g_i[3];
														beta = beta_i[3];
														len = len_i[3];
														aRR = aRR_i[3];					// wirksame Reibungsverzögerung
														xBall0 = P[3][0];
														console.log("2.plane");		
													}
												else
													{	// Ende im Wasser
														status = "water";				// Status ändern
														console.log("in water");
														s = 0;							// Weg rücksetzen
														xBall0 = P[3][0];
														dt = 0;
													}
												break;
							
						}
		
					switch (status)															// Berechnung ausführen
						{
							case "1.plane":
							case "1.slope":
							case "2.slope":
							case "2.plane":
							case "3.plane":
							case "4.plane":
							case "3.slope": 	vs = vs + (g_ - sign*aRR)*dt;				// Wegberechnung für Rollbewegung mit Rollreibung
												if (abs(vs) < 0.03 && beta == PI)			// Ende der Bewegung -> Energie aufgebraucht
													dt = 0;
												else
													{
														if(vs > 0) sign = 1; else sign = -1; // Reibkraft ist der Bewegung entgegen gerichtet!
														s = s + vs*dt;
													}
												xBall = xBall0 + s*cos(beta)  - (0.5*dBall)*sin(beta) ;  // Ballmittelpunkt!!!
												yBall = s*sin(beta)  - (0.5*dBall)*cos(beta);
												break;
							case "on flight":	// Wegberechnung Flug
												var vGes = sqrt(sq(vxBall-vWind)+sq(vyBall));
          										vxBall = vxBall - rm*(vxBall-vWind)*vGes*dt;        // I. Integration
          										vyBall = vyBall + (g - rm*vyBall*vGes)*dt;
												yBall = yBall + vyBall*dt;
												xBall = xBall + vxBall*dt;
						}

					t = t + dt;									// Zeit incrementieren	
				}	
		}

/* display */
	push();
	translate(xi0, yi0);
	scale(1, -1);
		playGround();								// Playground darstellen
		strokeWeight(3);
		stroke(0);
		line(P[7][0]*M, P[7][1]*M, P[7][0]*M, (P[7][1] + flagRodHeight)*M); // Fahnenstab
		strokeWeight(1);
		fill("#9999ff");
		beginShape();
			vertex(P[7][0]*M, (P[7][1] + flagRodHeight)*M);
			vertex((P[7][0] + normVWind*vWind)*M, (P[7][1] + flagRodHeight - 0.5*flagLapHeight)*M);
			vertex(P[7][0]*M, (P[7][1] + flagRodHeight - flagLapHeight)*M);
		endShape();

		// Alternativlösung mit horizontaler Feder 		
		fill(colorPutter);						// Golfschläger
			push();
				translate(xPutter*M, yPutter*M);		// Putterbewegung
				ellipse(0, 0, dPutter*M);
			pop();		
		
		switch (status)
			{
				case "start": 
				case "1.plane": 
				case "1.slope":
				case "2.slope": 
				case "2.plane":
				case "end": 		ballOnSlope(s, len, beta, Point);
									//console.log("on 3.slope");
									break;
				case "on flight":   ballOnFlight(xBall, yBall);
									break;
				case "water":		push();
										translate((P[4][0]+P[5][0])*M/2, (G[6][1]+0.5*dBall)*M);
										ellipse(0, 0, dBall*M);
									pop();
									break;
			}

		drawZeroCross();						// markiert den kartesischen Nullpunkt
	pop();
}

function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
