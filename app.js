// app.js — nivåer, inmatning och spelets gång
/* Skolappars kodsnutt: säger till katalogen när en omgång är klar (inga id:n, inga cookies) */
function skolKlar(pct) {
  try { if (window.skolappar && skolappar.event) skolappar.event('round_done', Math.max(0, Math.min(100, Math.round(pct)))); } catch (e) {}
}

const LEVELS = [
  { kind: 'apple', start: { c: 0, r: 5, h: 'e' }, goal: { c: 2, r: 5 },
    stones: [[3, 2], [5, 4]], water: [[6, 1]] },
  { kind: 'banana', start: { c: 1, r: 5, h: 'e' }, goal: { c: 1, r: 3 },
    stones: [[3, 3], [3, 4]], water: [[5, 5]] },
  { kind: 'strawberry', start: { c: 1, r: 5, h: 'n' }, goal: { c: 1, r: 0 },
    stones: [[1, 3]], water: [[2, 2]] },
  { kind: 'apple', start: { c: 0, r: 5, h: 'e' }, goal: { c: 6, r: 5 },
    stones: [[7, 0], [2, 2], [5, 2]], water: [[2, 5], [4, 1]] },
  { kind: 'banana', start: { c: 1, r: 5, h: 'e' }, goal: { c: 3, r: 3 },
    stones: [[6, 2], [6, 3]], water: [[2, 5], [3, 5], [4, 5]] },
  { kind: 'strawberry', start: { c: 0, r: 5, h: 'e' }, goal: { c: 2, r: 1 },
    stones: [[3, 4], [4, 2], [0, 2]], water: [[2, 5], [3, 5]] },
  { kind: 'apple', start: { c: 0, r: 5, h: 'e' }, key: { c: 1, r: 3 }, goal: { c: 3, r: 2 },
    stones: [[2, 3], [4, 4], [6, 1]], water: [[5, 5], [5, 4]] }
];

const HEAD = { e: { dc: 1, dr: 0, a: 0 }, s: { dc: 0, dr: 1, a: Math.PI / 2 },
  w: { dc: -1, dr: 0, a: Math.PI }, n: { dc: 0, dr: -1, a: -Math.PI / 2 } };
const TURN_L = { e: 'n', n: 'w', w: 's', s: 'e' };
const TURN_R = { e: 's', s: 'w', w: 'n', n: 'e' };
const STEP = 0.42;

const BTN = {
  fram: { id: 'fram', x: 148, y: 654, r: 44 },
  vanster: { id: 'vanster', x: 256, y: 654, r: 44 },
  hoger: { id: 'hoger', x: 364, y: 654, r: 44 },
  hoppa: { id: 'hoppa', x: 472, y: 654, r: 44 },
  play: { id: 'play', x: 800, y: 640, r: 60 },
  rensa: { id: 'rensa', x: 58, y: 654, r: 34 }
};

let level = 0, program = [], preview = [], parts = [];
let running = false, runIdx = 0, stepT = 0, curStep = null;
let rc = 0, rr2 = 0, rh = 'e', robotX = 0, robotY = 0, robotA = 0;
let keyTaken = false, winT = 0, winAll = false, showHelp = false;
let bumpT = 0, bumpMsg = 'Aj då!', pressBtn = null, time = 0, hopZ = 0;
let started = false;

function L() { return LEVELS[level]; }
function stoneSet(lv) { return (lv.stones || []).map(function (a) { return a[0] + ',' + a[1]; }); }
function waterSet(lv) { return (lv.water || []).map(function (a) { return a[0] + ',' + a[1]; }); }
function isStone(c, r, lv) { return stoneSet(lv || L()).indexOf(c + ',' + r) >= 0; }
function isWater(c, r, lv) { return waterSet(lv || L()).indexOf(c + ',' + r) >= 0; }
function solid(c, r, lv) { return !inBounds(c, r) || isStone(c, r, lv) || isWater(c, r, lv); }

function loadLevel(n) {
  level = ((n % LEVELS.length) + LEVELS.length) % LEVELS.length;
  program = []; preview = []; parts = [];
  running = false; runIdx = 0; stepT = 0; curStep = null;
  winT = 0; winAll = false; bumpT = 0; showHelp = false; pressBtn = null; hopZ = 0;
  keyTaken = false;
  resetRobot();
  levelIntro = 1.2;
}
let levelIntro = 0;

function resetRobot() {
  const s = L().start;
  rc = s.c; rr2 = s.r; rh = s.h;
  const p = cellCenter(rc, rr2);
  robotX = p.x; robotY = p.y; robotA = HEAD[rh].a;
  hopZ = 0;
}

function addCommand(cmd) {
  if (running || winT > 0) return false;
  if (program.length >= MAXCMD) { pop(); bumpT = 0.7; bumpMsg = 'Raden är full!'; return false; }
  program.push(cmd); click(); buildPreview(); return true;
}

function removeCommand(i) {
  if (running || winT > 0) return;
  if (i < 0 || i >= program.length) return;
  program.splice(i, 1); pop(); buildPreview();
}

