// Pi visualization: z(theta) = e^(i theta) + e^(i pi theta)
// Two arms + endpoint trail + pinch zoom + 1‑finger pan. [web:2][web:7][web:3]

let theta = 0;
let speed = 0.02;          // drawing speed; increase for faster

let r1, r2;
const RATIO = Math.PI;     // second rotation speed = π

// trail of endpoint
let pts = [];

// camera
let zoom = 0.7;
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
  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeRadii();
  background(0);
}

function computeRadii() {
  const s = min(width, height);
  r1 = s * 0.18;
  r2 = s * 0.32;
}

function draw() {
  background(0);

  // camera
  translate(width / 2 + offsetX, height / 2 + offsetY);
  scale(zoom);

  // current arm endpoints
  let x1 = r1 * cos(theta);
  let y1 = r1 * sin(theta);

  let x2 = x1 + r2 * cos(RATIO * theta);
  let y2 = y1 + r2 * sin(RATIO * theta);

  // store endpoint for trail
  pts.push(createVector(x2, y2));

  // draw trail of endpoint
  stroke(200);
  strokeWeight(1 / zoom);
  noFill();
  beginShape();
  for (let p of pts) {
    vertex(p.x, p.y);
  }
  endShape();

  // draw current arms
  stroke(255);
  line(0, 0, x1, y1);
  line(x1, y1, x2, y2);

  // moving endpoint
  fill(255);
  noStroke();
  circle(x2, y2, 4 / zoom);

  theta += speed;
}

// ---------- Mouse wheel zoom (desktop) ----------
function mouseWheel(event) {
  const factor = 1.0 + event.delta * -0.001;
  zoom *= factor;
  zoom = constrain(zoom, 0.05, 80);
  return false;
}

// ---------- Mouse drag pan (desktop) ----------
function mousePressed() {
  if (touches.length === 0) {
    isDragging = true;
    lastDragX = mouseX;
    lastDragY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging) {
    offsetX += (mouseX - lastDragX);
    offsetY += (mouseY - lastDragY);
    lastDragX = mouseX;
    lastDragY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

// ---------- Touch: one finger = pan, two fingers = pinch ----------
function touchMoved() {
  if (touches.length === 1) {
    // drag pan
    let t = touches[0];
    if (!isDragging) {
      isDragging = true;
      lastDragX = t.x;
      lastDragY = t.y;
    } else {
      offsetX += (t.x - lastDragX);
      offsetY += (t.y - lastDragY);
      lastDragX = t.x;
      lastDragY = t.y;
    }
    return false;
  }

  if (touches.length === 2) {
    // pinch zoom
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
