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
      { label: 'Standard Court (36\' x 78\')', dimensions: { width: 36, length: 78 } },
      { label: 'Full Area (60\' x 120\')', dimensions: { width: 60, length: 120 } },
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
      { label: 'Standard Court (20\' x 44\')', dimensions: { width: 20, length: 44 } },
      { label: 'Full Area (30\' x 60\')', dimensions: { width: 30, length: 60 } },
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

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  // SportMaster Standard Colors
  { name: 'Light Green', hex: '#7AB648' },
  { name: 'Forest Green', hex: '#2E6B34' },
  { name: 'Dark Green', hex: '#1B4332' },
  { name: 'Light Blue', hex: '#5B9BD5' },
  { name: 'Blue', hex: '#2255A4' },
  { name: 'Ice Blue', hex: '#A8D8EA' },
  { name: 'Tournament Purple', hex: '#6A1B9A' },
  { name: 'Red', hex: '#C62828' },
  { name: 'Brite Red', hex: '#EF2D2D' },
  { name: 'Maroon', hex: '#6E1423' },
  { name: 'Orange', hex: '#E8711E' },
  { name: 'Yellow', hex: '#F9C622' },
  { name: 'Sandstone', hex: '#C8A96E' },
  { name: 'Beige', hex: '#D4C5A9' },
  { name: 'Dove Gray', hex: '#9E9E9E' },
  { name: 'Gray', hex: '#6B6B6B' },
  { name: 'Brown', hex: '#5D4037' },
  { name: 'Black', hex: '#1A1A1A' },
];
