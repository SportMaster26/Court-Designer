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

export default function ColorPanel({ colors, onChange }: Props) {
  const handleColorChange = (key: ColorKey, value: string) => {
    onChange({ ...colors, [key]: value });
  };

  return (
    <div className="space-y-3">
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
            {COLOR_PALETTE.map((color) => (
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
    </div>
  );
}
