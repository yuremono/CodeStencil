/**
 * Y2K Design System Types
 */

export type Y2KColorScheme =
  | "default"
  | "neon"
  | "matrix"
  | "vaporwave"
  | "cyberpunk";

export type Y2KTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  border: string;
};

export const Y2K_THEMES: Record<Y2KColorScheme, Y2KTheme> = {
  default: {
    primary: "#c0c0c0",
    secondary: "#808080",
    accent: "#000080",
    background: "#008080",
    foreground: "#ffffff",
    border: "#808080",
  },
  neon: {
    primary: "#ff00ff",
    secondary: "#00ffff",
    accent: "#ffff00",
    background: "#1a0a2e",
    foreground: "#ffffff",
    border: "#ff00ff",
  },
  matrix: {
    primary: "#00ff00",
    secondary: "#003300",
    accent: "#00ff00",
    background: "#000000",
    foreground: "#00ff00",
    border: "#00ff00",
  },
  vaporwave: {
    primary: "#ff6ec7",
    secondary: "#7873f5",
    accent: "#00ffff",
    background: "#2b1d38",
    foreground: "#ffffff",
    border: "#00ffff",
  },
  cyberpunk: {
    primary: "#ff0040",
    secondary: "#00e5ff",
    accent: "#ffeb3b",
    background: "#0d0221",
    foreground: "#ffffff",
    border: "#ff0040",
  },
};

export type PixelBorderStyle = {
  width: string;
  color: string;
  type: "solid" | "dashed" | "dotted";
};
