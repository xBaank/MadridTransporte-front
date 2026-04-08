// Centralized design tokens shared by MUI theme and Tailwind config.
// Keep this file pure (no imports) so it can be consumed from both.

export const lineColors = {
  metro: "#FFCB05",
  metroLigero: "#70C5E8",
  train: "#E2231A",
  emt: "#0072CE",
  bus: "#5BBF21",
  fallback: "#7A1F1F",
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const softShadows = {
  sm: "0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)",
  md: "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
  lg: "0 12px 32px -8px rgba(15, 23, 42, 0.18), 0 4px 12px -2px rgba(15, 23, 42, 0.06)",
} as const;

export const lightPalette = {
  primary: "#0B5FFF",
  primaryDark: "#0848C4",
  secondary: "#FF7A1A",
  background: "#F6F8FB",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF1F6",
  border: "#E3E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#5C6B82",
  success: "#10B981",
  error: "#E11D48",
  warning: "#F59E0B",
} as const;

export const darkPalette = {
  primary: "#5B8DFF",
  primaryDark: "#3A6CE0",
  secondary: "#FFA259",
  background: "#0B1220",
  surface: "#121A2B",
  surfaceMuted: "#1A2336",
  border: "#243049",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  success: "#34D399",
  error: "#FB7185",
  warning: "#FBBF24",
} as const;

export type Tokens = {
  lineColors: typeof lineColors;
  radius: typeof radius;
  softShadows: typeof softShadows;
};
