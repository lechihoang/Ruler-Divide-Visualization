let appState = {
  steps: [],
  currentStep: 0,
  isPlaying: false,
  lastStepTime: 0,
  stepInterval: 100,
  rulerLengthCm: 16,
  canvas: null,
  ctx: null,
  canvasWidth: 0,
  canvasHeight: 0,
  rulerData: {
    startX: 0,
    endX: 0,
    y: 0,
    width: 0,
    pxPerCm: 0,
    pxPerCm16: 0
  },
  animationFrame: null,
  maxLevel: 6,
  initialTickHeight: 40
};

function initApp() {
  setupCanvas();
  setupEventListeners();
  updateRulerLayout();
  startAnimationLoop();
}

function setupCanvas() {
  appState.canvas = document.getElementById('rulerCanvas');
  appState.ctx = appState.canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', () => resizeCanvas());
}

function resizeCanvas() {
  const container = appState.canvas.parentElement;
  appState.canvasWidth = Math.min(1000, container.clientWidth - 40);
  appState.canvasHeight = 250;
  appState.canvas.width = appState.canvasWidth;
  appState.canvas.height = appState.canvasHeight;
  appState.canvas.style.width = appState.canvasWidth + 'px';
  appState.canvas.style.height = appState.canvasHeight + 'px';
  updateRulerLayout();
}

function setupEventListeners() {
  const inputLength = document.getElementById('rulerLength');
  const inputMaxLevel = document.getElementById('maxLevel');
  const btnApply = document.getElementById('btnApply');
  btnApply.addEventListener('click', () => {
    const len = parseFloat(inputLength.value);
    const maxLevel = parseInt(inputMaxLevel.value);
    if (!isNaN(len) && len > 0) {
      appState.rulerLengthCm = len;
    }
    if (!isNaN(maxLevel) && maxLevel > 0) {
      appState.maxLevel = maxLevel;
    }
    updateRulerLayout();
  });
  document.getElementById('btnReset').addEventListener('click', () => {
    appState.currentStep = 0;
    appState.isPlaying = false;
    updatePlayButton();
    updateStepInfo();
  });
  document.getElementById('btnPlay').addEventListener('click', () => {
    appState.isPlaying = !appState.isPlaying;
    updatePlayButton();
    if (appState.isPlaying) {
      appState.lastStepTime = Date.now();
    }
  });
  document.getElementById('btnPrev').addEventListener('click', () => {
    if (appState.currentStep > 0) {
      appState.currentStep--;
      updateStepInfo();
    }
  });
  document.getElementById('btnNext').addEventListener('click', () => {
    if (appState.currentStep < appState.steps.length) {
      appState.currentStep++;
      updateStepInfo();
    }
  });
  const slider = document.getElementById('stepSlider');
  slider.addEventListener('input', (e) => {
    appState.currentStep = parseInt(e.target.value);
    updateStepInfo();
  });
}

function updateRulerLayout() {
  appState.rulerData.width = appState.canvasWidth * 0.9;
  appState.rulerData.pxPerCm = appState.rulerData.width / appState.rulerLengthCm;
  appState.rulerData.pxPerCm16 = appState.rulerData.width / 16;
  appState.rulerData.startX = appState.canvasWidth * 0.05;
  appState.rulerData.endX = appState.rulerData.startX + appState.rulerData.width;
  appState.rulerData.y = appState.canvasHeight * 0.7;
  appState.steps = [];
  appState.currentStep = 0;
  collectRulerStepsPx(0, appState.rulerLengthCm, appState.rulerData.y, appState.initialTickHeight, 1);
  const slider = document.getElementById('stepSlider');
  slider.max = appState.steps.length;
  slider.value = 0;
  updateStepInfo();
}

function collectRulerStepsPx(cm1, cm2, y, tickHeightPx, level) {
  if (level > appState.maxLevel || Math.abs(cm2 - cm1) < 0.01) return;
  const cmm = (cm1 + cm2) / 2;
  const xm = appState.rulerData.startX + cmm * appState.rulerData.pxPerCm;
  const x1 = appState.rulerData.startX + cm1 * appState.rulerData.pxPerCm;
  const x2 = appState.rulerData.startX + cm2 * appState.rulerData.pxPerCm;
  appState.steps.push({
    xm,
    y,
    height: tickHeightPx,
    x1,
    x2,
    cm1,
    cm2,
    cmm,
    level
  });
  const delta = (1 / appState.maxLevel) * appState.initialTickHeight;
  const nextTickHeightPx = tickHeightPx - delta;
  if (nextTickHeightPx > 0.1) {
    collectRulerStepsPx(cm1, cmm, y, nextTickHeightPx, level + 1);
    collectRulerStepsPx(cmm, cm2, y, nextTickHeightPx, level + 1);
  }
}

