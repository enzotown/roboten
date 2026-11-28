// art3.js — hylla, knappar, programrad, HUD och hjälp
function arrowIcon(x, y, s, ang, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.55);
  ctx.lineTo(s * 0.52, -s * 0.02);
  ctx.lineTo(s * 0.20, -s * 0.02);
  ctx.lineTo(s * 0.20, s * 0.52);
  ctx.lineTo(-s * 0.20, s * 0.52);
  ctx.lineTo(-s * 0.20, -s * 0.02);
  ctx.lineTo(-s * 0.52, -s * 0.02);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawTopBar() {
  // Skolappars Kotten-knapp sitter 56 px stor, 12 px från övre vänstra hörnet.
  // Räkna om det till dukens enheter (SC/OX) så att nivåpilen hamnar utanför rutan.
  const KX = Math.max(0, (76 - OX) / SC - 10);
  // nivåpill
  const label = 'Nivå ' + (level + 1);
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.10)';
  rr(10 + KX, 10, 136, 32, 16); ctx.fill();
  ctx.fillStyle = C.cream;
  rr(10 + KX, 6, 136, 32, 16); ctx.fill();
  ctx.strokeStyle = C.sand; ctx.lineWidth = 3;
  rr(10 + KX, 6, 136, 32, 16); ctx.stroke();
  drawRobot(38 + KX, 25, Math.PI / 2, time, 'idle', 0.40);
  ctx.fillStyle = C.brown2;
  ctx.font = 'bold 19px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 58 + KX, 23);

  // nivåprickar
  const n = LEVELS.length, cx = DW / 2 - (n - 1) * 13;
  for (let i = 0; i < n; i++) {
    ctx.beginPath(); ctx.arc(cx + i * 26, 21, i === level ? 8 : 5.5, 0, 6.3);
    ctx.fillStyle = i === level ? C.coral : (i < level ? C.mint : 'rgba(255,250,243,.95)');
    ctx.fill();
    ctx.strokeStyle = 'rgba(74,63,57,.22)'; ctx.lineWidth = 2; ctx.stroke();
  }

  // hjälpknapp
  ctx.fillStyle = 'rgba(74,63,57,.12)';
  ctx.beginPath(); ctx.arc(950, 24, 27, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.beginPath(); ctx.arc(950, 20, 27, 0, 6.3); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.20)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = C.brown2;
  ctx.font = 'bold 31px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('?', 950, 22);
  ctx.restore();
}

function drawShelf() {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.10)';
  rr(8, 616, 872, 92, 28); ctx.fill();
  ctx.fillStyle = C.cream;
  rr(8, 608, 872, 92, 28); ctx.fill();
  ctx.strokeStyle = C.sand; ctx.lineWidth = 4;
  rr(8, 608, 872, 92, 28); ctx.stroke();
  ctx.restore();
}

function drawCmdButton(b, icon, col, label) {
  const down = pressBtn === b.id;
  const y = b.y + (down ? 3 : 0);
  const r = b.r * (down ? 0.94 : 1);
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.20)';
  ctx.beginPath(); ctx.arc(b.x, b.y + 6, b.r * 0.96, 0, 6.3); ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(b.x, y, r, 0, 6.3); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.18)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(b.x, y, r, 0, 6.3); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.34)';
  ctx.beginPath(); ctx.arc(b.x - r * 0.28, y - r * 0.34, r * 0.30, 0, 6.3); ctx.fill();
  if (icon === 'hoppa') {
    ctx.strokeStyle = C.cream; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(b.x, y + 4, 14, Math.PI * 0.95, Math.PI * 2.05); ctx.stroke();
    arrowIcon(b.x + 14, y - 10, 19, Math.PI * 0.80, C.cream);
    ctx.fillStyle = C.cream;
    ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Hoppa', b.x, y + 29);
  } else {
    arrowIcon(b.x, y - 4, r * 0.90, icon === 'up' ? 0 : (icon === 'left' ? -Math.PI / 2 : Math.PI / 2), C.brown);
    ctx.fillStyle = 'rgba(74,63,57,.85)';
    ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, b.x, y + 30);
  }
  ctx.restore();
}