function clearProgram() {
  if (running) return;
  program = []; preview = []; pop();
}

// simulera programmet och bygg prickar (förhandsvisning)
function buildPreview() {
  preview = [];
  let c = L().start.c, r = L().start.r, h = L().start.h;
  for (let i = 0; i < program.length; i++) {
    const cmd = program[i];
    if (cmd === 'vanster') { h = TURN_L[h]; continue; }
    if (cmd === 'hoger') { h = TURN_R[h]; continue; }
    const d = HEAD[h];
    let steps = 1;
    if (cmd === 'fram') {
      const nc = c + d.dc, nr = r + d.dr;
      if (solid(nc, nr)) { preview.push({ c: nc, r: nr, bad: true }); break; }
      c = nc; r = nr;
    } else if (cmd === 'hoppa') {
      if (!solid(c + d.dc, r + d.dr) || solid(c + d.dc * 2, r + d.dr * 2)) {
        preview.push({ c: c + d.dc, r: r + d.dr, bad: true }); break;
      }
      c = c + d.dc * 2; r = r + d.dr * 2; steps = 2;
    }
    preview.push({ c: c, r: r, bad: false });
  }
}
// app2 — körning, kollisioner och firande
function startRun() {
  if (running || winT > 0 || winAll) return;
  if (program.length === 0) {
    pop(); bumpT = 0.9; bumpMsg = 'Lägg pilar först!'; return;
  }
  resetRobot();
  running = true; runIdx = 0; stepT = 0; curStep = null; bumpT = 0;
  beginStep();
}

function beginStep() {
  if (runIdx >= program.length) { running = false; curStep = null; return; }
  const cmd = program[runIdx], d = HEAD[rh];
  curStep = { cmd: cmd, x0: robotX, y0: robotY, a0: robotA };
  if (cmd === 'vanster' || cmd === 'hoger') {
    curStep.a1 = robotA + (cmd === 'vanster' ? -Math.PI / 2 : Math.PI / 2);
    pip(560 + runIdx * 24);
    return;
  }
  let tc = rc, tr = rr2;
  if (cmd === 'fram') {
    tc = rc + d.dc; tr = rr2 + d.dr;
    if (solid(tc, tr)) { doBump(tc, tr, 'Hoppsan, där är ett hinder!'); return; }
  } else {
    if (!solid(rc + d.dc, rr2 + d.dr) || solid(rc + d.dc * 2, rr2 + d.dr * 2)) {
      doBump(rc + d.dc, rr2 + d.dr, 'Här kan jag inte hoppa!'); return;
    }
    tc = rc + d.dc * 2; tr = rr2 + d.dr * 2;
  }
  const goal = L().goal;
  if (tc === goal.c && tr === goal.r && L().key && !keyTaken) {
    doBump(tc, tr, 'Nyckeln först!'); return;
  }
  curStep.tc = tc; curStep.tr = tr; curStep.jump = cmd === 'hoppa';
  pip(560 + runIdx * 24);
}

function doBump(c, r, msg) {
  running = false; curStep = null;
  bumpT = 1.15; bumpMsg = msg;
  bonk();
}

function updateRun(dt) {
  if (!running || !curStep) return;
  stepT += dt;
  const k = Math.min(1, stepT / STEP), e = ease(k);
  if (curStep.a1 !== undefined) {
    robotA = lerp(curStep.a0, curStep.a1, e);
    if (k >= 1) { rh = program[runIdx] === 'vanster' ? TURN_L[rh] : TURN_R[rh]; robotA = HEAD[rh].a; nextStep(); }
    return;
  }
  const p1 = cellCenter(curStep.tc, curStep.tr);
  robotX = lerp(curStep.x0, p1.x, e);
  robotY = lerp(curStep.y0, p1.y, e);
  hopZ = curStep.jump ? Math.sin(k * Math.PI) * 38 : 0;
  if (k >= 1) {
    robotX = p1.x; robotY = p1.y; hopZ = 0;
    rc = curStep.tc; rr2 = curStep.tr;
    landCheck();
    if (running) nextStep();
  }
}

function landCheck() {
  const lv = L();
  if (lv.key && !keyTaken && rc === lv.key.c && rr2 === lv.key.r) {
    keyTaken = true; keySound();
    const p = cellCenter(rc, rr2);
    for (let i = 0; i < 10; i++) sparkle(p.x + (Math.random() - 0.5) * 40, p.y + (Math.random() - 0.5) * 40, C.yellow);
  }
  if (rc === lv.goal.c && rr2 === lv.goal.r) {
    if (lv.key && !keyTaken) { doBump(rc, rr2, 'Nyckeln först!'); return; }
    winLevel();
  }
}

function nextStep() {
  runIdx++;
  stepT = 0;
  if (runIdx >= program.length) { running = false; curStep = null; return; }
  beginStep();
}

function sparkle(x, y, col) {
  parts.push({
    x: x, y: y, vx: (Math.random() - 0.5) * 180, vy: -Math.random() * 200 - 40,
    g: 520, life: 1.1 + Math.random() * 0.5, rot: Math.random() * 6,
    rz: (Math.random() - 0.5) * 8, col: col, sz: 6 + Math.random() * 7, star: true
  });
}