function updatePlayButton() {
  const btnPlay = document.getElementById('btnPlay');
  if (appState.isPlaying) {
    btnPlay.textContent = '⏸ Pause';
    btnPlay.classList.add('playing');
  } else {
    btnPlay.textContent = '▶ Play';
    btnPlay.classList.remove('playing');
  }
}

function updateStepInfo() {
  document.getElementById('currentStepInfo').textContent = 
    `Bước: ${appState.currentStep}/${appState.steps.length}`;
  document.getElementById('stepSlider').value = appState.currentStep;
  const stepDetails = document.getElementById('stepDetails');
  if (appState.currentStep > 0 && appState.currentStep <= appState.steps.length) {
    const step = appState.steps[appState.currentStep - 1];
    stepDetails.textContent =
      `Chia đoạn [${step.cm1.toFixed(2)}, ${step.cm2.toFixed(2)}]: ` +
      `vẽ vạch ở vị trí = ${step.cmm.toFixed(2)} cm, ` +
      `độ cao = ${step.height.toFixed(2)} px, level = ${step.level}`;
  } else {
    stepDetails.textContent = '';
  }
}

function startAnimationLoop() {
  const animate = () => {
    if (appState.isPlaying && appState.currentStep < appState.steps.length) {
      const currentTime = Date.now();
      if (currentTime - appState.lastStepTime > appState.stepInterval) {
        appState.currentStep++;
        appState.lastStepTime = currentTime;
        updateStepInfo();
        if (appState.currentStep >= appState.steps.length) {
          appState.isPlaying = false;
          updatePlayButton();
        }
      }
    }
    draw();
    appState.animationFrame = requestAnimationFrame(animate);
  };
  animate();
}

function draw() {
  appState.ctx.clearRect(0, 0, appState.canvasWidth, appState.canvasHeight);
  drawRulerBackground();
  drawRulerNumbers();
  drawSteps();
}

function drawRulerBackground() {
  const ctx = appState.ctx;
  const ruler = appState.rulerData;
  ctx.fillStyle = '#fff6cc';
  ctx.fillRect(ruler.startX, ruler.y - 80, ruler.width, 90);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(ruler.startX, ruler.y - 80, ruler.width, 90);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ruler.startX, ruler.y);
  ctx.lineTo(ruler.endX, ruler.y);
  ctx.stroke();
}

function drawRulerNumbers() {
  const ctx = appState.ctx;
  const ruler = appState.rulerData;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  for (let i = 0; i <= appState.rulerLengthCm; i++) {
    const x = ruler.startX + (ruler.width * i) / appState.rulerLengthCm;
    ctx.beginPath();
    ctx.moveTo(x, ruler.y - 90);
    ctx.lineTo(x, ruler.y - 80);
    ctx.stroke();
    ctx.fillText(i.toString(), x, ruler.y - 94);
  }
}

function drawSteps() {
  const ctx = appState.ctx;
  for (let i = 0; i < appState.currentStep; i++) {
    const step = appState.steps[i];
    ctx.strokeStyle = i === appState.currentStep - 1 ? '#e74c3c' : '#333';
    ctx.lineWidth = i === appState.currentStep - 1 ? 3 : 2;
    if (i === appState.currentStep - 1) {
      ctx.shadowColor = '#e74c3c';
      ctx.shadowBlur = 5;
    }
    ctx.beginPath();
    ctx.moveTo(step.xm, step.y - 80);
    ctx.lineTo(step.xm, step.y - 80 + (step.height + 30) * 0.5);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function destroyApp() {
  if (appState.animationFrame) {
    cancelAnimationFrame(appState.animationFrame);
  }
  window.removeEventListener('resize', () => resizeCanvas());
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

window.addEventListener('beforeunload', () => {
  destroyApp();
});
