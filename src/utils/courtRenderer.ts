import type { CourtDesign } from '../types/court';

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  courtX: number;
  courtY: number;
  courtW: number;
  courtH: number;
  scale: number; // pixels per foot
}

function computeRenderContext(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  design: CourtDesign
): RenderContext {
  const padding = 60;
  const availW = canvasWidth - padding * 2;
  const availH = canvasHeight - padding * 2;

  const courtAspect = design.dimensions.width / design.dimensions.length;
  const canvasAspect = availW / availH;

  let courtW: number, courtH: number;
  if (courtAspect > canvasAspect) {
    courtW = availW;
    courtH = availW / courtAspect;
  } else {
    courtH = availH;
    courtW = availH * courtAspect;
  }

  const courtX = (canvasWidth - courtW) / 2;
  const courtY = (canvasHeight - courtH) / 2;
  const scale = courtW / design.dimensions.width;

  return { ctx, canvasWidth, canvasHeight, courtX, courtY, courtW, courtH, scale };
}

function drawCourtSurface(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH } = rc;

  // Border / out-of-bounds area
  ctx.fillStyle = design.colors.border;
  ctx.fillRect(courtX - 8, courtY - 8, courtW + 16, courtH + 16);

  // Main court surface
  ctx.fillStyle = design.colors.primary;
  ctx.fillRect(courtX, courtY, courtW, courtH);
}

