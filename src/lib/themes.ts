import { ThemeType } from './types'

export interface Theme {
  id: ThemeType
  name: string
  description: string
  colors: {
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    muted: string
    mutedForeground: string
    card: string
    cardForeground: string
    border: string
    input: string
    ring: string
    success: string
    successForeground: string
    destructive: string
    destructiveForeground: string
  }
}

export const THEMES: Record<ThemeType, Theme> = {
  default: {
    id: 'default',
    name: 'Morado Vibrante',
    description: 'El tema original con tonos morados modernos y elegantes',
    colors: {
      background: 'oklch(0.99 0.005 270)',
      foreground: 'oklch(0.20 0.015 270)',
      primary: 'oklch(0.58 0.22 270)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.72 0.15 310)',
      secondaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.68 0.20 35)',
      accentForeground: 'oklch(1 0 0)',
      muted: 'oklch(0.96 0.01 270)',
      mutedForeground: 'oklch(0.50 0.015 270)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.015 270)',
      border: 'oklch(0.90 0.01 270)',
      input: 'oklch(0.90 0.01 270)',
      ring: 'oklch(0.58 0.22 270)',
      success: 'oklch(0.70 0.15 150)',
      successForeground: 'oklch(1 0 0)',
      destructive: 'oklch(0.58 0.22 25)',
      destructiveForeground: 'oklch(1 0 0)',
    },
  },
  colorful: {
    id: 'colorful',
    name: 'Colorido Arcoíris',
    description: 'Una explosión de colores vibrantes y energéticos',
    colors: {
      background: 'oklch(0.98 0.01 200)',
      foreground: 'oklch(0.15 0.02 260)',
      primary: 'oklch(0.60 0.26 260)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.70 0.22 340)',
      secondaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.65 0.24 140)',
      accentForeground: 'oklch(1 0 0)',
      muted: 'oklch(0.95 0.02 240)',
      mutedForeground: 'oklch(0.45 0.02 260)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.15 0.02 260)',
      border: 'oklch(0.88 0.02 240)',
      input: 'oklch(0.88 0.02 240)',
      ring: 'oklch(0.60 0.26 260)',
      success: 'oklch(0.68 0.20 155)',
      successForeground: 'oklch(1 0 0)',
      destructive: 'oklch(0.60 0.25 25)',
      destructiveForeground: 'oklch(1 0 0)',
    },
  },
  cheerful: {
    id: 'cheerful',
    name: 'Alegre y Optimista',
    description: 'Tonos brillantes y felices que inspiran positividad',
    colors: {
      background: 'oklch(0.99 0.01 90)',
      foreground: 'oklch(0.20 0.03 50)',
      primary: 'oklch(0.70 0.20 65)',
      primaryForeground: 'oklch(0.10 0.02 65)',
      secondary: 'oklch(0.75 0.18 140)',
      secondaryForeground: 'oklch(0.10 0.02 140)',
      accent: 'oklch(0.72 0.22 30)',
      accentForeground: 'oklch(0.10 0.02 30)',
      muted: 'oklch(0.96 0.01 70)',
      mutedForeground: 'oklch(0.48 0.03 60)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.03 50)',
      border: 'oklch(0.90 0.02 80)',
      input: 'oklch(0.90 0.02 80)',
      ring: 'oklch(0.70 0.20 65)',
      success: 'oklch(0.72 0.18 145)',
      successForeground: 'oklch(0.10 0.02 145)',
      destructive: 'oklch(0.65 0.23 25)',
      destructiveForeground: 'oklch(1 0 0)',
    },
  },
  warm: {
    id: 'warm',
    name: 'Tonos Cálidos',
    description: 'Colores cálidos y acogedores que transmiten calidez',
    colors: {
      background: 'oklch(0.98 0.01 45)',
      foreground: 'oklch(0.25 0.03 30)',
      primary: 'oklch(0.62 0.18 35)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.68 0.16 50)',
      secondaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.70 0.20 20)',
      accentForeground: 'oklch(1 0 0)',
      muted: 'oklch(0.94 0.01 40)',
      mutedForeground: 'oklch(0.50 0.03 35)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.25 0.03 30)',
      border: 'oklch(0.88 0.02 40)',
      input: 'oklch(0.88 0.02 40)',
      ring: 'oklch(0.62 0.18 35)',
      success: 'oklch(0.68 0.16 140)',
      successForeground: 'oklch(1 0 0)',
      destructive: 'oklch(0.60 0.22 25)',
      destructiveForeground: 'oklch(1 0 0)',
    },
  },
  dark: {
    id: 'dark',
    name: 'Modo Oscuro',
    description: 'Tema oscuro elegante y relajante para la vista',
    colors: {
      background: 'oklch(0.15 0.01 270)',
      foreground: 'oklch(0.95 0.01 270)',
      primary: 'oklch(0.70 0.20 270)',
      primaryForeground: 'oklch(0.15 0.01 270)',
      secondary: 'oklch(0.75 0.15 310)',
      secondaryForeground: 'oklch(0.15 0.01 270)',
      accent: 'oklch(0.72 0.18 35)',
      accentForeground: 'oklch(0.15 0.01 270)',
      muted: 'oklch(0.25 0.01 270)',
      mutedForeground: 'oklch(0.70 0.01 270)',
      card: 'oklch(0.20 0.01 270)',
      cardForeground: 'oklch(0.95 0.01 270)',
      border: 'oklch(0.30 0.01 270)',
      input: 'oklch(0.30 0.01 270)',
      ring: 'oklch(0.70 0.20 270)',
      success: 'oklch(0.72 0.15 150)',
      successForeground: 'oklch(0.15 0.01 270)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.95 0.01 270)',
    },
  },
}

export function applyTheme(themeId: ThemeType) {
  const theme = THEMES[themeId]
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVar}`, value)
  })
}

export function getThemePreview(themeId: ThemeType) {
  const theme = THEMES[themeId]
  return {
    name: theme.name,
    description: theme.description,
    primaryColor: theme.colors.primary,
    accentColor: theme.colors.accent,
    backgroundColor: theme.colors.background,
  }
}
