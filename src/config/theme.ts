// src/config/theme.ts
export const themeConfig = {
  defaultTheme: 'light',
  themes: ['light', 'dark'],
  tokens: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.141 0.005 285.823)',
      primary: 'oklch(0.21 0.006 285.885)',
      border: 'oklch(0.92 0.004 286.32)',
      radius: '0.625rem',
    },
    dark: {
      background: 'oklch(0.141 0.005 285.823)',
      foreground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.985 0 0)',
      border: 'oklch(0.274 0.006 286.033)',
      radius: '0.625rem',
    }
  }
};