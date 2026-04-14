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

// Standard court dimensions for sports that support outside areas
const STANDARD_COURTS: Record<string, { width: number; length: number }> = {
  tennis: { width: 36, length: 78 },
  pickleball: { width: 20, length: 44 },
};

const LINE_WIDTH = 3;
const LINE_WIDTH_THICK = 5;

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

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
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

/** For tennis/pickleball with outside area: draw surround in border color, inner court in primary */
function drawSurroundCourt(
  rc: RenderContext,
  design: CourtDesign,
  stdW: number,
  stdL: number
): { innerX: number; innerY: number; innerW: number; innerH: number; innerScale: number } {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;

  // Full area border
  ctx.fillStyle = darkenColor(design.colors.border, 20);
  ctx.fillRect(courtX - 8, courtY - 8, courtW + 16, courtH + 16);

  // Full area in border/surround color
  ctx.fillStyle = design.colors.border;
  ctx.fillRect(courtX, courtY, courtW, courtH);

  // Inner court centered
  const innerW = stdW * scale;
  const innerH = stdL * scale;
  const innerX = courtX + (courtW - innerW) / 2;
  const innerY = courtY + (courtH - innerH) / 2;

  ctx.fillStyle = design.colors.primary;
  ctx.fillRect(innerX, innerY, innerW, innerH);

  return { innerX, innerY, innerW, innerH, innerScale: scale };
}

