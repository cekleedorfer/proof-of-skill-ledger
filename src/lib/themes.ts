export interface ThemeColor { bg: string; light: string; text: string }

export interface Theme {
  id: string
  name: string
  accent: string
  bgGradient: string
  colors: ThemeColor[]
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('')
}

function mixWithWhite(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

function textColorFor(hex: string): string {
  return luminance(hex) > 0.62 ? '#1f2937' : '#ffffff'
}

function makeColor(bg: string): ThemeColor {
  return { bg, light: mixWithWhite(bg, 0.84), text: textColorFor(bg) }
}

// Tint applied per significance level — 1 (quiet, light) through 5 (loud, full solid color)
const SIGNIFICANCE_TINT: Record<number, number> = { 1: 0.72, 2: 0.5, 3: 0.28, 4: 0.08, 5: 0 }

export const THEMES: Theme[] = [
  {
    id: 'meadow',
    name: 'Meadow',
    accent: '#849E15',
    bgGradient: 'linear-gradient(160deg, #fdf6ee 0%, #fbeee6 50%, #f3f6e6 100%)',
    colors: [
      makeColor('#849E15'), // Spring Leaves
      makeColor('#D8560E'), // Poppy
      makeColor('#B28622'), // Gold Velvet
      makeColor('#E1903E'), // Florida Oranges
      makeColor('#6D8C2E'), // Olive (cohesive w/ greens)
      makeColor('#C46A3B'), // Terracotta (cohesive w/ oranges)
    ],
  },
  {
    id: 'citrus',
    name: 'Citrus',
    accent: '#EF6F3C',
    bgGradient: 'linear-gradient(160deg, #fff3ec 0%, #fefbe9 50%, #eef7ec 100%)',
    colors: [
      makeColor('#EF6F3C'), // Blood Orange
      makeColor('#25533F'), // Forest
      makeColor('#AFAB23'), // Olive Green
      makeColor('#876029'), // Dry Earth
      makeColor('#D98A3D'), // Warm Amber (cohesive w/ orange/earth)
      makeColor('#5C7A3A'), // Sage (cohesive w/ forest/olive)
    ],
  },
  {
    id: 'harbor',
    name: 'Harbor',
    accent: '#035063',
    bgGradient: 'linear-gradient(160deg, #eef7fb 0%, #fdf3fb 50%, #fff8ef 100%)',
    colors: [
      makeColor('#035063'), // Ocean Teal
      makeColor('#1D7A8C'), // Mid Teal
      makeColor('#61A6F7'), // Cornflower Blue
      makeColor('#2E6FA3'), // Steel Blue
      makeColor('#0E8C7A'), // Teal Green
      makeColor('#4A8FBF'), // Sky Blue
    ],
  },
  {
    id: 'orchard',
    name: 'Orchard',
    accent: '#008471',
    bgGradient: 'linear-gradient(160deg, #eef6f4 0%, #fdf0f5 50%, #fefae8 100%)',
    colors: [
      makeColor('#008471'), // Tropical Rain
      makeColor('#C45F3F'), // Tomato Jam
      makeColor('#898E46'), // Monet Ponds
      makeColor('#3E8F6E'), // Jade (cohesive w/ tropical rain)
      makeColor('#B86B4B'), // Clay (cohesive w/ tomato jam)
      makeColor('#6E8C3F'), // Olive Moss (cohesive w/ monet ponds)
    ],
  },
  {
    id: 'berry',
    name: 'Berry',
    accent: '#C21047',
    bgGradient: 'linear-gradient(160deg, #fdf0f5 0%, #f5f0fb 50%, #fff5ef 100%)',
    colors: [
      makeColor('#C21047'), // Raspberry Red
      makeColor('#6D1F42'), // Grape Juice
      makeColor('#D17089'), // Dusty Berry
      makeColor('#9C3B6B'), // Plum (cohesive w/ grape/raspberry)
      makeColor('#B6457A'), // Magenta Rose
      makeColor('#7A2F58'), // Deep Mauve
    ],
  },
  {
    id: 'sun',
    name: 'Sun',
    accent: '#F4D242',
    bgGradient: 'linear-gradient(160deg, #fffaeb 0%, #fff3e6 50%, #fefce8 100%)',
    colors: [
      makeColor('#E1903E'), // Florida Oranges
      makeColor('#D6A226'), // Pure Sun (deepened for contrast)
      makeColor('#B28622'), // Gold Velvet
      makeColor('#C97A2E'), // Mango Amber
      makeColor('#A88B1F'), // Limeade (deepened)
      makeColor('#D8560E'), // Poppy
    ],
  },
]

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

export function getThemedColor(theme: Theme, index: number): ThemeColor {
  return theme.colors[index % theme.colors.length]
}

/** Returns a hex color shaded by significance: lighter/quieter for low significance, full solid for high. */
export function getBubbleColor(theme: Theme, index: number, significance: number): string {
  const base = getThemedColor(theme, index).bg
  const tint = SIGNIFICANCE_TINT[significance] ?? 0
  return tint === 0 ? base : mixWithWhite(base, tint)
}

export function textColorForBg(hex: string): string {
  return textColorFor(hex)
}
