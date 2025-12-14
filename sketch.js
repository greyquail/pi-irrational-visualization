// Permanent Pi flower with zoom + pan
// z(theta) = e^(i theta) + e^(i pi theta)

let theta = 0;
let speed = 0.01;

let r1, r2;
let pts = [];          // all past tip positions

// camera
let zoom = 0.9;
let offsetX = 0;
let offsetY = 0;

// drag state
let isDragging = false;
let lastDragX = 0;
let lastDragY = 0;

// pinch state
let pinchStartDist = null;
let startZoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  computeRadii();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeRadii();
}

function computeRadii() {
  const s = min(width, height);
  r1 = s * 0.18;
  r2 = s * 0.32;
}

function draw() {
  background(0);  // clear fully, we redraw EVERYTHING from pts

  // camera
  translate(width / 2 + offsetX, height / 2 + offsetY);
  scale(zoom);

  // grow trail: add several points per frame so pattern builds faster
  for (let k = 0; k < 4; k++) {
    let x1 = r1 * cos(theta);
    let y1 = r1 * sin(theta);

    let x2 = x1 + r2 * cos(Math.PI * theta);
    let y2 = y1 + r2 * sin(Math.PI * theta);

    pts.push(createVector(x2, y2));
    theta += speed;
  }

  // draw full flower path from all stored points
  stroke(200);
  strokeWeight(1 / zoom);
  noFill();
  beginShape();
  for (let p of pts) {
    vertex(p.x, p.y);
  }
  endShape();

  // draw helper circles
  stroke(120);
  strokeWeight(1 / zoom);
  noFill();
  circle(0, 0, 2 * r1);
  if (pts.length > 0) {
    // current first-arm endpoint for second circle
    let x1 = r1 * cos(theta);
    let y1 = r1 * sin(theta);
    circle(x1, y1, 2 * r2);
  }

  // draw current arms
  let x1c = r1 * cos(theta);
  let y1c = r1 * sin(theta);
  let x2c = x1c + r2 * cos(Math.PI * theta);
  let y2c = y1c + r2 * sin(Math.PI * theta);

  stroke(255);
  line(0, 0, x1c, y1c);
  line(x1c, y1c, x2c, y2c);

  // tip
  fill(255);
  noStroke();
  circle(x2c, y2c, 4 / zoom);
}

// --------- mouse wheel zoom (desktop) ----------
function mouseWheel(event) {
  const factor = 1.0 + event.delta * -0.001;
  zoom *= factor;
  zoom = constrain(zoom, 0.05, 80);
  return false;
}

// --------- mouse drag pan (desktop) ----------
function mousePressed() {
  if (touches.length === 0) {
    isDragging = true;
    lastDragX = mouseX;
    lastDragY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging) {
    offsetX += mouseX - lastDragX;
    offsetY += mouseY - lastDragY;
    lastDragX = mouseX;
    lastDragY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

// --------- touch: one finger = pan, two fingers = pinch ----------
function touchMoved() {
  if (touches.length === 1) {
    // 1‑finger pan
    let t = touches[0];
    if (!isDragging) {
      isDragging = true;
      lastDragX = t.x;
      lastDragY = t.y;
    } else {
      offsetX += t.x - lastDragX;
      offsetY += t.y - lastDragY;
      lastDragX = t.x;
      lastDragY = t.y;
    }
    return false;
  }

  if (touches.length === 2) {
    // 2‑finger pinch zoom
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
    return false;
  }
}

function touchEnded() {
  if (touches.length < 2) {
    pinchStartDist = null;
  }
  if (touches.length === 0) {
    isDragging = false;
  }
}