function drawDimensionLabels(rc: RenderContext, design: CourtDesign) {
  if (!design.showDimensions) return;
  const { ctx, courtX, courtY, courtW, courtH } = rc;

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';

  // Width label (top)
  ctx.fillText(`${design.dimensions.width} ft`, courtX + courtW / 2, courtY - 18);

  // Length label (right side, rotated)
  ctx.save();
  ctx.translate(courtX + courtW + 28, courtY + courtH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(`${design.dimensions.length} ft`, 0, 0);
  ctx.restore();
}

// ============================================
// 3D RENDERING HELPERS
// ============================================

function apply3DTransform(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight * 0.55;
  ctx.translate(cx, cy);
  // Compress Y and add slight skew for perspective feel
  ctx.transform(1, 0, -0.08, 0.52, 0, 0);
  ctx.translate(-cx, -cy);
}

function draw3DEdges(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  courtX: number,
  courtY: number,
  courtW: number,
  courtH: number,
  surfaceColor: string
) {
  const edgeHeight = 18;
  const dark = darkenColor(surfaceColor, 60);
  const darker = darkenColor(surfaceColor, 90);

  // We need to project the bottom and right edges of the court from the
  // 3D-transformed space into screen space to draw the "walls".
  // Since the transform is: translate(cx,cy) -> matrix(1, 0, -0.08, 0.52, 0, 0) -> translate(-cx,-cy)
  // We compute projected points manually.
  const cx = canvasWidth / 2;
  const cy = canvasHeight * 0.55;

  function project(x: number, y: number): [number, number] {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * 1 + dy * -0.08, cy + dx * 0 + dy * 0.52];
  }

  // Bottom edge (front face)
  const bl = project(courtX, courtY + courtH);
  const br = project(courtX + courtW, courtY + courtH);
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(bl[0], bl[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(br[0], br[1] + edgeHeight);
  ctx.lineTo(bl[0], bl[1] + edgeHeight);
  ctx.closePath();
  ctx.fill();

  // Right edge (side face)
  const tr = project(courtX + courtW, courtY);
  ctx.fillStyle = darker;
  ctx.beginPath();
  ctx.moveTo(tr[0], tr[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(br[0] + edgeHeight * 0.15, br[1] + edgeHeight);
  ctx.lineTo(tr[0] + edgeHeight * 0.15, tr[1] + edgeHeight);
  ctx.closePath();
  ctx.fill();

  // Bottom-right corner
  ctx.fillStyle = darker;
  ctx.beginPath();
  ctx.moveTo(br[0], br[1]);
  ctx.lineTo(br[0] + edgeHeight * 0.15, br[1] + edgeHeight);
  ctx.lineTo(br[0], br[1] + edgeHeight);
  ctx.closePath();
  ctx.fill();
}

function draw3DShadow(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  courtX: number,
  courtY: number,
  courtW: number,
  courtH: number
) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight * 0.55;

  function project(x: number, y: number): [number, number] {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * 1 + dy * -0.08, cy + dx * 0 + dy * 0.52];
  }

  const tl = project(courtX - 8, courtY - 8);
  const tr = project(courtX + courtW + 8, courtY - 8);
  const br = project(courtX + courtW + 8, courtY + courtH + 8);
  const bl = project(courtX - 8, courtY + courtH + 8);

  const shadowOffset = 30;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.moveTo(tl[0] + shadowOffset * 0.5, tl[1] + shadowOffset);
  ctx.lineTo(tr[0] + shadowOffset * 0.5, tr[1] + shadowOffset);
  ctx.lineTo(br[0] + shadowOffset * 0.5, br[1] + shadowOffset);
  ctx.lineTo(bl[0] + shadowOffset * 0.5, bl[1] + shadowOffset);
  ctx.closePath();
  ctx.fill();
}

// ============================================
// BASKETBALL
// ============================================

function drawBasketball(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const l = design.dimensions.length;
  const isHalf = l <= 50;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = LINE_WIDTH;

  // Court outline
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  if (isHalf) {
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
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, false);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3-point line
    const threePointRadius = 23.75 * scale;
    const basketY = courtY + courtH - 4 * scale;
    const basketX = courtX + courtW / 2;
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
    const startAngle = Math.acos(((w / 2 - 3) * scale) / threePointRadius);
    ctx.beginPath();
    ctx.arc(basketX, basketY, threePointRadius, Math.PI + startAngle, -startAngle);
    ctx.stroke();

    // Rim & backboard
    const rimRadius = 0.75 * scale;
    ctx.beginPath();
    ctx.arc(basketX, basketY, rimRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = LINE_WIDTH_THICK;
    ctx.beginPath();
    ctx.moveTo(basketX - 3 * scale, courtY + courtH - 3 * scale);
    ctx.lineTo(basketX + 3 * scale, courtY + courtH - 3 * scale);
    ctx.stroke();
    ctx.lineWidth = LINE_WIDTH;

    // Half-court arc
    const halfCircleRadius = 6 * scale;
    ctx.beginPath();
    ctx.arc(courtX + courtW / 2, courtY, halfCircleRadius, 0, Math.PI);
    ctx.stroke();
  } else {
    // --- Full Court ---
    ctx.beginPath();
    ctx.moveTo(courtX, courtY + courtH / 2);
    ctx.lineTo(courtX + courtW, courtY + courtH / 2);
    ctx.stroke();

    const centerCircleRadius = 6 * scale;
    ctx.beginPath();
    ctx.arc(courtX + courtW / 2, courtY + courtH / 2, centerCircleRadius, 0, Math.PI * 2);
    ctx.stroke();

    for (const end of [0, 1]) {
      const flip = end === 0 ? 1 : -1;
      const baseY = end === 0 ? courtY + courtH : courtY;

      const keyW = 12 * scale;
      const keyH = 19 * scale;
      const keyX = courtX + (courtW - keyW) / 2;
      const keyY = end === 0 ? baseY - keyH : baseY;

      ctx.fillStyle = secondaryColor;
      ctx.fillRect(keyX, keyY, keyW, keyH);
      ctx.strokeStyle = lineColor;
      ctx.strokeRect(keyX, keyY, keyW, keyH);

      const ftCenterX = courtX + courtW / 2;
      const ftCenterY = end === 0 ? baseY - keyH : baseY + keyH;
      const ftRadius = 6 * scale;
      ctx.beginPath();
      ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, end === 0);
      ctx.stroke();
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(ftCenterX, ftCenterY, ftRadius, 0, Math.PI, end !== 0);
      ctx.stroke();
      ctx.setLineDash([]);

      const threePointRadius = 23.75 * scale;
      const basketDistFromBaseline = 4 * scale;
      const basketX = courtX + courtW / 2;
      const basketY = end === 0 ? baseY - basketDistFromBaseline : baseY + basketDistFromBaseline;
      const cornerThreeX = 3 * scale;
      const cornerThreeLen = 14 * scale;

      ctx.beginPath();
      ctx.moveTo(courtX + cornerThreeX, baseY);
      ctx.lineTo(courtX + cornerThreeX, baseY + flip * (-cornerThreeLen));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(courtX + courtW - cornerThreeX, baseY);
      ctx.lineTo(courtX + courtW - cornerThreeX, baseY + flip * (-cornerThreeLen));
      ctx.stroke();

      const halfW = (w / 2 - 3) * scale;
      const angStart = Math.acos(halfW / threePointRadius);
      if (end === 0) {
        ctx.beginPath();
        ctx.arc(basketX, basketY, threePointRadius, Math.PI + angStart, -angStart);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(basketX, basketY, threePointRadius, angStart, Math.PI - angStart);
        ctx.stroke();
      }

      const rimRadius = 0.75 * scale;
      ctx.beginPath();
      ctx.arc(basketX, basketY, rimRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = LINE_WIDTH_THICK;
      const bbY = end === 0 ? baseY - 3 * scale : baseY + 3 * scale;
      ctx.beginPath();
      ctx.moveTo(basketX - 3 * scale, bbY);
      ctx.lineTo(basketX + 3 * scale, bbY);
      ctx.stroke();
      ctx.lineWidth = LINE_WIDTH;
    }
  }
}

// ============================================
// TENNIS (with outside area support)
// ============================================

function drawTennis(rc: RenderContext, design: CourtDesign) {
  const { ctx, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const l = design.dimensions.length;
  const std = STANDARD_COURTS.tennis;
  const hasSurround = w > std.width || l > std.length;

  let cx: number, cy: number, cw: number, ch: number, s: number;

  if (hasSurround) {
    const inner = drawSurroundCourt(rc, design, std.width, std.length);
    cx = inner.innerX;
    cy = inner.innerY;
    cw = inner.innerW;
    ch = inner.innerH;
    s = inner.innerScale;
  } else {
    cx = rc.courtX;
    cy = rc.courtY;
    cw = rc.courtW;
    ch = rc.courtH;
    s = scale;
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = LINE_WIDTH;

  // Court outline
  ctx.strokeRect(cx, cy, cw, ch);

  // Doubles court - singles sidelines
  const singlesInset = 4.5 * s;

  const netY = cy + ch / 2;
  const serviceLineOffset = 21 * s;

  // Fill service boxes
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(cx + singlesInset, netY - serviceLineOffset,
    cw - singlesInset * 2, serviceLineOffset * 2);

  ctx.strokeStyle = lineColor;

  // Singles sidelines
  ctx.beginPath();
  ctx.moveTo(cx + singlesInset, cy);
  ctx.lineTo(cx + singlesInset, cy + ch);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + cw - singlesInset, cy);
  ctx.lineTo(cx + cw - singlesInset, cy + ch);
  ctx.stroke();

  // Service lines
  ctx.beginPath();
  ctx.moveTo(cx + singlesInset, netY - serviceLineOffset);
  ctx.lineTo(cx + cw - singlesInset, netY - serviceLineOffset);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + singlesInset, netY + serviceLineOffset);
  ctx.lineTo(cx + cw - singlesInset, netY + serviceLineOffset);
  ctx.stroke();

  // Center service line
  const centerX = cx + cw / 2;
  ctx.beginPath();
  ctx.moveTo(centerX, netY - serviceLineOffset);
  ctx.lineTo(centerX, netY + serviceLineOffset);
  ctx.stroke();

  // Center marks
  const centerMarkLen = 2 * s;
  ctx.beginPath();
  ctx.moveTo(centerX, cy);
  ctx.lineTo(centerX, cy + centerMarkLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, cy + ch);
  ctx.lineTo(centerX, cy + ch - centerMarkLen);
  ctx.stroke();

  // Net
  ctx.lineWidth = LINE_WIDTH_THICK;
  const netOverhang = 3 * s;
  ctx.beginPath();
  ctx.moveTo(cx - netOverhang, netY);
  ctx.lineTo(cx + cw + netOverhang, netY);
  ctx.stroke();
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(cx - netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + cw + netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = LINE_WIDTH;
}

// ============================================
// PICKLEBALL (with outside area support)
// ============================================

function drawPickleball(rc: RenderContext, design: CourtDesign) {
  const { ctx, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const l = design.dimensions.length;
  const std = STANDARD_COURTS.pickleball;
  const hasSurround = w > std.width || l > std.length;

  let cx: number, cy: number, cw: number, ch: number, s: number;

  if (hasSurround) {
    const inner = drawSurroundCourt(rc, design, std.width, std.length);
    cx = inner.innerX;
    cy = inner.innerY;
    cw = inner.innerW;
    ch = inner.innerH;
    s = inner.innerScale;
  } else {
    cx = rc.courtX;
    cy = rc.courtY;
    cw = rc.courtW;
    ch = rc.courtH;
    s = scale;
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = LINE_WIDTH;

  // Court outline
  ctx.strokeRect(cx, cy, cw, ch);

  // Kitchen (non-volley zone) is 7ft from net on each side
  const netY = cy + ch / 2;
  const kitchenDepth = 7 * s;

  // Kitchen zones
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(cx, netY - kitchenDepth, cw, kitchenDepth * 2);

  ctx.strokeStyle = lineColor;

  // Kitchen lines
  ctx.beginPath();
  ctx.moveTo(cx, netY - kitchenDepth);
  ctx.lineTo(cx + cw, netY - kitchenDepth);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, netY + kitchenDepth);
  ctx.lineTo(cx + cw, netY + kitchenDepth);
  ctx.stroke();

  // Center lines (service areas)
  const centerX = cx + cw / 2;
  ctx.beginPath();
  ctx.moveTo(centerX, cy);
  ctx.lineTo(centerX, netY - kitchenDepth);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, netY + kitchenDepth);
  ctx.lineTo(centerX, cy + ch);
  ctx.stroke();

  // Net
  ctx.lineWidth = LINE_WIDTH_THICK;
  const netOverhang = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(cx - netOverhang, netY);
  ctx.lineTo(cx + cw + netOverhang, netY);
  ctx.stroke();
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(cx - netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + cw + netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = LINE_WIDTH;
}

// ============================================
// VOLLEYBALL
// ============================================

function drawVolleyball(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = LINE_WIDTH;

  ctx.strokeRect(courtX, courtY, courtW, courtH);

  const netY = courtY + courtH / 2;
  const attackLineOffset = 10 * scale;

  ctx.fillStyle = secondaryColor;
  ctx.fillRect(courtX, netY - attackLineOffset, courtW, attackLineOffset * 2);

  ctx.strokeStyle = lineColor;

  ctx.beginPath();
  ctx.moveTo(courtX, netY - attackLineOffset);
  ctx.lineTo(courtX + courtW, netY - attackLineOffset);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(courtX, netY + attackLineOffset);
  ctx.lineTo(courtX + courtW, netY + attackLineOffset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(courtX, netY);
  ctx.lineTo(courtX + courtW, netY);
  ctx.stroke();

  // Net
  ctx.lineWidth = LINE_WIDTH_THICK;
  const netOverhang = 3 * scale;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(courtX - netOverhang, netY);
  ctx.lineTo(courtX + courtW + netOverhang, netY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(courtX - netOverhang, netY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(courtX + courtW + netOverhang, netY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = LINE_WIDTH;
}

// ============================================
// BADMINTON
// ============================================

function drawBadminton(rc: RenderContext, design: CourtDesign) {
  const { ctx, courtX, courtY, courtW, courtH, scale } = rc;
  const lineColor = design.colors.lines;
  const secondaryColor = design.colors.secondary;
  const w = design.dimensions.width;
  const isDoubles = w >= 20;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = LINE_WIDTH;

  ctx.strokeRect(courtX, courtY, courtW, courtH);

  const netY = courtY + courtH / 2;
  const shortServiceOffset = 6.5 * scale;

  ctx.fillStyle = secondaryColor;
  ctx.fillRect(courtX, netY - shortServiceOffset, courtW, shortServiceOffset * 2);

  ctx.strokeStyle = lineColor;

  ctx.beginPath();
  ctx.moveTo(courtX, netY - shortServiceOffset);
  ctx.lineTo(courtX + courtW, netY - shortServiceOffset);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(courtX, netY + shortServiceOffset);
  ctx.lineTo(courtX + courtW, netY + shortServiceOffset);
  ctx.stroke();

  if (isDoubles) {
    const singlesInset = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(courtX + singlesInset, courtY);
    ctx.lineTo(courtX + singlesInset, courtY + courtH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(courtX + courtW - singlesInset, courtY);
    ctx.lineTo(courtX + courtW - singlesInset, courtY + courtH);
    ctx.stroke();

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
  ctx.lineWidth = LINE_WIDTH_THICK;
  const netOverhang = isDoubles ? 2 * scale : 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(courtX - netOverhang, netY);
  ctx.lineTo(courtX + courtW + netOverhang, netY);
  ctx.stroke();
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(courtX - netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(courtX + courtW + netOverhang, netY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = LINE_WIDTH;
}

// ============================================
// MAIN RENDER
// ============================================

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
  const is3D = design.viewMode === '3d';

  if (is3D) {
    // Draw shadow beneath the 3D court
    draw3DShadow(ctx, canvasWidth, canvasHeight, rc.courtX, rc.courtY, rc.courtW, rc.courtH);

    // Draw 3D edge walls before applying transform
    const edgeColor = design.colors.border !== 'transparent' ? design.colors.border : design.colors.primary;
    draw3DEdges(ctx, canvasWidth, canvasHeight, rc.courtX, rc.courtY, rc.courtW, rc.courtH, edgeColor);

    // Apply 3D perspective transform for the court surface
    ctx.save();
    apply3DTransform(ctx, canvasWidth, canvasHeight);
  }

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

  if (is3D) {
    ctx.restore();
  }
}