function drawDimensionLabels(rc: RenderContext, design: CourtDesign) {
  if (!design.showDimensions) return;
  const { ctx, courtX, courtY, courtW, courtH } = rc;

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';

  // Width label (top)
  ctx.fillText(`${design.dimensions.width} ft`, courtX + courtW / 2, courtY - 18);

  // Length label (right side, rotated)
  ctx.save();
  ctx.translate(courtX + courtW + 24, courtY + courtH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(`${design.dimensions.length} ft`, 0, 0);
  ctx.restore();
}

// --- BASKETBALL ---
function drawBasketball(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const l = design.dimensions.length;
  const isHalf = l <= 50;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  // Court outline
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  if (isHalf) {
    // --- Half Court ---
    const keyW = 12 * scale;
    const keyH = 19 * scale;
    const keyX = courtX + (courtW - keyW) / 2;
    const keyY = courtY + courtH - keyH;

    // Paint/key area
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(keyX, keyY, keyW, keyH);
    ctx.strokeRect(keyX, keyY, keyW, keyH);

    // Free throw circle
    const ftCenterX = courtX + courtW / 2;
    const ftCenterY = keyY;
    const ftRadius = 6 * scale;
    ctx.beginPath();
    ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, true);
    ctx.stroke();
    // Dashed half behind
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, false);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3-point line
    const threePointRadius = 23.75 * scale;
    const basketY = courtY + courtH - 4 * scale;
    const basketX = courtX + courtW / 2;
    // Side lines
    const cornerThreeX = 3 * scale;
    const cornerThreeLen = 14 * scale;
    ctx.beginPath();
    ctx.moveTo(courtX + cornerThreeX, courtY + courtH);
    ctx.lineTo(courtX + cornerThreeX, courtY + courtH - cornerThreeLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX + courtW - cornerThreeX, courtY + courtH);
    ctx.lineTo(courtX + courtW - cornerThreeX, courtY + courtH - cornerThreeLen);
    ctx.stroke();
    // Arc
    const startAngle = Math.acos(((w / 2 - 3) * scale) / threePointRadius);
    ctx.beginPath();
    ctx.arc(basketX, basketY, threePointRadius, Math.PI + startAngle, -startAngle);
    ctx.stroke();

    // Backboard and rim
    const rimRadius = 0.75 * scale;
    ctx.beginPath();
    ctx.arc(basketX, basketY, rimRadius, 0, Math.PI * 2);
    ctx.stroke();
    // Backboard
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(basketX - 3 * scale, courtY + courtH - 3 * scale);
    ctx.lineTo(basketX + 3 * scale, courtY + courtH - 3 * scale);
    ctx.stroke();
    ctx.lineWidth = 2;

    // Half-court arc (top)
    const halfCircleRadius = 6 * scale;
    ctx.beginPath();
    ctx.arc(courtX + courtW / 2, courtY, halfCircleRadius, 0, Math.PI);
    ctx.stroke();
    // Baseline at top
    ctx.beginPath();
    ctx.moveTo(courtX, courtY);
    ctx.lineTo(courtX + courtW, courtY);
    ctx.stroke();
  } else {
    // --- Full Court ---
    // Center line
    ctx.beginPath();
    ctx.moveTo(courtX, courtY + courtH / 2);
    ctx.lineTo(courtX + courtW, courtY + courtH / 2);
    ctx.stroke();

    // Center circle
    const centerCircleRadius = 6 * scale;
    ctx.beginPath();
    ctx.arc(courtX + courtW / 2, courtY + courtH / 2, centerCircleRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw both ends
    for (const end of [0, 1]) {
      const flip = end === 0 ? 1 : -1;
      const baseY = end === 0 ? courtY + courtH : courtY;

      // Key/paint
      const keyW = 12 * scale;
      const keyH = 19 * scale;
      const keyX = courtX + (courtW - keyW) / 2;
      const keyY = end === 0 ? baseY - keyH : baseY;

      ctx.fillStyle = secondaryColor;
      ctx.fillRect(keyX, keyY, keyW, keyH);
      ctx.strokeStyle = lineColor;
      ctx.strokeRect(keyX, keyY, keyW, keyH);

      // Free throw circle
      const ftCenterX = courtX + courtW / 2;
      const ftCenterY = end === 0 ? baseY - keyH : baseY + keyH;
      const ftRadius = 6 * scale;
      ctx.beginPath();
      if (end === 0) {
        ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, true);
      } else {
        ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, false);
      }
      ctx.stroke();
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      if (end === 0) {
        ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, false);
      } else {
        ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, true);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3-point line
      const threePointRadius = 23.75 * scale;
      const basketDistFromBaseline = 4 * scale;
      const basketX = courtX + courtW / 2;
      const basketY = end === 0 ? baseY - basketDistFromBaseline : baseY + basketDistFromBaseline;
      const cornerThreeX = 3 * scale;
      const cornerThreeLen = 14 * scale;

      // Corner threes
      ctx.beginPath();
      ctx.moveTo(courtX + cornerThreeX, baseY);
      ctx.lineTo(courtX + cornerThreeX, baseY + flip * (-cornerThreeLen));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(courtX + courtW - cornerThreeX, baseY);
      ctx.lineTo(courtX + courtW - cornerThreeX, baseY + flip * (-cornerThreeLen));
      ctx.stroke();

      // Arc
      const halfW = (w / 2 - 3) * scale;
      const startAngle = Math.acos(halfW / threePointRadius);
      if (end === 0) {
        ctx.beginPath();
        ctx.arc(basketX, basketY, threePointRadius, Math.PI + startAngle, -startAngle);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(basketX, basketY, threePointRadius, startAngle, Math.PI - startAngle);
        ctx.stroke();
      }

      // Rim
      const rimRadius = 0.75 * scale;
      ctx.beginPath();
      ctx.arc(basketX, basketY, rimRadius, 0, Math.PI * 2);
      ctx.stroke();
      // Backboard
      ctx.lineWidth = 3;
      const bbY = end === 0 ? baseY - 3 * scale : baseY + 3 * scale;
      ctx.beginPath();
      ctx.moveTo(basketX - 3 * scale, bbY);
      ctx.lineTo(basketX + 3 * scale, bbY);
      ctx.stroke();
      ctx.lineWidth = 2;
    }
  }
}