function winLevel() {
  running = false; curStep = null;
  skolKlar((level + 1) / (LEVELS ? LEVELS.length : 6) * 100);
  winT = 1.6;
  chime(); setTimeout(winJingle, 120);
  const p = cellCenter(rc, rr2);
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, sp = 90 + Math.random() * 220;
    parts.push({
      x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120,
      g: 420, life: 1.2 + Math.random() * 0.8, rot: Math.random() * 6,
      rz: (Math.random() - 0.5) * 9, col: [C.yellow, C.coral, C.mint, '#fff3c8'][i % 4],
      sz: 6 + Math.random() * 8, star: i % 2 === 0
    });
  }
}
// app3 — pekning, ren logik för test och test-API
function hitBtn(b, x, y, extra) {
  return dist(x, y, b.x, b.y) < b.r + (extra || 8);
}

function onDown(e) {
  e.preventDefault();
  audio();
  const p = toDesign(e);
  if (showHelp) { showHelp = false; click(); return; }
  if (winAll) { winAll = false; loadLevel(0); click(); return; }
  if (winT > 0) return;
  if (dist(p.x, p.y, 950, 20) < 42) { showHelp = true; click(); return; }

  if (running) { pressBtn = null; return; }

  // ta bort ett kommando genom att peka på brickan
  if (p.y > STRIP.y + 2 && p.y < STRIP.y + STRIP.h + 14) {
    for (let i = 0; i < MAXCMD; i++) {
      const x = STRIP.tx + i * STRIP.step;
      if (p.x > x - 4 && p.x < x + STRIP.tw + 4) {
        if (i < program.length) removeCommand(i);
        return;
      }
    }
  }

  if (hitBtn(BTN.play, p.x, p.y, 6)) { pressBtn = 'play'; startRun(); return; }
  if (hitBtn(BTN.rensa, p.x, p.y)) { pressBtn = 'rensa'; clearProgram(); return; }
  const order = ['fram', 'vanster', 'hoger', 'hoppa'];
  for (let i = 0; i < order.length; i++) {
    const b = BTN[order[i]];
    if (hitBtn(b, p.x, p.y, 6)) {
      pressBtn = order[i];
      addCommand(order[i]);
      return;
    }
  }
  pressBtn = null;
}

function onUp(e) {
  if (e && e.preventDefault) e.preventDefault();
  pressBtn = null;
}

cv.addEventListener('pointerdown', onDown);
cv.addEventListener('pointerup', onUp);
cv.addEventListener('pointercancel', onUp);
cv.addEventListener('pointerleave', onUp);
cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

// ---------------------------------------------------------- ren logik (testbar)
function simulateProgram(cmds, li) {
  const lv = LEVELS[li === undefined ? level : li];
  let c = lv.start.c, r = lv.start.r, h = lv.start.h, key = false;
  for (let i = 0; i < cmds.length; i++) {
    const cmd = cmds[i];
    if (cmd === 'vanster') { h = TURN_L[h]; continue; }
    if (cmd === 'hoger') { h = TURN_R[h]; continue; }
    const d = HEAD[h];
    let tc, tr;
    if (cmd === 'fram') {
      tc = c + d.dc; tr = r + d.dr;
      if (solid(tc, tr, lv)) return { result: 'bump', at: i, c: c, r: r };
    } else {
      const mc = c + d.dc, mr = r + d.dr;
      const mSolid = isStone(mc, mr, lv) || isWater(mc, mr, lv);
      tc = c + d.dc * 2; tr = r + d.dr * 2;
      if (!mSolid || solid(tc, tr, lv)) return { result: 'bump', at: i, c: c, r: r };
    }
    c = tc; r = tr;
    if (lv.key && c === lv.key.c && r === lv.key.r) key = true;
    if (c === lv.goal.c && r === lv.goal.r) {
      if (lv.key && !key) return { result: 'locked', at: i, c: c, r: r };
      return { result: 'win', at: i, c: c, r: r, key: key };
    }
  }
  return { result: 'incomplete', c: c, r: r, h: h, key: key };
}

window.__game = {
  LEVELS: LEVELS,
  BTN: BTN,
  STRIP: STRIP,
  simulateProgram: simulateProgram,
  loadLevel: loadLevel,
  addCommand: addCommand,
  removeCommand: removeCommand,
  clearProgram: clearProgram,
  startRun: startRun,
  buildPreview: buildPreview,
  setProgram: function (a) { program = a.slice(); buildPreview(); },
  tick: function (dt) {
    if (running) updateRun(dt);
    if (winT > 0) {
      winT -= dt;
      if (winT <= 0) { if (level >= LEVELS.length - 1) winAll = true; else loadLevel(level + 1); }
    }
  },
  state: function () {
    return {
      level: level, program: program.slice(), preview: preview.slice(),
      running: running, rc: rc, rr: rr2, rh: rh,
      keyTaken: keyTaken, winT: winT, winAll: winAll, bumpT: bumpT,
      robotX: robotX, robotY: robotY
    };
  }
};