import type { SportType, SportConfig } from '../types/court';

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  basketball: {
    name: 'Basketball',
    icon: '🏀',
    presets: [
      { label: 'NBA Full Court', dimensions: { width: 50, length: 94 } },
      { label: 'NBA Half Court', dimensions: { width: 50, length: 47 } },
      { label: 'High School Full', dimensions: { width: 50, length: 84 } },
      { label: 'High School Half', dimensions: { width: 50, length: 42 } },
      { label: '3x3 Court', dimensions: { width: 36, length: 33 } },
      { label: 'Backyard (30x50)', dimensions: { width: 30, length: 50 } },
      { label: 'Backyard (25x45)', dimensions: { width: 25, length: 45 } },
    ],
    defaultPresetIndex: 1,
    defaultColors: {
      primary: '#CD853F',
      secondary: '#B8732D',
      lines: '#FFFFFF',
      border: '#8B6914',
    },
  },
  tennis: {
    name: 'Tennis',
    icon: '🎾',
    presets: [
      { label: 'Full Court (Doubles)', dimensions: { width: 36, length: 78 } },
      { label: 'Full Court (Singles)', dimensions: { width: 27, length: 78 } },
      { label: 'Practice Court', dimensions: { width: 36, length: 60 } },
    ],
    defaultPresetIndex: 0,
    defaultColors: {
      primary: '#2D6A2D',
      secondary: '#1E4D2B',
      lines: '#FFFFFF',
      border: '#8B4513',
    },
  },
  pickleball: {
    name: 'Pickleball',
    icon: '🏓',
    presets: [
      { label: 'Standard Court', dimensions: { width: 20, length: 44 } },
      { label: 'With Run-Out', dimensions: { width: 30, length: 60 } },
    ],
    defaultPresetIndex: 0,
    defaultColors: {
      primary: '#2563EB',
      secondary: '#1D4ED8',
      lines: '#FFFFFF',
      border: '#1E3A5F',
    },
  },
  volleyball: {
    name: 'Volleyball',
    icon: '🏐',
    presets: [
      { label: 'Standard Court', dimensions: { width: 30, length: 60 } },
      { label: 'FIVB Court', dimensions: { width: 30, length: 59 } },
      { label: 'Beach Court', dimensions: { width: 27, length: 54 } },
    ],
    defaultPresetIndex: 0,
    defaultColors: {
      primary: '#D97706',
      secondary: '#B45309',
      lines: '#FFFFFF',
      border: '#92400E',
    },
  },
  badminton: {
    name: 'Badminton',
    icon: '🏸',
    presets: [
      { label: 'Full Court (Doubles)', dimensions: { width: 20, length: 44 } },
      { label: 'Full Court (Singles)', dimensions: { width: 17, length: 44 } },
    ],
    defaultPresetIndex: 0,
    defaultColors: {
      primary: '#059669',
      secondary: '#047857',
      lines: '#FFFFFF',
      border: '#064E3B',
    },
  },
};

export const COLOR_PALETTE = [
  '#C0392B', '#E74C3C', '#E91E63', '#9B59B6', '#8E44AD',
  '#2980B9', '#3498DB', '#2563EB', '#1ABC9C', '#16A085',
  '#27AE60', '#2ECC71', '#2D6A2D', '#059669', '#F39C12',
  '#F1C40F', '#E67E22', '#D35400', '#D97706', '#CD853F',
  '#795548', '#8B4513', '#B8732D', '#7F8C8D', '#95A5A6',
  '#34495E', '#2C3E50', '#1E293B', '#FFFFFF', '#000000',
];
