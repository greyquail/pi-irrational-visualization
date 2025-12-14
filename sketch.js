// Straight-line irrational-pi visualization

let theta = 0;
let speed = 0.01;     // try 0.01–0.03
let pts = [];
let zoom = 1;
let baseScale;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  background(0);
  stroke(220);
  noFill();
  baseScale = min(width, height) * 0.35;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  baseScale = min(width, height) * 0.35;
  background(0);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  scale(zoom);

  // only the parametric curve, no circles or arms
  for (let k = 0; k < 4; k++) {
    let x = cos(theta) + cos(Math.PI * theta);
    let y = sin(theta) + sin(Math.PI * theta);
    pts.push(createVector(x, y));
    theta += speed;
  }

  stroke(200);
  strokeWeight(0.7 / zoom);
  noFill();
  beginShape();
  for (let p of pts) {
    vertex(p.x * baseScale, p.y * baseScale);
  }
  endShape();

  let last = pts[pts.length - 1];
  if (last) {
    fill(255);
    noStroke();
    circle(last.x * baseScale, last.y * baseScale, 4 / zoom);
  }
}

function mouseWheel(event) {
  const factor = 1.0 + event.delta * -0.001;
  zoom *= factor;
  zoom = constrain(zoom, 0.1, 80);
  return false;
}
