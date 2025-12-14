let theta = 0;
let speed = 0.01; // change for faster/slower motion

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  stroke(255);
  strokeWeight(1);
  noFill();
  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  // fade previous trails
  noStroke();
  fill(0, 20);
  rect(0, 0, width, height);

  translate(width / 2, height / 2);

  // radii of the construction circles
  let r1 = min(width, height) * 0.12;
  let r2 = min(width, height) * 0.22;

  // endpoints of arms:
  // first arm rotates with θ
  let x1 = r1 * cos(theta);
  let y1 = r1 * sin(theta);

  // second arm rotates with πθ
  let x2 = x1 + r2 * cos(Math.PI * theta);
  let y2 = y1 + r2 * sin(Math.PI * theta);

  // helper circles
  stroke(80);
  noFill();
  circle(0, 0, 2 * r1);
  circle(x1, y1, 2 * r2);

  // arms
  stroke(180);
  line(0, 0, x1, y1);
  line(x1, y1, x2, y2);

  // moving point
  stroke(255);
  fill(255);
  circle(x2, y2, 4);

  theta += speed;
}

// optional: scroll to change speed
function mouseWheel(event) {
  speed += event.delta * -0.00002;
  speed = constrain(speed, 0.0005, 0.05);
}
