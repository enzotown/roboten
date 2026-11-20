// art2.js — roboten, frukterna, nyckeln och partiklar
function drawApple(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.ellipse(0, 24, 20, 7, 0, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.apple;
  ctx.beginPath();
  ctx.arc(-9, 2, 15, 0, 6.3); ctx.arc(9, 2, 15, 0, 6.3);
  ctx.quadraticCurveTo(14, 20, 0, 22);
  ctx.quadraticCurveTo(-14, 20, -9, 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  ctx.beginPath(); ctx.ellipse(-10, -4, 5, 7, -0.5, 0, 6.3); ctx.fill();
  ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(2, -22, 6, -24); ctx.stroke();
  ctx.fillStyle = C.leaf;
  ctx.beginPath(); ctx.ellipse(14, -22, 10, 6, -0.5, 0, 6.3); ctx.fill();
  ctx.restore();
}

function drawBanana(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.ellipse(0, 24, 22, 7, 0, 0, 6.3); ctx.fill();
  ctx.strokeStyle = '#d9a52c'; ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-22, -16); ctx.quadraticCurveTo(-6, 24, 22, 8); ctx.stroke();
  ctx.strokeStyle = C.banana; ctx.lineWidth = 13;
  ctx.beginPath(); ctx.moveTo(-22, -17); ctx.quadraticCurveTo(-6, 22, 22, 7); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(-17, -14); ctx.quadraticCurveTo(-4, 16, 14, 6); ctx.stroke();
  ctx.fillStyle = '#8a6b2a';
  ctx.beginPath(); ctx.arc(23, 7, 3.2, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(-23, -17, 3.2, 0, 6.3); ctx.fill();
  ctx.restore();
}

function drawStrawberry(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.ellipse(0, 24, 19, 6, 0, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.berry;
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.quadraticCurveTo(-22, 4, -17, -12);
  ctx.quadraticCurveTo(-8, -20, 0, -16);
  ctx.quadraticCurveTo(8, -20, 17, -12);
  ctx.quadraticCurveTo(22, 4, 0, 24);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.30)';
  ctx.beginPath(); ctx.ellipse(-8, -4, 4, 6, -0.4, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.leaf;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI + i * Math.PI / 4;
    ctx.moveTo(0, -15);
    ctx.quadraticCurveTo(Math.cos(a) * 13, -20 + Math.sin(a) * 3, Math.cos(a) * 19, -14 + Math.sin(a) * 3);
    ctx.quadraticCurveTo(Math.cos(a) * 6, -12, 0, -15);
  }
  ctx.fill();
  ctx.fillStyle = '#ffe9b0';
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4, rr2 = 5 + (i % 3) * 5;
    ctx.beginPath(); ctx.arc(Math.cos(a) * rr2, Math.sin(a) * rr2 * 0.9, 1.8, 0, 6.3); ctx.fill();
  }
  ctx.restore();
}

function drawKey(x, y, s, glow) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.rotate(-0.35);
  if (glow) {
    ctx.fillStyle = 'rgba(255,224,138,' + (0.30 + 0.18 * Math.sin(time * 3)) + ')';
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, 6.3); ctx.fill();
  }
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.ellipse(0, 22, 18, 6, 0, 0, 6.3); ctx.fill();
  ctx.strokeStyle = '#c9a13a'; ctx.lineWidth = 11; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-10, -8, 11, 0, 6.3); ctx.stroke();
  ctx.fillStyle = C.yellow;
  ctx.beginPath(); ctx.arc(-10, -8, 9, 0, 6.3); ctx.fill();
  ctx.fillStyle = '#fff3c8';
  ctx.beginPath(); ctx.arc(-10, -8, 4, 0, 6.3); ctx.fill();
  ctx.strokeStyle = C.yellow; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(14, 16); ctx.stroke();
  ctx.strokeStyle = '#d9b044'; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(10, 12); ctx.lineTo(16, 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5, 7); ctx.lineTo(11, 1); ctx.stroke();
  ctx.restore();
}

