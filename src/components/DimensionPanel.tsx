import type { SportType, CourtDimensions } from '../types/court';
import { SPORT_CONFIGS } from '../constants/courts';

interface Props {
  sport: SportType;
  dimensions: CourtDimensions;
  selectedPreset: number;
  onPresetChange: (index: number) => void;
  onDimensionsChange: (dims: CourtDimensions) => void;
}

export default function DimensionPanel({
  sport,
  dimensions,
  selectedPreset,
  onPresetChange,
  onDimensionsChange,
}: Props) {
  const config = SPORT_CONFIGS[sport];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
        Dimensions
      </h3>

      {/* Presets */}
      <div className="space-y-1.5">
        {config.presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onPresetChange(idx)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
              idx === selectedPreset
                ? 'bg-slate-700 text-white ring-1 ring-slate-500'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
            }`}
          >
            <span>{preset.label}</span>
            <span className="text-xs text-slate-500">
              {preset.dimensions.width}' x {preset.dimensions.length}'
            </span>
          </button>
        ))}
      </div>

      {/* Custom dimensions */}
      <div className="pt-2 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2">Custom Size (feet)</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-slate-500 block mb-1">Width</label>
            <input
              type="number"
              min={10}
              max={100}
              value={dimensions.width}
              onChange={(e) =>
                onDimensionsChange({
                  ...dimensions,
                  width: Number(e.target.value) || 10,
                })
              }
              className="w-full bg-slate-800 border border-slate-600 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 block mb-1">Length</label>
            <input
              type="number"
              min={10}
              max={200}
              value={dimensions.length}
              onChange={(e) =>
                onDimensionsChange({
                  ...dimensions,
                  length: Number(e.target.value) || 10,
                })
              }
              className="w-full bg-slate-800 border border-slate-600 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
