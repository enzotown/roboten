// loop.js — uppdatering, teckning och spelvarv
function update(dt) {
  time += dt;
  updateRun(dt);

  if (winT > 0) {
    winT -= dt;
    if (winT <= 0) {
      if (level >= LEVELS.length - 1) winAll = true;
      else loadLevel(level + 1);
    }
  }
  if (bumpT > 0) bumpT -= dt;
  if (levelIntro > 0) levelIntro -= dt;

  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life -= dt * 0.85;
    p.vy += p.g * dt;
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.rot += p.rz * dt;
    if (p.life <= 0 || p.y > DH + 40) parts.splice(i, 1);
  }
}

function drawScene() {
  drawBackdrop();
  drawBoard();
  const lv = LEVELS[level];
  drawStartPad(lv.start.c, lv.start.r);

  for (let i = 0; i < lv.water.length; i++) drawWater(lv.water[i][0], lv.water[i][1]);
  for (let i = 0; i < lv.stones.length; i++) drawStone(lv.stones[i][0], lv.stones[i][1]);

  const g = cellCenter(lv.goal.c, lv.goal.r);
  drawFruit(lv.kind, g.x, g.y, 1.05);
  if (lv.key && !keyTaken) {
    const k = cellCenter(lv.key.c, lv.key.r);
    drawKey(k.x, k.y, 0.95, true);
  }

  drawPreview();

  const bob = running ? Math.abs(Math.sin(Math.min(1, stepT / STEP) * Math.PI)) * 4 : Math.sin(time * 2) * 1.5;
  let mx = 0;
  if (bumpT > 0) mx = Math.sin(time * 42) * 2.5;
  const mood = bumpT > 0 ? 'bump' : (winT > 0 ? 'happy' : 'idle');
  drawRobot(robotX + mx, robotY - hopZ - bob, robotA, time, mood);

  drawParts();
  drawBumpBubble();
}

function draw() {
  drawScene();
  drawTopBar();
  drawButtons();
  drawStrip();
  drawKeyBadge();
  drawWin();
  if (winAll) drawWinAll();
  if (showHelp) drawHelp();
}

let last = performance.now();
function frame(now) {
  if (window.__noLoop) return;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.05) dt = 0.05;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

resize();
loadLevel(0);
requestAnimationFrame(frame);