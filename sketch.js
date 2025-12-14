// Irrational Pi visualization in p5.js
// z(theta) = e^(i theta) + e^(i pi theta)
// x = cos(theta) + cos(pi * theta)
// y = sin(theta) + sin(pi * theta)

let theta = 0;
let speed = 0.01;     // try 0.01–0.03
let pts = [];
let zoom = 0.25;      // start zoomed OUT so you see more
let baseScale;

let pinchStartDist = null;
let startZoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  background(0);
  stroke(220);
  noFill();
  baseScale = min(width, height) * 0.25;  // smaller curve for phones
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  baseScale = min(width, height) * 0.25;
  background(0);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  scale(zoom);

  // add several steps per frame for dense lines
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

// Desktop / trackpad zoom
function mouseWheel(event) {
  const factor = 1.0 + event.delta * -0.001;
  zoom *= factor;
  zoom = constrain(zoom, 0.05, 80);
  return false; // stop page scroll
}

// Optional: button-based zoom (if you added buttons in index.html)
function zoomIn() {
  zoom *= 1.2;
  zoom = constrain(zoom, 0.05, 80);
}

function zoomOut() {
  zoom /= 1.2;
  zoom = constrain(zoom, 0.05, 80);
}

// Touch pinch zoom
function touchMoved() {
  // Only when exactly two fingers are on the canvas
  if (touches.length === 2) {
    let dx = touches[0].x - touches[1].x;
    let dy = touches[0].y - touches[1].y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (pinchStartDist === null) {
      pinchStartDist = d;
      startZoom = zoom;
    } else {
      let factor = d / pinchStartDist;
      zoom = startZoom * factor;
      zoom = constrain(zoom, 0.05, 80);
    }
    return false; // prevent page scrolling / browser zoom
  }
}

function touchEnded() {
  if (touches.length < 2) {
    pinchStartDist = null;
  }
}
