import type { SportType, GameLineConfig } from '../types/court';
import { SPORT_CONFIGS, COLOR_PALETTE } from '../constants/courts';

interface Props {
  currentSport: SportType;
  gameLines: GameLineConfig[];
  onChange: (gameLines: GameLineConfig[]) => void;
}

export default function GameLinesPanel({ currentSport, gameLines, onChange }: Props) {
  const toggleLine = (sport: SportType) => {
    onChange(
      gameLines.map((gl) =>
        gl.sport === sport ? { ...gl, enabled: !gl.enabled } : gl
      )
    );
  };

  const changeColor = (sport: SportType, color: string) => {
    onChange(
      gameLines.map((gl) =>
        gl.sport === sport ? { ...gl, color } : gl
      )
    );
  };

  const otherLines = gameLines.filter((gl) => gl.sport !== currentSport);

  if (otherLines.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
        Multi-Sport Lines
      </h3>
      <p className="text-xs text-slate-500 px-1">
        Overlay game lines from other sports
      </p>

      <div className="space-y-2">
        {otherLines.map((gl) => {
          const config = SPORT_CONFIGS[gl.sport];
          return (
            <div key={gl.sport} className="space-y-1.5">
              <button
                onClick={() => toggleLine(gl.sport)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  gl.enabled
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-base">{config.icon}</span>
                <span className="flex-1 text-left">{config.name}</span>
                <span
                  className={`w-8 h-4.5 rounded-full transition-colors relative ${
                    gl.enabled ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      gl.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </span>
              </button>

              {gl.enabled && (
                <div className="flex flex-wrap gap-1 px-2">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => changeColor(gl.sport, color.hex)}
                      className={`w-4 h-4 rounded-sm border transition-transform hover:scale-125 ${
                        gl.color === color.hex
                          ? 'border-white ring-1 ring-blue-400 scale-110'
                          : 'border-slate-600'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
