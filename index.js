// Biến toàn cục để quản lý ứng dụng Ruler Divider
let appState = {
  steps: [],
  currentStep: 0,
  isPlaying: false,
  lastStepTime: 0,
  stepInterval: 100, // ms
  
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
    pxPerCm16: 0 // cố định theo thước 16cm
  },
  
  animationFrame: null
};

// Hàm khởi tạo ứng dụng
function initApp() {
  setupCanvas();
  setupEventListeners();
  updateRulerLayout();
  startAnimationLoop();
}
  
// Hàm thiết lập canvas
function setupCanvas() {
  appState.canvas = document.getElementById('rulerCanvas');
  appState.ctx = appState.canvas.getContext('2d');
  resizeCanvas();
  
  // Thêm event listener cho resize
  window.addEventListener('resize', () => resizeCanvas());
}

// Hàm resize canvas
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
  
// Hàm thiết lập event listeners
function setupEventListeners() {
  // Input và nút áp dụng
  const inputLength = document.getElementById('rulerLength');
  const btnApply = document.getElementById('btnApply');
  
  btnApply.addEventListener('click', () => {
    const len = parseFloat(inputLength.value);
    if (!isNaN(len) && len > 0) {
      appState.rulerLengthCm = len;
      updateRulerLayout();
    }
  });
  
  // Các nút điều khiển
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
  
  // Slider
  const slider = document.getElementById('stepSlider');
  slider.addEventListener('input', (e) => {
    appState.currentStep = parseInt(e.target.value);
    updateStepInfo();
  });
  
  // Phím tắt
  document.addEventListener('keydown', (e) => {
    switch(e.code) {
      case 'ArrowRight':
        if (appState.currentStep < appState.steps.length) {
          appState.currentStep++;
          updateStepInfo();
        }
        break;
      case 'ArrowLeft':
        if (appState.currentStep > 0) {
          appState.currentStep--;
          updateStepInfo();
        }
        break;
      case 'Space':
        e.preventDefault();
        appState.isPlaying = !appState.isPlaying;
        updatePlayButton();
        if (appState.isPlaying) {
          appState.lastStepTime = Date.now();
        }
        break;
    }
  });
}
  
// Hàm cập nhật layout thước
function updateRulerLayout() {
  // Tính toán kích thước và vị trí thước
  appState.rulerData.width = appState.canvasWidth * 0.9;
  appState.rulerData.pxPerCm = appState.rulerData.width / appState.rulerLengthCm;
  appState.rulerData.pxPerCm16 = appState.rulerData.width / 16; // cố định theo thước 16cm
  appState.rulerData.startX = appState.canvasWidth * 0.05;
  appState.rulerData.endX = appState.rulerData.startX + appState.rulerData.width;
  appState.rulerData.y = appState.canvasHeight * 0.7;
  
  // Tạo lại các bước
  appState.steps = [];
  appState.currentStep = 0;
  collectRulerStepsCm(0, appState.rulerLengthCm, appState.rulerData.y, 1.5);
  
  // Cập nhật slider
  const slider = document.getElementById('stepSlider');
  slider.max = appState.steps.length;
  slider.value = 0;
  
  updateStepInfo();
}
  
// Hàm thu thập các bước chia thước
function collectRulerStepsCm(cm1, cm2, y, tickLengthCm) {
  // Dừng nếu đoạn chia quá nhỏ hoặc độ cao vạch quá nhỏ
  if (tickLengthCm <= 0.1 || Math.abs(cm2 - cm1) < 0.01) return;
  
  const cmm = (cm1 + cm2) / 2;
  const xm = appState.rulerData.startX + cmm * appState.rulerData.pxPerCm;
  const x1 = appState.rulerData.startX + cm1 * appState.rulerData.pxPerCm;
  const x2 = appState.rulerData.startX + cm2 * appState.rulerData.pxPerCm;
  const tickHeight = tickLengthCm * appState.rulerData.pxPerCm16; // Luôn lấy theo thước 16cm
  
  appState.steps.push({
    xm,
    y,
    height: tickHeight,
    x1,
    x2,
    cm1,
    cm2,
    cmm,
    tickLengthCm
  });
  
  // Mỗi lần giảm độ dài vạch 0.2 cm
  const nextTickLengthCm = tickLengthCm - 0.2;
  collectRulerStepsCm(cm1, cmm, y, nextTickLengthCm);
  collectRulerStepsCm(cmm, cm2, y, nextTickLengthCm);
}
  
