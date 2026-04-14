export type SportType =
  | 'basketball'
  | 'tennis'
  | 'pickleball'
  | 'volleyball'
  | 'badminton';

export interface CourtDimensions {
  width: number;  // feet
  length: number; // feet
}

export interface CourtPreset {
  label: string;
  dimensions: CourtDimensions;
}

export interface SportConfig {
  name: string;
  icon: string;
  presets: CourtPreset[];
  defaultPresetIndex: number;
  defaultColors: CourtColors;
}

export interface CourtColors {
  primary: string;      // Main court surface
  secondary: string;    // Key/zones/alternating areas
  lines: string;        // Court line color
  border: string;       // Court border/out-of-bounds
}

export interface GameLineConfig {
  sport: SportType;
  enabled: boolean;
  color: string;
}

export interface CourtDesign {
  sport: SportType;
  dimensions: CourtDimensions;
  colors: CourtColors;
  gameLines: GameLineConfig[];
  showDimensions: boolean;
}
