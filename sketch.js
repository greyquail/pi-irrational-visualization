// Irrational Pi visualization in p5.js
// z(theta) = e^(i theta) + e^(i pi theta)
// x = cos(theta) + cos(pi * theta)
// y = sin(theta) + sin(pi * theta)

let theta = 0;
let speed = 0.01;     // base angular speed
let pts = [];         // history of points
let zoom = 1;         // zoom factor
let baseScale;        // global scale for drawing

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  background(0);
  stroke(220);
  noFill();
  baseScale = min(width, height) * 0.4; // radius of main figure
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  baseScale = min(width, height) * 0.4;
  background(0);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  scale(zoom);

  // add several steps per frame for dense lines
  for (let k = 0; k < 3; k++) {
    let x = cos(theta) + cos(Math.PI * theta);
    let y = sin(theta) + sin(Math.PI * theta);
    pts.push(createVector(x, y));
    theta += speed;
  }

  // draw continuous path
  stroke(200);
  strokeWeight(0.7 / zoom); // keep lines thin when zoomed in
  noFill();
  beginShape();
  for (let p of pts) {
    vertex(p.x * baseScale, p.y * baseScale);
  }
  endShape();

  // highlight the current point
  let last = pts[pts.length - 1];
  if (last) {
    fill(255);
    noStroke();
    circle(last.x * baseScale, last.y * baseScale, 4 / zoom);
  }
}

// mouse wheel zoom: scroll up to zoom in, down to zoom out
function mouseWheel(event) {
  const factor = 1.0 + event.delta * -0.001;
  zoom *= factor;
  zoom = constrain(zoom, 0.1, 80); // sensible limits
  return false; // prevent page scroll
}
