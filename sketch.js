let toppingPositions = []; // Store static topping positions
let lastMinute = -1; // Track the last minute
let hourStartMinute = 0; // Minute when the current hour started

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);

  let currentMinute = minute();
  let currentHour = hour() % 12 || 12;

  // Initialize toppings only for the current minute, excluding the missing slice
  for (let i = 0; i < currentMinute; i++) {
    addTopping(currentHour);
  }
}

function draw() {
  let h = hour() % 12 || 12;
  let m = minute();
  let s = second();
  let isAM = hour() < 12;

  // Background color and visuals for AM/PM
  if (isAM) {
    background(135, 206, 250); 
    drawSun();
  } else {
    background(25, 25, 112); 
    drawMoon();
  }

  translate(width / 2, height / 2);

  // Check if minute changed
  if (m !== lastMinute) {
    lastMinute = m;

    // Reset toppings at new hour
    if (m === 0) {
      toppingPositions = [];
      hourStartMinute = m;
    }

    // Add a new topping for the current minute
    if (toppingPositions.length < 60 && m !== 0) {
      addTopping(h);
    }

    console.log("Current Minute: " + m);
  }

  // Rotate the entire pizza to match usual clocks
  rotate(-90);

  // Draw Plate
  let missingSliceStart = ((h - 1) * 360) / 12;
  let missingSliceEnd = (h * 360) / 12;
  fill(255); // Plate color
  noStroke();
  arc(0, 0, 300, 300, missingSliceStart, missingSliceEnd, PIE);

  // Pizza and crust
  for (let i = 0; i < 12; i++) {
    let startAngle = (i * 360) / 12;
    let endAngle = ((i + 1) * 360) / 12;

    if (i === h - 1) {
      continue; // Skip slice for current hour
    }

    fill(255, 170, 70); 
    stroke(150, 75, 0); 
    strokeWeight(5);
    arc(0, 0, 280, 280, startAngle, endAngle, PIE);

    // Crust
    noFill();
    stroke(150, 75, 0);
    strokeWeight(8);
    arc(0, 0, 290, 290, startAngle, endAngle);
  }

  // Draw pepperoni (minutes)
  fill(200, 50, 50);
  noStroke();
  for (let pos of toppingPositions) {
    ellipse(pos.x, pos.y, 15, 15);
  }

  // Delivery car (seconds)
  let carAngle = map(s, 0, 60, 0, 360);
  let carRadius = 160;
  let carX = carRadius * cos(carAngle);
  let carY = carRadius * sin(carAngle);

  push();
  translate(carX, carY);
  rotate(carAngle + 90);

  // Body
  fill(255, 0, 0);
  rect(-15, -10, 30, 20, 5);

  // Roof
  fill(200, 0, 0);
  rect(-10, -15, 20, 10, 3);

  // Windows
  fill(255);
  rect(-9, -13, 9, 7);
  rect(1, -13, 9, 7);

  // Wheels
  fill(50);
  ellipse(-10, 12, 8, 8); // Left wheel
  ellipse(10, 12, 8, 8); // Right wheel

  pop();
}

// Add new topping at random position w/o overlap with other mins or in missing slice
function addTopping(h) {
  let missingSliceStart = ((h - 1) * 360) / 12;
  let missingSliceEnd = (h * 360) / 12;
  let attempts = 0;

  while (attempts < 1000) {
    let angle = random(0, 360);
    let r = random(50, 130);
    let x = r * cos(angle);
    let y = r * sin(angle);

    // Check overlap
    let overlapping = toppingPositions.some(
      (pos) => dist(x, y, pos.x, pos.y) < 20
    );

    // Check if in missing slice
    let isInMissingSlice = isInMissingSliceRange(angle, missingSliceStart, missingSliceEnd);

    // Only add topping if not in the missing slice, no overlap
    if (!overlapping && !isInMissingSlice) {
      toppingPositions.push({ x, y });
      break;
    }

    attempts++;
  }
}

// Check if an angle is within the missing slice range
function isInMissingSliceRange(angle, missingSliceStart, missingSliceEnd) {
  // Check if missing slice spans across 360 degrees
  if (missingSliceStart < missingSliceEnd) {
    return angle >= missingSliceStart && angle < missingSliceEnd;
  } else {
    // Slice crosses 360 degrees (e.g., 330° to 30°)
    return angle >= missingSliceStart || angle < missingSliceEnd;
  }
}

// Draw the sun for AM
function drawSun() {
  push();
  translate(width / 2, 100); 
  fill(255, 223, 0);
  noStroke();
  ellipse(0, 0, 50, 50);
  pop();
}

// Draw the moon for PM
function drawMoon() {
  push();
  translate(width / 2, 100); 
  fill(255, 255, 224);
  noStroke();
  ellipse(0, 0, 50, 50);
  fill(25, 25, 112);
  ellipse(10, 0, 40, 40); 
  pop();
}
