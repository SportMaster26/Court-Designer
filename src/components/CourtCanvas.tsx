import { useRef, useEffect } from 'react';
import type { CourtDesign } from '../types/court';
import { renderCourt } from '../utils/courtRenderer';

interface Props {
  design: CourtDesign;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function CourtCanvas({ design, canvasRef: externalRef }: Props) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const ref = externalRef || internalRef;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => renderCourt(canvas, design);
    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [design, ref]);

  return (
    <canvas
      ref={ref}
      className="w-full h-full block"
    />
  );
}