function drawButtons() {
  drawShelf();
  drawCmdButton(BTN.fram, 'up', C.mint, 'Fram');
  drawCmdButton(BTN.vanster, 'left', C.yellow, 'Vänster');
  drawCmdButton(BTN.hoger, 'right', C.yellow, 'Höger');
  drawCmdButton(BTN.hoppa, 'hoppa', C.coral, 'Hoppa');

  // RENSA
  const rn = BTN.rensa;
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.arc(rn.x, rn.y + 5, rn.r, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.sand;
  ctx.beginPath(); ctx.arc(rn.x, rn.y, rn.r * (pressBtn === 'rensa' ? 0.94 : 1), 0, 6.3); ctx.fill();
  ctx.strokeStyle = C.brown2; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(rn.x, rn.y, rn.r, 0, 6.3); ctx.stroke();
  ctx.strokeStyle = C.brown; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(rn.x - 11, rn.y - 11); ctx.lineTo(rn.x + 11, rn.y + 11); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rn.x + 11, rn.y - 11); ctx.lineTo(rn.x - 11, rn.y + 11); ctx.stroke();
  ctx.fillStyle = C.brown2;
  ctx.font = 'bold 12px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('RENSA', rn.x, rn.y + 26);
  ctx.restore();

  // SPELA
  const pb = BTN.play;
  const busy = running || winT > 0;
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.22)';
  ctx.beginPath(); ctx.arc(pb.x, pb.y + 7, pb.r, 0, 6.3); ctx.fill();
  const g = ctx.createRadialGradient(pb.x - 18, pb.y - 20, 8, pb.x, pb.y, pb.r + 10);
  g.addColorStop(0, busy ? '#9fe3d0' : '#7fd6bf');
  g.addColorStop(1, C.mintDark);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(pb.x, pb.y, pb.r * (pressBtn === 'play' ? 0.95 : 1), 0, 6.3); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(pb.x, pb.y, pb.r - 5, 0, 6.3); ctx.stroke();
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(pb.x - 11, pb.y - 19); ctx.lineTo(pb.x + 21, pb.y); ctx.lineTo(pb.x - 11, pb.y + 19);
  ctx.closePath(); ctx.fill();
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SPELA', pb.x, pb.y + 34);
  ctx.restore();
}
// art3b — programrad, förhandsvisning, nyckelbadge, hjälp och firande
const STRIP = { x: 20, y: 560, w: 660, h: 46, tx: 32, ty: 565, tw: 36, step: 52 };
const MAXCMD = 12;

function drawStrip() {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.10)';
  rr(STRIP.x + 2, STRIP.y + 4, STRIP.w, STRIP.h, 18); ctx.fill();
  ctx.fillStyle = C.cream;
  rr(STRIP.x, STRIP.y, STRIP.w, STRIP.h, 18); ctx.fill();
  ctx.strokeStyle = C.sand; ctx.lineWidth = 3;
  rr(STRIP.x, STRIP.y, STRIP.w, STRIP.h, 18); ctx.stroke();

  for (let i = 0; i < MAXCMD; i++) {
    const x = STRIP.tx + i * STRIP.step, y = STRIP.ty;
    const cmd = program[i];
    if (cmd) {
      const active = running && i === runIdx;
      ctx.fillStyle = active ? C.yellow : C.sand;
      rr(x, y, STRIP.tw, STRIP.tw, 10); ctx.fill();
      ctx.strokeStyle = active ? C.coral : 'rgba(74,63,57,.22)';
      ctx.lineWidth = active ? 3.5 : 2;
      rr(x, y, STRIP.tw, STRIP.tw, 10); ctx.stroke();
      drawTileIcon(cmd, x + STRIP.tw / 2, y + STRIP.tw / 2, 22, C.brown);
    } else {
      ctx.fillStyle = 'rgba(243,221,180,.30)';
      rr(x, y, STRIP.tw, STRIP.tw, 10); ctx.fill();
      ctx.strokeStyle = 'rgba(74,63,57,.12)'; ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      rr(x, y, STRIP.tw, STRIP.tw, 10); ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  // antal
  ctx.fillStyle = 'rgba(74,63,57,.35)';
  ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillText(program.length + '/' + MAXCMD, STRIP.x + STRIP.w - 12, STRIP.y + 23);
  ctx.restore();
}

function drawTileIcon(cmd, x, y, s, col) {
  if (cmd === 'fram') arrowIcon(x, y, s, 0, col);
  else if (cmd === 'vanster') arrowIcon(x, y, s, -Math.PI / 2, col);
  else if (cmd === 'hoger') arrowIcon(x, y, s, Math.PI / 2, col);
  else {
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y + 2, s * 0.30, Math.PI * 0.95, Math.PI * 2.05); ctx.stroke();
    arrowIcon(x + s * 0.30, y - s * 0.26, s * 0.62, Math.PI * 0.80, col);
    ctx.restore();
  }
}

