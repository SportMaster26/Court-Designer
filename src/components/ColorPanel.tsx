import { useState } from 'react';
import type { CourtColors } from '../types/court';
import { COLOR_PALETTE } from '../constants/courts';

interface Props {
  colors: CourtColors;
  onChange: (colors: CourtColors) => void;
}

type ColorKey = keyof CourtColors;

const COLOR_LABELS: Record<ColorKey, string> = {
  primary: 'Court Surface',
  secondary: 'Key / Zones',
  lines: 'Court Lines',
  border: 'Border',
};

// Standard colors only (no White) for fusion mixing
const STANDARD_COLORS = COLOR_PALETTE.filter((c) => c.name !== 'White');

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

function blendColors(hex1: string, hex2: string): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return rgbToHex(
    Math.round((r1 + r2) / 2),
    Math.round((g1 + g2) / 2),
    Math.round((b1 + b2) / 2)
  );
}

type TabMode = 'standard' | 'fusion';

export default function ColorPanel({ colors, onChange }: Props) {
  const [tab, setTab] = useState<TabMode>('standard');
  const [fusionA, setFusionA] = useState(0);
  const [fusionB, setFusionB] = useState(1);
  const [fusionTarget, setFusionTarget] = useState<ColorKey>('primary');

  const handleColorChange = (key: ColorKey, value: string) => {
    onChange({ ...colors, [key]: value });
  };

  const fusionResult = blendColors(STANDARD_COLORS[fusionA].hex, STANDARD_COLORS[fusionB].hex);

  return (
    <div className="space-y-3">
      {/* Tab toggle */}
      <div className="flex bg-slate-800 rounded-lg p-0.5">
        <button
          onClick={() => setTab('standard')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
            tab === 'standard'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => setTab('fusion')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
            tab === 'fusion'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ColorPlus Fusion
        </button>
      </div>

      {tab === 'standard' ? (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            SportMaster Colors
          </h3>

          {(Object.keys(COLOR_LABELS) as ColorKey[]).map((key) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs text-slate-400">{COLOR_LABELS[key]}</label>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded border border-slate-600"
                    style={{ backgroundColor: colors[key] }}
                  />
                  <input
                    type="text"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-[72px] bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 px-1">
                {COLOR_PALETTE.filter((c) => key === 'lines' || c.name !== 'White').map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorChange(key, color.hex)}
                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-all ${
                      colors[key] === color.hex
                        ? 'bg-slate-700 ring-1 ring-blue-400'
                        : 'hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-sm border border-slate-600 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[9px] text-slate-400 leading-tight truncate">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            ColorPlus Fusion Mixer
          </h3>
          <p className="text-[10px] text-slate-500 px-1">
            Blend any two standard colors 50/50 to create a fusion color
          </p>

          {/* Color A */}
          <div className="space-y-1 px-1">
            <label className="text-xs text-slate-400">Color 1</label>
            <div className="grid grid-cols-6 gap-1">
              {STANDARD_COLORS.map((color, idx) => (
                <button
                  key={color.hex}
                  onClick={() => setFusionA(idx)}
                  className={`w-full aspect-square rounded-sm border transition-transform hover:scale-110 ${
                    fusionA === idx
                      ? 'border-white ring-1 ring-blue-400 scale-105'
                      : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500">{STANDARD_COLORS[fusionA].name}</p>
          </div>

          {/* Color B */}
          <div className="space-y-1 px-1">
            <label className="text-xs text-slate-400">Color 2</label>
            <div className="grid grid-cols-6 gap-1">
              {STANDARD_COLORS.map((color, idx) => (
                <button
                  key={color.hex}
                  onClick={() => setFusionB(idx)}
                  className={`w-full aspect-square rounded-sm border transition-transform hover:scale-110 ${
                    fusionB === idx
                      ? 'border-white ring-1 ring-blue-400 scale-105'
                      : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500">{STANDARD_COLORS[fusionB].name}</p>
          </div>

          {/* Fusion result */}
          <div className="px-1 pt-1">
            <div className="bg-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-slate-600"
                  style={{ backgroundColor: STANDARD_COLORS[fusionA].hex }}
                />
                <span className="text-slate-500 text-xs">+</span>
                <div
                  className="w-6 h-6 rounded border border-slate-600"
                  style={{ backgroundColor: STANDARD_COLORS[fusionB].hex }}
                />
                <span className="text-slate-500 text-xs">=</span>
                <div
                  className="w-8 h-8 rounded border-2 border-slate-500"
                  style={{ backgroundColor: fusionResult }}
                />
                <span className="text-xs text-slate-300 font-mono">{fusionResult}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {STANDARD_COLORS[fusionA].name} + {STANDARD_COLORS[fusionB].name}
              </p>
            </div>
          </div>

          {/* Apply to zone */}
          <div className="px-1 space-y-1.5">
            <label className="text-xs text-slate-400">Apply fusion to:</label>
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(COLOR_LABELS) as ColorKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setFusionTarget(key);
                    handleColorChange(key, fusionResult);
                  }}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                    fusionTarget === key && colors[key] === fusionResult
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {COLOR_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
