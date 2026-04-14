import type { SportType } from '../types/court';
import { SPORT_CONFIGS } from '../constants/courts';

interface Props {
  selected: SportType;
  onChange: (sport: SportType) => void;
}

const sports = Object.keys(SPORT_CONFIGS) as SportType[];

export default function SportSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
        Sport
      </h3>
      <div className="grid grid-cols-1 gap-1.5">
        {sports.map((sport) => {
          const config = SPORT_CONFIGS[sport];
          const isActive = sport === selected;
          return (
            <button
              key={sport}
              onClick={() => onChange(sport)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
              }`}
            >
              <span className="text-lg">{config.icon}</span>
              <span>{config.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
