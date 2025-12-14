// Pi visualization with zoom + pan
// z(theta) = e^(i theta) + e^(i pi theta)

let theta = 0;
let speed = 0.01;

let r1, r2;
let trail = [];

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
  // fade previous frame slightly
  noStroke();
  fill(0, 40);
  rect(0, 0, width, height);

  // camera transform
  translate(width / 2 + offsetX, height / 2 + offsetY);
  scale(zoom);

  // current endpoints
  let x1 = r1 * cos(theta);
  let y1 = r1 * sin(theta);

  let x2 = x1 + r2 * cos(Math.PI * theta);
  let y2 = y1 + r2 * sin(Math.PI * theta);

  // helper circles
  noFill();
  stroke(160);
  strokeWeight(1 / zoom);
  circle(0, 0, 2 * r1);
  circle(x1, y1, 2 * r2);

  // arms
  stroke(220);
  line(0, 0, x1, y1);
  line(x1, y1, x2, y2);

  // update short trail near the tip
  trail.push(createVector(x2, y2));
  const maxTrail = 200;
  if (trail.length > maxTrail) {
    trail.splice(0, trail.length - maxTrail);
  }

  // draw trail
  stroke(220);
  strokeWeight(1 / zoom);
  noFill();
  beginShape();
  for (let p of trail) {
    vertex(p.x, p.y);
  }
  endShape();

  // tip point
  fill(255);
  noStroke();
  circle(x2, y2, 4 / zoom);

  theta += speed;
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
    // 1‑finger drag pan
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
