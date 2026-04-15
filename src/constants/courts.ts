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
      primary: '#BD9F6F',
      secondary: '#73292F',
      lines: '#FFFFFF',
      border: '#5B5D62',
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
      primary: '#225533',
      secondary: '#005B33',
      lines: '#FFFFFF',
      border: '#73292F',
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
      primary: '#005382',
      secondary: '#49C7ED',
      lines: '#FFFFFF',
      border: '#002F54',
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
      primary: '#E36245',
      secondary: '#FFCA6E',
      lines: '#FFFFFF',
      border: '#5B5D62',
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
      primary: '#005B33',
      secondary: '#225533',
      lines: '#FFFFFF',
      border: '#3C4F39',
    },
  },
};

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  // SportMaster Standard Colors
  { name: 'Light Green', hex: '#005B33' },
  { name: 'Forest Green', hex: '#225533' },
  { name: 'Dark Green', hex: '#3C4F39' },
  { name: 'Light Blue', hex: '#005382' },
  { name: 'Blue', hex: '#002F54' },
  { name: 'Ice Blue', hex: '#49C7ED' },
  { name: 'Tournament Purple', hex: '#1C1B57' },
  { name: 'Red', hex: '#73292F' },
  { name: 'Brite Red', hex: '#C72127' },
  { name: 'Maroon', hex: '#4E131E' },
  { name: 'Orange', hex: '#E36245' },
  { name: 'Yellow', hex: '#FFCA6E' },
  { name: 'Sandstone', hex: '#BD9F6F' },
  { name: 'Beige', hex: '#614F43' },
  { name: 'Dove Gray', hex: '#9398A0' },
  { name: 'Gray', hex: '#5B5D62' },
  { name: 'Brown', hex: '#422E2F' },
  { name: 'Black', hex: '#231F20' },
  { name: 'White', hex: '#FFFFFF' },
];