function drawPreview() {
  if (preview.length === 0 || running) return;
  ctx.save();
  for (let i = 0; i < preview.length; i++) {
    const s = preview[i], p = cellCenter(s.c, s.r);
    if (s.bad) {
      ctx.strokeStyle = 'rgba(201,85,63,.85)'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p.x - 7, p.y - 7); ctx.lineTo(p.x + 7, p.y + 7);
      ctx.moveTo(p.x + 7, p.y - 7); ctx.lineTo(p.x - 7, p.y + 7);
      ctx.stroke();
      continue;
    }
    ctx.globalAlpha = 0.55 + 0.45 * (i / Math.max(1, preview.length));
    ctx.fillStyle = C.cream;
    ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 6.3); ctx.fill();
    ctx.strokeStyle = C.mintDark; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 6.3); ctx.stroke();
    ctx.fillStyle = C.mintDark;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3.4, 0, 6.3); ctx.fill();
  }
  ctx.globalAlpha = 1;
  const last = preview[preview.length - 1];
  if (last && !last.bad) {
    const p = cellCenter(last.c, last.r);
    ctx.strokeStyle = 'rgba(239,128,100,.75)'; ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.arc(p.x, p.y, 26, 0, 6.3); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawKeyBadge() {
  if (!LEVELS[level].key) return;
  ctx.save();
  const x = 916, y = 100;
  ctx.fillStyle = 'rgba(74,63,57,.10)';
  rr(x - 44, y - 34, 88, 68, 18); ctx.fill();
  ctx.fillStyle = C.cream;
  rr(x - 44, y - 38, 88, 68, 18); ctx.fill();
  ctx.strokeStyle = keyTaken ? C.mintDark : C.sand; ctx.lineWidth = 3;
  rr(x - 44, y - 38, 88, 68, 18); ctx.stroke();
  ctx.globalAlpha = keyTaken ? 1 : 0.55;
  drawKey(x, y - 6, 0.85, !keyTaken);
  if (keyTaken) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = C.mintDark; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - 18, y - 2); ctx.lineTo(x - 4, y + 12); ctx.lineTo(x + 20, y - 16); ctx.stroke();
  }
  ctx.restore();
}

