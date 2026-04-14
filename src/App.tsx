import { useState, useRef, useCallback } from 'react';
import type { SportType, CourtDesign, CourtDimensions, CourtColors, GameLineConfig } from './types/court';
import { SPORT_CONFIGS } from './constants/courts';
import SportSelector from './components/SportSelector';
import DimensionPanel from './components/DimensionPanel';
import ColorPanel from './components/ColorPanel';
import GameLinesPanel from './components/GameLinesPanel';
import CourtCanvas from './components/CourtCanvas';
import { exportAsPNG } from './utils/exportUtils';

function buildGameLines(sport: SportType): GameLineConfig[] {
  const allSports: SportType[] = ['basketball', 'tennis', 'pickleball', 'volleyball', 'badminton'];
  const overlayColors: Record<SportType, string> = {
    basketball: '#FF6B35',
    tennis: '#FFD700',
    pickleball: '#00CED1',
    volleyball: '#FF69B4',
    badminton: '#7CFC00',
  };
  return allSports.map((s) => ({
    sport: s,
    enabled: s === sport,
    color: overlayColors[s],
  }));
}

function getDefaultDesign(sport: SportType): CourtDesign {
  const config = SPORT_CONFIGS[sport];
  return {
    sport,
    dimensions: { ...config.presets[config.defaultPresetIndex].dimensions },
    colors: { ...config.defaultColors },
    gameLines: buildGameLines(sport),
    showDimensions: true,
  };
}

type SidebarSection = 'sport' | 'dimensions' | 'colors' | 'lines';

export default function App() {
  const [design, setDesign] = useState<CourtDesign>(() => getDefaultDesign('basketball'));
  const [selectedPreset, setSelectedPreset] = useState(SPORT_CONFIGS.basketball.defaultPresetIndex);
  const [expandedSection, setExpandedSection] = useState<SidebarSection>('sport');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSportChange = useCallback((sport: SportType) => {
    const newDesign = getDefaultDesign(sport);
    setDesign(newDesign);
    setSelectedPreset(SPORT_CONFIGS[sport].defaultPresetIndex);
  }, []);

  const handlePresetChange = useCallback((index: number) => {
    const preset = SPORT_CONFIGS[design.sport].presets[index];
    setSelectedPreset(index);
    setDesign((prev) => ({
      ...prev,
      dimensions: { ...preset.dimensions },
    }));
  }, [design.sport]);

  const handleDimensionsChange = useCallback((dims: CourtDimensions) => {
    setSelectedPreset(-1);
    setDesign((prev) => ({ ...prev, dimensions: dims }));
  }, []);

  const handleColorsChange = useCallback((colors: CourtColors) => {
    setDesign((prev) => ({ ...prev, colors }));
  }, []);

  const handleGameLinesChange = useCallback((gameLines: GameLineConfig[]) => {
    setDesign((prev) => ({ ...prev, gameLines }));
  }, []);

  const handleToggleDimensions = useCallback(() => {
    setDesign((prev) => ({ ...prev, showDimensions: !prev.showDimensions }));
  }, []);

  const handleReset = useCallback(() => {
    const newDesign = getDefaultDesign(design.sport);
    setDesign(newDesign);
    setSelectedPreset(SPORT_CONFIGS[design.sport].defaultPresetIndex);
  }, [design.sport]);

  const handleExport = useCallback(() => {
    exportAsPNG(design);
  }, [design]);

  const toggleSection = (section: SidebarSection) => {
    setExpandedSection((prev) => (prev === section ? prev : section));
  };

  const sections: { key: SidebarSection; label: string; icon: string }[] = [
    { key: 'sport', label: 'Sport', icon: '🏟️' },
    { key: 'dimensions', label: 'Size', icon: '📐' },
    { key: 'colors', label: 'Colors', icon: '🎨' },
    { key: 'lines', label: 'Lines', icon: '📏' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🏀</span>
            Court Designer
          </h1>
          <p className="text-xs text-slate-500 mt-1">Design your dream court</p>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-slate-800">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => toggleSection(section.key)}
              className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
                expandedSection === section.key
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title={section.label}
            >
              <div className="text-base">{section.icon}</div>
              <div className="mt-0.5">{section.label}</div>
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {expandedSection === 'sport' && (
            <SportSelector selected={design.sport} onChange={handleSportChange} />
          )}
          {expandedSection === 'dimensions' && (
            <DimensionPanel
              sport={design.sport}
              dimensions={design.dimensions}
              selectedPreset={selectedPreset}
              onPresetChange={handlePresetChange}
              onDimensionsChange={handleDimensionsChange}
            />
          )}
          {expandedSection === 'colors' && (
            <ColorPanel colors={design.colors} onChange={handleColorsChange} />
          )}
          {expandedSection === 'lines' && (
            <GameLinesPanel
              currentSport={design.sport}
              gameLines={design.gameLines}
              onChange={handleGameLinesChange}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs text-slate-400 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={design.showDimensions}
                onChange={handleToggleDimensions}
                className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              Show dimensions
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25"
            >
              Export PNG
            </button>
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-12 bg-slate-900/50 border-b border-slate-800 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">{SPORT_CONFIGS[design.sport].icon}</span>
            <span className="text-sm font-medium text-white">
              {SPORT_CONFIGS[design.sport].name}
            </span>
            <span className="text-xs text-slate-500">
              {design.dimensions.width}' x {design.dimensions.length}'
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full border border-slate-600"
                style={{ backgroundColor: design.colors.primary }}
                title="Court Surface"
              />
              <div
                className="w-4 h-4 rounded-full border border-slate-600"
                style={{ backgroundColor: design.colors.secondary }}
                title="Key / Zones"
              />
              <div
                className="w-4 h-4 rounded-full border border-slate-600"
                style={{ backgroundColor: design.colors.lines }}
                title="Lines"
              />
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 shadow-2xl">
            <CourtCanvas design={design} canvasRef={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
