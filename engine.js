// engine.js — yta, ljud, geometri och hjälpare
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const DW = 1000, DH = 700;
let vw = DW, vh = DH, SC = 1, OX = 0, OY = 0, DPR = 1;

const C = {
  cream: '#fffaf3', brown: '#4a3f39', brown2: '#6b5d54',
  mint: '#7bcbb6', mintDark: '#4fae94', coral: '#ef8064', coralDark: '#c9553f',
  yellow: '#ffe08a', sand: '#f3ddb4',
  grass: '#dcefc8', grass2: '#cfe8bb', grassDark: '#a9cd8f',
  stone: '#b9b3ad', stoneDark: '#8f8983', stoneLight: '#d8d3cd',
  water: '#4fb4e0', waterLight: '#a8e0f4', waterDark: '#2b7fa8',
  apple: '#e8534a', banana: '#f6c445', berry: '#e5463f', leaf: '#5bb07a'
};

const COLS = 8, ROWS = 6, CELL = 84;
const GX = 164, GY = 44, BW = COLS * CELL, BH = ROWS * CELL;

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  vw = window.innerWidth; vh = window.innerHeight;
  cv.width = Math.floor(vw * DPR); cv.height = Math.floor(vh * DPR);
  SC = Math.min(vw / DW, vh / DH);
  OX = (vw - DW * SC) / 2; OY = (vh - DH * SC) / 2;
  ctx.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * OX, DPR * OY);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', function () { setTimeout(resize, 200); });

// ------------------------------------------------------------------ ljud
let actx = null, master = null;
const MASTER_VOL = 0.85;
function audio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = actx.createDynamicsCompressor();
      comp.threshold.value = -8; comp.ratio.value = 6;
      master = actx.createGain(); master.gain.value = MASTER_VOL;
      master.connect(comp); comp.connect(actx.destination);
    } catch (e) {}
  }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(f, dur, vol, type, slide, delay) {
  const a = audio(); if (!a) return;
  const t0 = a.currentTime + (delay || 0);
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master || a.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
function pip(f) { tone(f || 620, 0.09, 0.055, 'triangle'); }
function click() { tone(880, 0.06, 0.05, 'sine', 1180); }
function pop() { tone(380, 0.09, 0.05, 'sine', 720); }
function bonk() { tone(120, 0.20, 0.10, 'square', 70); tone(90, 0.26, 0.06, 'sine', 55, 0.03); }
function chime() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.34, 0.08, 'triangle', null, i * 0.10); }); }
function keySound() { [784, 988, 1175].forEach(function (f, i) { tone(f, 0.20, 0.06, 'sine', null, i * 0.07); }); }
function winJingle() {
  [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, 0.30, 0.08, 'triangle', null, i * 0.09); });
  tone(1568, 0.55, 0.06, 'sine', null, 0.48);
}

// ------------------------------------------------------------------ geometri
function cellCenter(c, r) { return { x: GX + c * CELL + CELL / 2, y: GY + r * CELL + CELL / 2 }; }
function inBounds(c, r) { return c >= 0 && c < COLS && r >= 0 && r < ROWS; }
function cellAt(x, y) {
  if (x < GX || x >= GX + BW || y < GY || y >= GY + BH) return null;
  return { c: Math.floor((x - GX) / CELL), r: Math.floor((y - GY) / CELL) };
}
function toDesign(e) {
  const r = cv.getBoundingClientRect();
  const t = e.touches && e.touches[0] ? e.touches[0] : e;
  const cx = (t.clientX - r.left) * (cv.width / DPR / r.width);
  const cy = (t.clientY - r.top) * (cv.height / DPR / r.height);
  return { x: (cx - OX) / SC, y: (cy - OY) / SC };
}
function dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
function lerp(a, b, t) { return a + (b - a) * t; }
function angLerp(a, b, t) {
  let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return a + d * t;
}
function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }