/**************************** 10. Übung/add ons **************************************/
/* Autor: Dr.-Ing. V. Naumburger	                                                */
/* Datum: 22.12.2021                                                                */
/************************************************************************************/

/*************************** Variablendeklaration ***********************************/
/* Spielfeld */
var N = [0, 0];									// Nullpunkt

var G = [										// Playground Kontur
			[0.82, -0.3],						// 0
			[0.82, 0],							// 1
			[-1.2, 0],							// 2
			[-2.1, 0.4],						// 3
			[-3.0, 0],							// 4
			[-3.4, 0],							// 5
			[-3.43, -0.2],						// 6
			[-4.0, -0.2],						// 7
			[-4.03, 0],							// 8
			[-4.9, 0],							// 9
			[-4.9, -0.2],						// 10
			[-5.1, -0.2],						// 11
			[-5.1, 0],							// 12
			[-5.7, 0],							// 13
			[-6.56, 0.9],						// 14
			[-6.56, -0.3],						// 15			
		];

var P = [										// Oberfläche
			[0.82, 0],							// 0
			[-1.2, 0],							// 1
			[-2.1, 0.4],						// 2
			[-3.0, 0],							// 3
			[-3.4, 0],							// 4
			[-4.03, 0],							// 5
			[-4.9, 0],							// 6
			[-5.1, 0],							// 7
			[-5.7, 0],							// 8
			[-6.56, 0.9],						// 9
		];

var beta = 0, beta_i = [];						// Neigungswinkel, Neigungswinkel des i-ten der Geradenstücks
var len = 0, len_i = [];						// Länge, Länge des i-ten Geradenstücks
var g_, g_i = [];								// wirksame Erdbeschleunigungskonstante, wirksame Erdbeschleunigungskonstante des i-ten Geradenstücks
var aRR, aRR_i = [];							// Bremsverzögerung, Bremsverzögerung des i-ten Geradenstücks

var unitVector = [];							// Einheitsvektor der Playground-Segmente


// Rollreibungskoeffizient des i-ten Geradenstücks
var myR_i = [
				myR_Rasen,						// 1.plane
				myR_Rasen,						// 1.slope
				myR_Rasen,						// 2.slope
				myR_Rasen,						// 2.plane
				0,								// water
				myR_Rasen,						// 3.plane
				0,								// hole
				myR_Sand,						// 4.plane
				myR_Sand						// 3.slope				
			];
			
var segmentToStatus = [
				"1.plane",
				"1.slope",
				"2.slope",
				"2.plane",
				"water",
				"3.plane",
				"hole",
				"4.plane",
				"3.slope"
			];
			
/***************************** Subroutines *******************************************/
function createUnitVector()
	{   // erzeugt die Einheitsvektoren zu den playground-Vektoren
		for (var i = 0; i < P.length - 1; i++)
			{
				unitVector[i] = [];											// Erzeugen 2D-Array
				unitVector[i][0] = (P[i+1][0] - P[i][0])/len_i[i];			// x-Komponente
				unitVector[i][1] = (P[i+1][1] - P[i][1])/len_i[i];			// y-Komponente
			}			
	}

function getDistance(xBall, yBall, i)
	{	// liefert die Distanz des Balls zum i-ten playground-Punkt
		var b = [];								// Ballvektor
		var distance;							// Distanzlänge
		var magB;								// Beträge der Vektoren
		
		b = [									
				xBall - P[i][0], yBall - P[i][1]
			];
		//console.log("  b: "+nf(b[0],2,4)+" "+nf(b[1],2,4)+" e: "+unitVector[i][0]+" "+unitVector[i][1]);
		distance = b[0]*unitVector[i][1] - b[1]*unitVector[i][0];
		part = b[0]*unitVector[i][0] + b[1]*unitVector[i][1];				// Lot auf den playground-Vektor
		magB = sqrt(sq(b[0] + sq(b[1])));
		return [magB, distance, part];
	}

function Handle(M, D, R, dR, visible, c)
	{
		this.M = M;  			// Skalierung der Ortskoordinaten 
		this.D = D;   			// Durchmesser des sensiblen Bereiches
		this.R = R;				// Radius der Kreisbahn
		this.dR = dR;			// Schwankungsbreite +/- in %
		this.visible = visible;	// Sichtbarkeit
		this.c = c;

		var Head = new Circle(0.5*this.D, this.M, true, this.c, 'b');
		
		this.moveHandle = function (xPos, yPos, x, y)
			{ // Eingabe von Vektoren, z.B. Geschwindigkeiten etc. 
				var vLength = sqrt(sq(x) + sq(y));
				var vArc = atan2(y, x);
				var result;
				
				if (vLength > (1+0.01*this.dR)*this.R) vLength = (1+0.01*this.dR)*this.R;	// auf Variationsbreite beschränken
				if (vLength < (1-0.01*this.dR)*this.R) vLength = (1-0.01*this.dR)*this.R;
	
				x = vLength*cos(vArc);
				y = vLength*sin(vArc);
				// Darstellung Handle
				if (this.visible)
					{
						push();
					        stroke(this.c);
							strokeWeight(2);
					        fill(this.c);
					        translate(xi0+xPos*this.M,yi0-yPos*this.M);
					        rotate(-vArc);
							var l = vLength*this.M;
					        line(0,0,l,0);          					// Linie
							ellipse(l, 0, this.D*this.M);				// sensibler Kreis
				        pop();
					}	
				result = Head.inCircle(x + xPos, y + yPos);
				x = result[1] - xPos;
				y = result[2] - yPos;
				return ([result[0], x, y, vLength, vArc]); // satus; kart.Koord. x, y; Pol.koord. Betrag, Winkel
			}	
	}