function drawBumpBubble() {
  if (bumpT <= 0) return;
  const c = { x: robotX, y: robotY - 62 };
  ctx.save();
  ctx.globalAlpha = Math.min(1, bumpT / 0.3);
  ctx.fillStyle = C.cream;
  rr(c.x - 46, c.y - 26, 92, 44, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.18)'; ctx.lineWidth = 3;
  rr(c.x - 46, c.y - 26, 92, 44, 16); ctx.stroke();
  ctx.fillStyle = C.brown2;
  ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(bumpMsg, c.x, c.y - 3);
  ctx.restore();
}
// art3c — hjälpruta, firande och partiklar
function drawHelp() {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.62)';
  ctx.fillRect(0, 0, DW, DH);
  ctx.fillStyle = C.cream;
  rr(140, 110, 720, 470, 34); ctx.fill();
  ctx.strokeStyle = C.sand; ctx.lineWidth = 5;
  rr(140, 110, 720, 470, 34); ctx.stroke();

  ctx.fillStyle = C.brown;
  ctx.font = 'bold 34px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Så här leker du', 500, 172);

  // liten illustration: knappar -> rad -> grön knapp
  ctx.fillStyle = C.mint;
  ctx.beginPath(); ctx.arc(215, 250, 30, 0, 6.3); ctx.fill();
  arrowIcon(215, 248, 30, 0, C.brown);
  ctx.fillStyle = C.yellow;
  ctx.beginPath(); ctx.arc(292, 250, 30, 0, 6.3); ctx.fill();
  arrowIcon(292, 248, 30, -Math.PI / 2, C.brown);
  ctx.fillStyle = C.sand;
  rr(350, 224, 130, 52, 12); ctx.fill();
  arrowIcon(378, 250, 26, 0, C.brown);
  arrowIcon(406, 250, 26, -Math.PI / 2, C.brown);
  ctx.fillStyle = C.mintDark;
  ctx.beginPath(); ctx.arc(560, 250, 38, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(548, 232); ctx.lineTo(578, 250); ctx.lineTo(548, 268);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = C.brown2;
  ctx.font = '23px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  const rader = [
    'Lägg pilar i raden. Tryck på den gröna knappen.',
    'Roboten gör precis det du säger — även om det blir tokigt!',
    '',
    'Pil upp = gå fram.  Pil vänster/höger = sväng.',
    'Hoppa = skutta över en sten eller en damm.',
    'Blir det fel? Inget går sönder. Ändra och kör igen.'
  ];
  for (let i = 0; i < rader.length; i++) ctx.fillText(rader[i], 188, 326 + i * 32);

  // stäng
  ctx.fillStyle = C.mint;
  rr(370, 500, 260, 62, 31); ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.font = 'bold 25px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Jag fattar!', 500, 533);
  ctx.restore();
}

function drawParts() {
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 0.6));
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    if (p.star) {
      ctx.fillStyle = p.col;
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = k * Math.PI * 4 / 5 - Math.PI / 2;
        const r = k % 2 === 0 ? p.sz : p.sz * 0.45;
        if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = p.col;
      ctx.beginPath(); ctx.arc(0, 0, p.sz, 0, 6.3); ctx.fill();
    }
    ctx.restore();
  }
}

function drawWin() {
  if (winT <= 0 || winAll) return;
  const a = Math.min(1, winT / 0.35);
  ctx.save();
  ctx.globalAlpha = a;
  const w = 470, h = 100, x = DW / 2 - w / 2, y = 230 - Math.sin(time * 3) * 3;
  ctx.shadowColor = 'rgba(74,63,57,.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  ctx.fillStyle = C.cream;
  rr(x, y, w, h, 30); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = C.mintDark;
  ctx.font = 'bold 34px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Frukten är plockad!', DW / 2, y + h / 2);
  ctx.restore();
}

function drawWinAll() {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.62)';
  ctx.fillRect(0, 0, DW, DH);
  const w = 700, h = 400, x = DW / 2 - w / 2, y = 140;
  ctx.fillStyle = C.cream;
  rr(x, y, w, h, 34); ctx.fill();
  ctx.strokeStyle = C.sand; ctx.lineWidth = 5;
  rr(x, y, w, h, 34); ctx.stroke();
  drawRobot(DW / 2, y + 116, 0, time, 'happy');
  ctx.fillStyle = C.brown;
  ctx.font = 'bold 38px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Alla banor klarade!', DW / 2, y + 206);
  ctx.fillStyle = C.brown2;
  ctx.font = '24px "Trebuchet MS", sans-serif';
  ctx.fillText('Du programmerade roboten genom alla 7 banor.', DW / 2, y + 248);
  ctx.fillStyle = C.mintDark;
  rr(DW / 2 - 150, y + 292, 300, 72, 36); ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.font = 'bold 27px "Trebuchet MS", sans-serif';
  ctx.fillText('Spela igen', DW / 2, y + 330);
  ctx.restore();
}