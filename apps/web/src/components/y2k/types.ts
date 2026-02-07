/**
 * Y2K Design System Types
 */

export type Y2KColorScheme =
  | "default"
  | "neon"
  | "matrix"
  | "vaporwave"
  | "cyberpunk"
  | "dribbble"; // New Dribbble-inspired theme

export type Y2KTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  border: string;
  gradient?: string; // CSS gradient for backgrounds
};

// Y2K Color Palette - Dribbble inspired
export const Y2K_COLORS = {
  // Vibrant Pink
  pink: "#ff6ec7",
  pinkLight: "#ff9be7",
  pinkDark: "#d94ba3",

  // Vibrant Purple
  purple: "#7873f5",
  purpleLight: "#a8a4f8",
  purpleDark: "#5a56c7",

  // Bright Cyan
  cyan: "#00e5ff",
  cyanLight: "#67f0ff",
  cyanDark: "#00b8cc",

  // Bright Yellow
  yellow: "#ffeb3b",
  yellowLight: "#fff071",
  yellowDark: "#ffc107",

  // Additional Y2K colors
  hotPink: "#ff0080",
  lime: "#00ff00",
  orange: "#ff6b00",
} as const;

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
  // New Dribbble-inspired theme with vibrant gradients
  dribbble: {
    primary: Y2K_COLORS.pink,
    secondary: Y2K_COLORS.purple,
    accent: Y2K_COLORS.cyan,
    background: "#2b1d38",
    foreground: "#ffffff",
    border: Y2K_COLORS.pink,
    gradient: "linear-gradient(135deg, #ff6ec7 0%, #7873f5 50%, #a855f7 100%)",
  },
};

export type PixelBorderStyle = {
  width: string;
  color: string;
  type: "solid" | "dashed" | "dotted";
};

// Y2K Effect Types
export type Y2KEffect =
  | "metallic"
  | "psychedelic-glow"
  | "gradient-text"
  | "pixel-border"
  | "rainbow-border";

export type Y2KFont = "pixel" | "terminal" | "retro";
