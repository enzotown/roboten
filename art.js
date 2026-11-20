// art.js — bakgrund, bräda, hinder och frukter
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBackdrop() {
  const g = ctx.createLinearGradient(0, 0, 0, DH);
  g.addColorStop(0, '#fffaf3'); g.addColorStop(0.55, '#fdf4e4'); g.addColorStop(1, '#f6e7cd');
  ctx.fillStyle = g; ctx.fillRect(0, 0, DW, DH);

  // mjuka ringar i bakgrunden
  ctx.save();
  ctx.fillStyle = 'rgba(123,203,182,.10)';
  ctx.beginPath(); ctx.arc(70, 620, 150, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(940, 120, 190, 0, 6.3); ctx.fill();
  ctx.fillStyle = 'rgba(239,128,100,.07)';
  ctx.beginPath(); ctx.arc(880, 660, 130, 0, 6.3); ctx.fill();
  ctx.restore();
}

function drawBoard() {
  // skugga + mjuk ram
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.13)';
  rr(GX - 12, GY - 6, BW + 24, BH + 26, 26); ctx.fill();
  ctx.fillStyle = C.cream;
  rr(GX - 9, GY - 9, BW + 18, BH + 18, 24); ctx.fill();
  ctx.strokeStyle = C.sand; ctx.lineWidth = 4;
  rr(GX - 9, GY - 9, BW + 18, BH + 18, 24); ctx.stroke();

  // rutmatta
  ctx.save();
  rr(GX, GY, BW, BH, 16); ctx.clip();
  ctx.fillStyle = C.grass;
  ctx.fillRect(GX, GY, BW, BH);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((c + r) % 2 === 0) {
        ctx.fillStyle = C.grass2;
        ctx.fillRect(GX + c * CELL, GY + r * CELL, CELL, CELL);
      }
    }
  }
  // små grässtrån
  ctx.strokeStyle = 'rgba(111,159,92,.30)';
  ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const c = i % COLS, r = Math.floor(i / COLS) % ROWS;
    const cx = GX + c * CELL + 14 + ((i * 37) % (CELL - 28));
    const cy = GY + r * CELL + 16 + ((i * 53) % (CELL - 30));
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 2, cy - 6); ctx.stroke();
  }
  ctx.restore();

  // rutnät
  ctx.strokeStyle = 'rgba(255,250,243,.85)';
  ctx.lineWidth = 2;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath(); ctx.moveTo(GX + c * CELL, GY + 6); ctx.lineTo(GX + c * CELL, GY + BH - 6); ctx.stroke();
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(GX + 6, GY + r * CELL); ctx.lineTo(GX + BW - 6, GY + r * CELL); ctx.stroke();
  }
  // innerkant
  ctx.strokeStyle = 'rgba(169,205,143,.75)'; ctx.lineWidth = 4;
  rr(GX + 2, GY + 2, BW - 4, BH - 4, 15); ctx.stroke();
  ctx.restore();
}

function drawStone(c, r) {
  const p = cellCenter(c, r), R = 30;
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.16)';
  ctx.beginPath(); ctx.ellipse(p.x, p.y + 20, R * 0.95, 12, 0, 0, 6.3); ctx.fill();
  const g = ctx.createRadialGradient(p.x - 8, p.y - 10, 5, p.x, p.y, R + 8);
  g.addColorStop(0, C.stoneLight); g.addColorStop(0.65, C.stone); g.addColorStop(1, C.stoneDark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(p.x - R, p.y + 12);
  ctx.quadraticCurveTo(p.x - R - 3, p.y - 16, p.x - 8, p.y - 22);
  ctx.quadraticCurveTo(p.x + 16, p.y - 27, p.x + R - 2, p.y - 4);
  ctx.quadraticCurveTo(p.x + R + 2, p.y + 18, p.x + 8, p.y + 22);
  ctx.quadraticCurveTo(p.x - 14, p.y + 24, p.x - R, p.y + 12);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.40)';
  ctx.beginPath(); ctx.ellipse(p.x - 9, p.y - 10, 10, 6, -0.4, 0, 6.3); ctx.fill();
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  ctx.beginPath(); ctx.arc(p.x + 10, p.y + 4, 3.4, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(p.x - 3, p.y + 12, 2.6, 0, 6.3); ctx.fill();
  ctx.restore();
}

function drawWater(c, r) {
  const p = cellCenter(c, r), w = CELL - 10, h = CELL - 18;
  ctx.save();
  ctx.fillStyle = 'rgba(43,127,168,.20)';
  rr(p.x - w / 2 - 3, p.y - h / 2 + 4, w + 6, h, 20); ctx.fill();
  const g = ctx.createLinearGradient(0, p.y - h / 2, 0, p.y + h / 2);
  g.addColorStop(0, C.water); g.addColorStop(1, C.waterDark);
  ctx.fillStyle = g;
  rr(p.x - w / 2, p.y - h / 2, w, h, 18); ctx.fill();
  ctx.strokeStyle = 'rgba(168,224,244,.9)'; ctx.lineWidth = 3;
  rr(p.x - w / 2 + 2, p.y - h / 2 + 2, w - 4, h - 4, 16); ctx.stroke();
  // vågor
  ctx.strokeStyle = 'rgba(255,255,255,.70)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    const yy = p.y - 8 + i * 20 + Math.sin(time * 2.2 + c + i) * 3;
    ctx.beginPath();
    ctx.moveTo(p.x - 20, yy);
    ctx.quadraticCurveTo(p.x - 10, yy - 6, p.x, yy);
    ctx.quadraticCurveTo(p.x + 10, yy + 6, p.x + 20, yy);
    ctx.stroke();
  }
  ctx.restore();
}