function Circle(r, M, visible, c, mode)
	{
		this.r = r;             // Radius!
		this.M = M;
		this.visible = visible; // boolean
		this.c = c;
		this.mode = mode;        // 'x', 'y' oder 'b'
		this.status = false;     // Bewegung des Kreises, ja: true
	 	var overBubble = false;
		 
		this.inCircle = function (xPos, yPos) // Pos in Metern und im kart. Koord.Syst.
			{
				var R = this.r;
				var Scale = this.M;
				var insideBubble;
				var x, y;
				
				push();                 // Formatierung merken
				 /* Maus in der Ellipse? */
					if (sq(iXk(mouseX)-xPos*Scale) + sq(iYk(mouseY)-yPos*Scale) <= sq(R*Scale))
						{ // im Kreis, sensibler Kreis ist 1.5 mal größer als der sichtbare Kreis -> für kleine Mobilgeräte
							if (mPressed)
								{
									//console.log("press: "+mPressed+" start: "+tStarted);
									mPressed = false;	
									mReleased = false; 
									insideBubble = true;
									overBubble = true;
								}	
						}                                                   
					else
						{ // außerhalb des Kreises -> Koordinaten bleiben unverändert
							insideBubble = false;
						}
					x = xPos;
					y = yPos;								
					if ((insideBubble || this.status))
						{
							this.status = true;   // ermöglicht Kreisbewegung, auch wenn Maus außerhalb
							if (mDragged)
								{
									//console.log("drag");
									switch (this.mode)
										{
											case 'x': x = iXk(mouseX)/Scale; 
																break;
											case 'y': y = iYk(mouseY)/Scale;
																break;
											default:  x = iXk(mouseX)/Scale;
																y = iYk(mouseY)/Scale;
																break;
										}
									mDragged = false;	
								}
						
							if (mReleased)
								{
									//console.log("released: "+mReleased);
									insideBubble = false;
									overBubble = false;
									this.status = false;
									this.mouseReleased = true;
								}
						}
					if (overBubble == true) fill(manageColor(this.c)[0]); else fill(this.c)
					if (this.visible)
						{
							stroke(manageColor(this.c)[0]);
							ellipse(kXi(xPos*Scale), kYi(yPos*Scale), 2*R*Scale, 2*R*Scale);
						}
					fill(255);
					//console.log("status: "+this.status+" x: "+x+" y: "+y+"  M: "+Scale+" visib: "+this.visible);
				pop();   // Formatierung rekonstruieren
				return([this.status, x, y]); // this.status true: mouse im Kreis clicked, false: released
			}
	}



function ballOnFlight(x, y)
	{
		push();
			fill(colorBall);							// Golfball
			ellipse(x*M, y*M, dBall*M);
			fill(0);
			if(debug)
				{
					ellipse(0, 0, 0.4*dBall*M);			// Weganfang
				}
		pop();

		if (debug)
			{
				push();
					noFill();
					ellipse(xBall*M, (G[0][1]-dBall)*M, dBall*M); // Projektion des Balls auf die x-Achse
				pop();
			}		
	}

function ballOnSlope(s, len, beta, Point)
	{
		//console.log("s: "+s+"  "+degrees(beta)+"° "+len+"m "+Point);
		
		push();
			translate(Point[0]*M, (Point[1] + 0.5*dBall)*M);
			rotate(beta);
			fill(colorBall);							// Golfball
			ellipse(s*M, 0, dBall*M);
			fill(0);
			if(debug)
				{
					line(0, 0, len*M, 0);				// Weg des Balls im Segment
					ellipse(0,0,0.4*dBall*M);			// Weganfang
				}
		pop();
			
		if (debug)
			{
				push();
					noFill();
					ellipse(xBall*M, (G[0][1]-dBall)*M, dBall*M); // Projektion des Balls auf die x-Achse
				pop();
			}
	}
	
function playGround()
	{
		fill(0,0,200);							// Wassergraben
		rect(G[8][0]*M,G[7][1]*M, (G[5][0] - G[8][0])*M, 0.9*(G[5][1] - G[6][1])*M);

		fill(100, 50, 0);						// Playground
		beginShape();
			for (var i = 0; i < G.length; i++)
				//console.log(G[i]);
				vertex(G[i][0]*M,G[i][1]*M);
		endShape();			

		push(); 								// Rasen
			strokeWeight(5);
			noFill();
			push();
				stroke(0, 200, 0);
				beginShape();
					for (var i = 1; i < 6; i++)
						//console.log(G[i]);
						vertex(G[i][0]*M,G[i][1]*M);
				endShape();
				line(G[8][0]*M,G[8][1]*M, G[9][0]*M,G[9][1]*M);
			pop();
			push();								// Sandberg
				stroke(200, 200, 0);
				beginShape();
					for (var i = 12; i < 15; i++)
						//console.log(G[i]);
						vertex(G[i][0]*M,G[i][1]*M);
				endShape();
			pop();
		pop();		
	}
	
function drawZeroCross()
	{ // markiert den Nullpunkt des Koordinatensystems	
		if (debug)
			{
				push();
					stroke(0);
					strokeWeight(2);
					noFill();
					line(10, 0, -10, 0);
					line(0, 10, 0, -10);
				pop();
			}		
	}