// --- TENNIS ---
function drawTennis(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const isDoubles = w >= 36;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  // Court outline
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  if (isDoubles) {
    // Singles sidelines
    const singlesInset = 4.5 * scale;

    // Service boxes with secondary color
    const netY = courtY + courtH / 2;
    const serviceLineOffset = 21 * scale;

    // Fill service boxes
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(courtX + singlesInset, netY - serviceLineOffset,
      courtW - singlesInset * 2, serviceLineOffset * 2);

    // Draw singles sidelines
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(courtX + singlesInset, courtY);
    ctx.lineTo(courtX + singlesInset, courtY + courtH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX + courtW - singlesInset, courtY);
    ctx.lineTo(courtX + courtW - singlesInset, courtY + courtH);
    ctx.stroke();

    // Service lines
    ctx.beginPath();
    ctx.moveTo(courtX + singlesInset, netY - serviceLineOffset);
    ctx.lineTo(courtX + courtW - singlesInset, netY - serviceLineOffset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX + singlesInset, netY + serviceLineOffset);
    ctx.lineTo(courtX + courtW - singlesInset, netY + serviceLineOffset);
    ctx.stroke();

    // Center service line
    const centerX = courtX + courtW / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, netY - serviceLineOffset);
    ctx.lineTo(centerX, netY + serviceLineOffset);
    ctx.stroke();

    // Center marks
    const centerMarkLen = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(centerX, courtY);
    ctx.lineTo(centerX, courtY + centerMarkLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, courtY + courtH);
    ctx.lineTo(centerX, courtY + courtH - centerMarkLen);
    ctx.stroke();
  } else {
    // Singles court
    const netY = courtY + courtH / 2;
    const serviceLineOffset = 21 * scale;

    ctx.fillStyle = secondaryColor;
    ctx.fillRect(courtX, netY - serviceLineOffset, courtW, serviceLineOffset * 2);

    ctx.strokeStyle = lineColor;

    // Service lines
    ctx.beginPath();
    ctx.moveTo(courtX, netY - serviceLineOffset);
    ctx.lineTo(courtX + courtW, netY - serviceLineOffset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX, netY + serviceLineOffset);
    ctx.lineTo(courtX + courtW, netY + serviceLineOffset);
    ctx.stroke();

    // Center service line
    const centerX = courtX + courtW / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, netY - serviceLineOffset);
    ctx.lineTo(centerX, netY + serviceLineOffset);
    ctx.stroke();

    // Center marks
    const centerMarkLen = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(centerX, courtY);
    ctx.lineTo(centerX, courtY + centerMarkLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, courtY + courtH);
    ctx.lineTo(centerX, courtY + courtH - centerMarkLen);
    ctx.stroke();
  }

  // Net
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  const netY = courtY + courtH / 2;
  const netOverhang = isDoubles ? 3 * scale : 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(courtX - netOverhang, netY);
  ctx.lineTo(courtX + courtW + netOverhang, netY);
  ctx.stroke();
  // Net posts
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(courtX - netOverhang, netY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(courtX + courtW + netOverhang, netY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
}

// --- PICKLEBALL ---
function drawPickleball(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  // Court outline
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  // Court is 20x44. Kitchen (non-volley zone) is 7ft from net on each side.
  // Net is at center (22ft from each baseline)
  const netY = courtY + courtH / 2;
  const kitchenDepth = 7 * scale;

  // Kitchen zones (non-volley zones)
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(courtX, netY - kitchenDepth, courtW, kitchenDepth * 2);

  ctx.strokeStyle = lineColor;

  // Kitchen lines
  ctx.beginPath();
  ctx.moveTo(courtX, netY - kitchenDepth);
  ctx.lineTo(courtX + courtW, netY - kitchenDepth);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(courtX, netY + kitchenDepth);
  ctx.lineTo(courtX + courtW, netY + kitchenDepth);
  ctx.stroke();

  // Center lines (service areas)
  const centerX = courtX + courtW / 2;
  ctx.beginPath();
  ctx.moveTo(centerX, courtY);
  ctx.lineTo(centerX, netY - kitchenDepth);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, netY + kitchenDepth);
  ctx.lineTo(centerX, courtY + courtH);
  ctx.stroke();

  // Net
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  const netOverhang = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(courtX - netOverhang, netY);
  ctx.lineTo(courtX + courtW + netOverhang, netY);
  ctx.stroke();
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(courtX - netOverhang, netY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(courtX + courtW + netOverhang, netY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
}

// --- VOLLEYBALL ---
function drawVolleyball(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  // Court outline
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  // Net at center
  const netY = courtY + courtH / 2;

  // Attack lines (3m = ~10ft from center line on each side)
  const attackLineOffset = 10 * scale;

  // Attack zones
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(courtX, netY - attackLineOffset, courtW, attackLineOffset * 2);

  ctx.strokeStyle = lineColor;

  // Attack lines
  ctx.beginPath();
  ctx.moveTo(courtX, netY - attackLineOffset);
  ctx.lineTo(courtX + courtW, netY - attackLineOffset);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(courtX, netY + attackLineOffset);
  ctx.lineTo(courtX + courtW, netY + attackLineOffset);
  ctx.stroke();

  // Center line
  ctx.beginPath();
  ctx.moveTo(courtX, netY);
  ctx.lineTo(courtX + courtW, netY);
  ctx.stroke();

  // Net
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  const netOverhang = 3 * scale;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(courtX - netOverhang, netY);
  ctx.lineTo(courtX + courtW + netOverhang, netY);
  ctx.stroke();
  ctx.setLineDash([]);
  // Net posts
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(courtX - netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(courtX + courtW + netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
}

// --- BADMINTON ---
function drawBadminton(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const isDoubles = w >= 20;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  // Court outline
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  // Net at center
  const netY = courtY + courtH / 2;

  // Short service line: 6.5ft from net on each side
  const shortServiceOffset = 6.5 * scale;

  // Service areas
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(courtX, netY - shortServiceOffset, courtW, shortServiceOffset * 2);

  ctx.strokeStyle = lineColor;

  // Short service lines
  ctx.beginPath();
  ctx.moveTo(courtX, netY - shortServiceOffset);
  ctx.lineTo(courtX + courtW, netY - shortServiceOffset);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(courtX, netY + shortServiceOffset);
  ctx.lineTo(courtX + courtW, netY + shortServiceOffset);
  ctx.stroke();

  if (isDoubles) {
    // Singles sidelines (1.5ft inset)
    const singlesInset = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(courtX + singlesInset, courtY);
    ctx.lineTo(courtX + singlesInset, courtY + courtH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX + courtW - singlesInset, courtY);
    ctx.lineTo(courtX + courtW - singlesInset, courtY + courtH);
    ctx.stroke();

    // Long service line for doubles (2.5ft from back boundary)
    const longServiceInset = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(courtX, courtY + longServiceInset);
    ctx.lineTo(courtX + courtW, courtY + longServiceInset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX, courtY + courtH - longServiceInset);
    ctx.lineTo(courtX + courtW, courtY + courtH - longServiceInset);
    ctx.stroke();
  }

  // Center line
  const centerX = courtX + courtW / 2;
  ctx.beginPath();
  ctx.moveTo(centerX, netY - shortServiceOffset);
  ctx.lineTo(centerX, courtY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, netY + shortServiceOffset);
  ctx.lineTo(centerX, courtY + courtH);
  ctx.stroke();

  // Net
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  const netOverhang = isDoubles ? 2 * scale : 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(courtX - netOverhang, netY);
  ctx.lineTo(courtX + courtW + netOverhang, netY);
  ctx.stroke();
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(courtX - netOverhang, netY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(courtX + courtW + netOverhang, netY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
}

const sportRenderers: Record<string, (rc: RenderContext, design: CourtDesign) => void> = {
  basketball: drawBasketball,
  tennis: drawTennis,
  pickleball: drawPickleball,
  volleyball: drawVolleyball,
  badminton: drawBadminton,
};

export function renderCourt(
  canvas: HTMLCanvasElement,
  design: CourtDesign
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const canvasWidth = rect.width;
  const canvasHeight = rect.height;

  // Clear
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const rc = computeRenderContext(ctx, canvasWidth, canvasHeight, design);

  // Draw court surface
  drawCourtSurface(rc, design);

  // Draw sport-specific lines
  const renderer = sportRenderers[design.sport];
  if (renderer) {
    renderer(rc, design);
  }

  // Draw overlay game lines for multi-sport
  for (const gl of design.gameLines) {
    if (gl.enabled && gl.sport !== design.sport) {
      const overlayDesign: CourtDesign = {
        ...design,
        colors: { ...design.colors, lines: gl.color, secondary: 'transparent' },
      };
      const overlayRenderer = sportRenderers[gl.sport];
      if (overlayRenderer) {
        ctx.globalAlpha = 0.6;
        overlayRenderer(rc, overlayDesign);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Draw dimension labels
  drawDimensionLabels(rc, design);
}
