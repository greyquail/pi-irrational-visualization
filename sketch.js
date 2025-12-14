// Pi irrationality epicycle
// z(theta) = R e^(i theta) + R e^(i pi theta)
// both arms length R, permanent trail, zoom + pan

let theta = 0;
let speed = 0.003;      // smaller = slower, denser
let R;
let pts = [];

// camera
let zoom = 0.9;
let offsetX = 0;
let offsetY = 0;

// drag state
let isDragging = false;
let lastDragX = 0;
let lastDragY = 0;

// pinch state (mobile)
let pinchStartDist = null;
let startZoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  computeRadius();
  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeRadius();
}

function computeRadius() {
  const s = min(width, height);
  R = s * 0.28;           // both arms use this
}

function draw() {
  background(0);

  // camera transform
  translate(width / 2 + offsetX, height / 2 + offsetY);
  scale(zoom);

  // add many points per frame so it fills quickly
  for (let k = 0; k < 30; k++) {
    let x1 = R * cos(theta);
    let y1 = R * sin(theta);

    // second arm SAME length R
    let x2 = x1 + R * cos(Math.PI * theta);
    let y2 = y1 + R * sin(Math.PI * theta);

    pts.push(createVector(x2, y2));
    theta += speed;
  }

  // draw trail
  stroke(200);
  strokeWeight(1 / zoom);
  noFill();
  beginShape();
  for (let p of pts) vertex(p.x, p.y);
  endShape();

  // helper circles
  stroke(120);
  noFill();
  circle(0, 0, 2 * R);
  let x1c = R * cos(theta);
  let y1c = R * sin(theta);
  circle(x1c, y1c, 2 * R);

  // arms
  stroke(255);
  line(0, 0, x1c, y1c);
  let x2c = x1c + R * cos(Math.PI * theta);
  let y2c = y1c + R * sin(Math.PI * theta);
  line(x1c, y1c, x2c, y2c);

  // tip
  noStroke();
  fill(255);
  circle(x2c, y2c, 4 / zoom);
}

// mouse wheel zoom (desktop)
function mouseWheel(event) {
  const factor = 1.0 + event.delta * -0.001;
  zoom *= factor;
  zoom = constrain(zoom, 0.05, 80);
  return false;
}

// mouse drag pan (desktop)
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

// touch: one finger = pan, two fingers = pinch zoom
function touchMoved() {
  if (touches.length === 1) {
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
  if (touches.length < 2) pinchStartDist = null;
  if (touches.length === 0) isDragging = false;
}
