let steps = [];
let currentStep = 0;
let isPlaying = false;
let lastStepTime = 0;
let stepInterval = 500; // ms

function collectRulerSteps(x1, x2, y, height, level) {
  if (level === 0) return;
  let xm = (x1 + x2) / 2;
  steps.push({xm, y, height, x1, x2});
  collectRulerSteps(x1, xm, y, height - 10, level - 1);
  collectRulerSteps(xm, x2, y, height - 10, level - 1);
}

function setup() {
  createCanvas(800, 600);
  textFont('Arial');
  collectRulerSteps(100, 700, 300, 60, 6);
}

function draw() {
  background(255);
  // Ruler
  stroke(80);
  line(100, 300, 700, 300);
  fill(255, 230, 100);
  rect(100, 220, 600, 90);
  noFill();
  stroke(80);
  rect(100, 220, 600, 90);

  // Draw steps
  stroke(0);
  for (let i = 0; i < currentStep; i++) {
    let s = steps[i];
    line(s.xm, 220, s.xm, 220 + (s.height + 30) * 0.5);
  }

  // Draw ticks and numbers
  for (let i = 0; i <= 16; i++) {
    let x = 100 + (700 - 100) * i / 16;
    line(x, 210, x, 220);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(i, x, 210 - 4);
  }

  // Info
  if (currentStep > 0 && currentStep <= steps.length) {
    let s = steps[currentStep - 1];
    let px_per_cm = 37.8;
    let start_cm = ((s.x1 - 100) / px_per_cm).toFixed(0);
    let end_cm = ((s.x2 - 100) / px_per_cm).toFixed(0);
    let pos_cm = ((s.xm - 100) / px_per_cm).toFixed(1);
    let height_cm = (s.height / px_per_cm).toFixed(2);
    fill(150, 0, 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(`Chia đoạn [${start_cm}, ${end_cm}]: vẽ vạch ở vị trí = ${pos_cm} cm, độ cao = ${height_cm} cm`, width/2, 120);
  }

  // Controls
  fill(60);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Click các nút hoặc dùng phím ←/→, SPACE", 10, 10);
  text(`Bước: ${currentStep}/${steps.length}`, 10, 35);

  // Buttons
  drawButton(10, 450, 120, 30, "⏮ Reset");
  drawButton(140, 450, 120, 30, isPlaying ? "⏸ Pause" : "▶ Play");
  drawButton(270, 450, 120, 30, "⏪ Prev");
  drawButton(400, 450, 120, 30, "⏩ Next");

  // Slider
  let sliderX = 550, sliderW = 230, sliderY = 450 + (30 - 20) / 2;
  fill(220);
  rect(sliderX, sliderY, sliderW, 20);
  fill(80);
  let sliderPos = sliderX + (currentStep / steps.length) * sliderW;
  rect(sliderPos - 5, sliderY - 5, 10, 30);

  // Auto play
  if (isPlaying && currentStep < steps.length && millis() - lastStepTime > stepInterval) {
    currentStep++;
    lastStepTime = millis();
  }
}

function mousePressed() {
  // Button logic
  if (mouseY > 450 && mouseY < 480) {
    if (mouseX > 10 && mouseX < 130) currentStep = 0;
    else if (mouseX > 140 && mouseX < 260) isPlaying = !isPlaying;
    else if (mouseX > 270 && mouseX < 390 && currentStep > 0) currentStep--;
    else if (mouseX > 400 && mouseX < 520 && currentStep < steps.length) currentStep++;
    // Slider
    else if (mouseX > 550 && mouseX < 780) {
      let percent = (mouseX - 550) / 230;
      currentStep = Math.round(percent * steps.length);
      if (currentStep < 0) currentStep = 0;
      if (currentStep > steps.length) currentStep = steps.length;
    }
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW && currentStep < steps.length) currentStep++;
  if (keyCode === LEFT_ARROW && currentStep > 0) currentStep--;
  if (key === ' ') isPlaying = !isPlaying;
}

function drawButton(x, y, w, h, label) {
  fill(220);
  rect(x, y, w, h, 5);
  stroke(80);
  noFill();
  rect(x, y, w, h, 5);
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x + w/2, y + h/2);
}