function drawFruit(kind, x, y, s) {
  const bob = Math.sin(time * 2.4) * 3;
  if (kind === 'apple') drawApple(x, y + bob, s);
  else if (kind === 'banana') drawBanana(x, y + bob, s);
  else drawStrawberry(x, y + bob, s);
}

function drawRobot(x, y, heading, t, mood, sc) {
  const blink = (t % 3.6) > 3.42;
  const happy = mood === 'happy';
  const bump = mood === 'bump';
  const shake = bump ? Math.sin(t * 46) * 3.2 : 0;

  ctx.save();
  ctx.translate(x, y);
  if (sc) ctx.scale(sc, sc);
  // skugga (roterar inte)
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.ellipse(0, 26, 27, 9, 0, 0, 6.3); ctx.fill();

  ctx.rotate(heading + Math.PI / 2);
  // hjul / tassar
  ctx.fillStyle = C.brown;
  rr(-30, 8, 12, 20, 6); ctx.fill();
  rr(18, 8, 12, 20, 6); ctx.fill();
  ctx.fillStyle = 'rgba(255,250,243,.35)';
  rr(-28, 11, 4, 14, 2); ctx.fill();
  rr(20, 11, 4, 14, 2); ctx.fill();

  // kropp
  const bg = ctx.createRadialGradient(-8, -10, 6, 0, 0, 34);
  bg.addColorStop(0, '#a6e2d1'); bg.addColorStop(0.6, C.mint); bg.addColorStop(1, C.mintDark);
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.arc(0, 0, 28, 0, 6.3); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.30)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, 28, 0, 6.3); ctx.stroke();

  // ansiktsplatta
  ctx.fillStyle = C.cream;
  rr(-19, -22, 38, 28, 13); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.22)'; ctx.lineWidth = 2;
  rr(-19, -22, 38, 28, 13); ctx.stroke();

  // ögon
  const ex = shake;
  ctx.fillStyle = C.brown;
  if (blink) {
    ctx.strokeStyle = C.brown; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-12 + ex, -9); ctx.lineTo(-4 + ex, -9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4 + ex, -9); ctx.lineTo(12 + ex, -9); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(-8 + ex, -9, 4.2, 0, 6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(8 + ex, -9, 4.2, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath(); ctx.arc(-9.4 + ex, -10.6, 1.5, 0, 6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(6.6 + ex, -10.6, 1.5, 0, 6.3); ctx.fill();
  }
  // mun
  ctx.strokeStyle = C.brown; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
  ctx.beginPath();
  if (happy) ctx.arc(ex, -3, 6.5, 0.15, Math.PI - 0.15);
  else if (bump) ctx.arc(ex, 0, 3.4, 0, 6.3);
  else ctx.arc(ex, -4, 5, 0.5, Math.PI - 0.5);
  ctx.stroke();

  // antenn + lampa
  ctx.strokeStyle = C.brown2; ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, -35); ctx.stroke();
  const glow = 0.55 + 0.45 * Math.sin(t * (bump ? 14 : 3));
  ctx.fillStyle = 'rgba(255,224,138,' + (0.30 * glow) + ')';
  ctx.beginPath(); ctx.arc(0, -40, 10, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.yellow;
  ctx.beginPath(); ctx.arc(0, -40, 6, 0, 6.3); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.35)'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(0, -40, 6, 0, 6.3); ctx.stroke();

  // magknapp
  ctx.fillStyle = 'rgba(255,250,243,.85)';
  ctx.beginPath(); ctx.arc(0, 13, 6, 0, 6.3); ctx.fill();
  ctx.fillStyle = happy ? C.coral : C.mintDark;
  ctx.beginPath(); ctx.arc(0, 13, 3, 0, 6.3); ctx.fill();
  ctx.restore();
}

function drawStartPad(c, r) {
  const p = cellCenter(c, r);
  ctx.save();
  ctx.strokeStyle = 'rgba(79,174,148,.45)'; ctx.lineWidth = 3; ctx.setLineDash([7, 7]);
  rr(p.x - CELL / 2 + 8, p.y - CELL / 2 + 8, CELL - 16, CELL - 16, 16); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}