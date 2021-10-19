

let flock;
let numBirds = 100;
let bird = [];
let twitter = [];

let donut;
let birdX, birdY;
let donutX, donutY;

let backgroundImg;
let backgroundW, backgroundH;
let canvasW, canvasH;
let maxWindowW = 1000;
let numTwitter = 12;

let windowW, windowH;

let mySynth;

function preload() {
  
  bird.push(loadImage('50_1.png'));
  bird.push(loadImage('50_2.png'));
  bird.push(loadImage('50_3.png'));
  bird.push(loadImage('50_2.png'));
 
  twitter.push(loadSound('Twitter1.mp3'));
  twitter.push(loadSound('Twitter2.mp3'));
  
  
  birdX = -100;
  birdY = -100;
  
  donut = loadImage('MicrosoftTeams-image (10).png');
  donutX = -100;
  donutY = -100;
  
  backgroundImg = loadImage('background.png');
  
  windowH = windowHeight-50;
  windowW = windowWidth*(windowHeight-50)/windowHeight;
}

function setupCanvas(){
  canvasW = min(windowW, maxWindowW);
  backgroundW = canvasW;
  backgroundH = (backgroundImg.height/backgroundImg.width)*backgroundW;
  canvasH = backgroundH;
}
function setup() {
  
  
  new p5.MonoSynth();
  frameRate(30);
  setupCanvas();
  createCanvas(canvasW, canvasH);

  // if(windowW>= 1000){
  //   numBirds = 100;
  //   numTwitter = 12;
  // console.log(windowW);
  // }
  
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < numBirds; i++) {
    let b = new Boid(random(-100, -20), random(0, height/3)); 
    flock.addBoid(b);
  }

}



function draw() {
  
  imageMode(CORNER);
  image(backgroundImg, 0,0, backgroundW, backgroundH);
  // background(250);
  
  imageMode(CENTER);
  flock.run();
  
  // if(windowW >= 1000){
  //  donutMotion();
  //  birdMotion();
  // }
  
  
  if(parseInt(random(0,numTwitter)) == 1){ 
    // twitter[min(parseInt(random(0,2)),1)].play();
    // mySynth.play('Twitter1.mp3');
  }
 
}



function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}



Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}


Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
  plog = "num birds:" + this.boids.length;
  let i = parseInt(this.boids.length)%10;
  // if( i==0 ) twitter.play();
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(0, 1), random(0, 1));
  this.position = createVector(x, y);
  this.forward = 1;
  this.scale = random(0.7, 1);
  this.movespeed = 20;
  this.r = 5.0;
  this.maxspeed = 4.8;    // aximum speed
  this.maxforce = 0.1; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // // Arbitrarily weight these forces
  // sep.mult(createVector(1.5, 0.5));
  // ali.mult(createVector(1.0, 0.5));
  // coh.mult(createVector(1.0, 0.5));
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  // let mouse = createVector(mouseX, mouseY);
  // this.applyForce(mouse.mult(1.0))
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  
  let _x = this.position.x;
  this.position.add(this.velocity);
  let _s = this.position.x - _x;
  if(_s < 0) this.forward = -1;
  else this.forward = 1;
  
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  
  // translate(this.position.x, this.position.y);
  
  let z = (this.position.y/windowH)*10 + 1;
  translate(this.position.x, this.position.y);
  
  push();
  rotate(theta +radians(-60));
  // scale(this.forward, 1);
  // /let imgIndex = parseInt((frameCount%parseInt(this.movespeed)/4));
  // let imageLoop = parseInt(frameCount%4);
  
  let imgIndex = parseInt(map(parseInt(frameCount%this.movespeed), 0, this.movespeed, 0, 4, true));
  scale(this.scale);
  scale(0.5);
  image(bird[imgIndex], 0, 0);
  pop();

  
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  border = this.r + 50;
  if (this.position.x < -border)  this.position.x = width + this.r;
  if (this.position.y < -border)  this.position.y = height + this.r;
  if (this.position.x > width + border) this.position.x = -this.r;
  if (this.position.y > height + border) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 35.0;//25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}

function birdMotion(){
  
  
  let forwardX = (mouseX - birdX)/30;
  let forwardY = (mouseY - birdY)/30;
  
  
  birdX += forwardX;
  birdY += forwardY;
  
  push();
  translate(birdX, birdY);
  if(forwardX < 0) scale(-1,1);
  else scale(1,1);
  
  let imgIndex = parseInt((frameCount%40)/10);
  image(bird[imgIndex], 0,0);
  pop();
  
  
 
}

function donutMotion(){
  
  let speed = dist(donutX, donutY, mouseX, mouseY);
  
  image(donut, donutX, donutY, 100, 100);
    
  donutX = mouseX;
  donutY = mouseY;
  
}
function windowResized() {
  // print("ウィンドウサイズの変更");
  setupCanvas();
  resizeCanvas(canvasW, canvasH);
  // resizeCanvas(windowWidth, windowHeight);
}

