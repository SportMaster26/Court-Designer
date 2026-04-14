import type { CourtDesign } from '../types/court';
import { renderCourt } from './courtRenderer';

export function exportAsPNG(design: CourtDesign, filename = 'court-design.png') {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;

  // Temporarily override devicePixelRatio for export
  const origDPR = window.devicePixelRatio;
  Object.defineProperty(window, 'devicePixelRatio', { value: 1, writable: true });

  // Mock getBoundingClientRect
  canvas.getBoundingClientRect = () => ({
    width: 1920,
    height: 1080,
    top: 0,
    left: 0,
    bottom: 1080,
    right: 1920,
    x: 0,
    y: 0,
    toJSON: () => {},
  });

  renderCourt(canvas, design);

  Object.defineProperty(window, 'devicePixelRatio', { value: origDPR, writable: true });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export function exportAsSVG(design: CourtDesign) {
  // For now, export the canvas as PNG - SVG would require a separate renderer
  exportAsPNG(design, 'court-design.png');
}