// Hàm cập nhật nút Play
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
  
// Hàm cập nhật thông tin bước
function updateStepInfo() {
  // Cập nhật thông tin bước hiện tại
  document.getElementById('currentStepInfo').textContent = 
    `Bước: ${appState.currentStep}/${appState.steps.length}`;
  
  // Cập nhật slider
  document.getElementById('stepSlider').value = appState.currentStep;
  
  // Cập nhật chi tiết bước
  const stepDetails = document.getElementById('stepDetails');
  if (appState.currentStep > 0 && appState.currentStep <= appState.steps.length) {
    const step = appState.steps[appState.currentStep - 1];
    stepDetails.textContent = 
      `Chia đoạn [${step.cm1.toFixed(2)}, ${step.cm2.toFixed(2)}]: ` +
      `vẽ vạch ở vị trí = ${step.cmm.toFixed(2)} cm, ` +
      `độ cao = ${step.tickLengthCm.toFixed(2)} cm`;
  } else {
    stepDetails.textContent = '';
  }
}
  
// Hàm khởi động vòng lặp animation
function startAnimationLoop() {
  const animate = () => {
    // Auto play logic
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
  
// Hàm vẽ chính
function draw() {
  // Xóa canvas
  appState.ctx.clearRect(0, 0, appState.canvasWidth, appState.canvasHeight);
  
  // Vẽ nền thước
  drawRulerBackground();
  
  // Vẽ các vạch số
  drawRulerNumbers();
  
  // Vẽ các bước đã thực hiện
  drawSteps();
}
  
// Hàm vẽ nền thước
function drawRulerBackground() {
  const ctx = appState.ctx;
  const ruler = appState.rulerData;
  
  // Vẽ nền thước (màu vàng nhạt)
  ctx.fillStyle = '#fff6cc';
  ctx.fillRect(ruler.startX, ruler.y - 80, ruler.width, 90);
  
  // Vẽ viền thước
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(ruler.startX, ruler.y - 80, ruler.width, 90);
  
  // Vẽ đường cơ sở thước
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ruler.startX, ruler.y);
  ctx.lineTo(ruler.endX, ruler.y);
  ctx.stroke();
}
  
// Hàm vẽ các số trên thước
function drawRulerNumbers() {
  const ctx = appState.ctx;
  const ruler = appState.rulerData;
  
  // Vẽ các số và vạch chính
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  
  for (let i = 0; i <= appState.rulerLengthCm; i++) {
    const x = ruler.startX + (ruler.width * i) / appState.rulerLengthCm;
    
    // Vẽ vạch
    ctx.beginPath();
    ctx.moveTo(x, ruler.y - 90);
    ctx.lineTo(x, ruler.y - 80);
    ctx.stroke();
    
    // Vẽ số
    ctx.fillText(i.toString(), x, ruler.y - 94);
  }
}
  
// Hàm vẽ các bước
function drawSteps() {
  const ctx = appState.ctx;
  
  // Vẽ các vạch đã được tạo
  for (let i = 0; i < appState.currentStep; i++) {
    const step = appState.steps[i];
    
    ctx.strokeStyle = i === appState.currentStep - 1 ? '#e74c3c' : '#333';
    ctx.lineWidth = i === appState.currentStep - 1 ? 3 : 2;
    
    // Thêm hiệu ứng cho vạch hiện tại
    if (i === appState.currentStep - 1) {
      ctx.shadowColor = '#e74c3c';
      ctx.shadowBlur = 5;
    }
    
    ctx.beginPath();
    ctx.moveTo(step.xm, step.y - 80);
    ctx.lineTo(step.xm, step.y - 80 + (step.height + 30) * 0.5);
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }
}
  
// Hàm dọn dẹp
function destroyApp() {
  if (appState.animationFrame) {
    cancelAnimationFrame(appState.animationFrame);
  }
  window.removeEventListener('resize', () => resizeCanvas());
}

// Khởi tạo ứng dụng khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Cleanup khi unload
window.addEventListener('beforeunload', () => {
  destroyApp();
});
