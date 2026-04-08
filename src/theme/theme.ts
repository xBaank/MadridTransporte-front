import {createTheme, type PaletteMode, type ThemeOptions} from "@mui/material";
import {
  darkPalette,
  lightPalette,
  radius,
  softShadows,
} from "./tokens";

export const buildTheme = (mode: PaletteMode) => {
  const isDark = mode === "dark";
  const p = isDark ? darkPalette : lightPalette;

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: {main: p.primary, dark: p.primaryDark, contrastText: "#fff"},
      secondary: {main: p.secondary, contrastText: "#fff"},
      success: {main: p.success},
      error: {main: p.error},
      warning: {main: p.warning},
      background: {default: p.background, paper: p.surface},
      text: {primary: p.textPrimary, secondary: p.textSecondary},
      divider: p.border,
    },
    shape: {borderRadius: radius.md},
    typography: {
      fontFamily:
        '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: {fontWeight: 700, letterSpacing: "-0.02em"},
      h2: {fontWeight: 700, letterSpacing: "-0.02em"},
      h3: {fontWeight: 700, letterSpacing: "-0.01em"},
      h4: {fontWeight: 700, letterSpacing: "-0.01em"},
      h5: {fontWeight: 600},
      h6: {fontWeight: 600},
      subtitle1: {fontWeight: 600},
      button: {textTransform: "none", fontWeight: 600, letterSpacing: "0"},
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: p.background,
            color: p.textPrimary,
            WebkitFontSmoothing: "antialiased",
          },
        },
      },
      MuiAppBar: {
        defaultProps: {elevation: 0, color: "default"},
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "rgba(18, 26, 43, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "saturate(180%) blur(12px)",
            WebkitBackdropFilter: "saturate(180%) blur(12px)",
            color: p.textPrimary,
            borderBottom: `1px solid ${p.border}`,
            boxShadow: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          rounded: {borderRadius: radius.lg},
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "rgba(18, 26, 43, 0.92)"
              : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "saturate(180%) blur(12px)",
            WebkitBackdropFilter: "saturate(180%) blur(12px)",
            borderTop: `1px solid ${p.border}`,
            height: 68,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: p.textSecondary,
            minWidth: 0,
            padding: "8px 12px",
            gap: 2,
            "&.Mui-selected": {
              color: p.primary,
            },
            "& .MuiBottomNavigationAction-label": {
              fontWeight: 600,
              fontSize: "0.72rem",
              "&.Mui-selected": {fontSize: "0.72rem"},
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {disableElevation: true},
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 18,
            paddingRight: 18,
            gap: 8,
          },
          contained: {
            boxShadow: softShadows.sm,
            "&:hover": {boxShadow: softShadows.md},
          },
          outlined: {
            borderColor: p.border,
            "&:hover": {borderColor: p.primary, backgroundColor: p.surfaceMuted},
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.pill,
            fontWeight: 600,
            height: 30,
          },
          filled: {
            backgroundColor: p.surfaceMuted,
            color: p.textPrimary,
          },
          colorPrimary: {
            backgroundColor: isDark
              ? "rgba(91, 141, 255, 0.18)"
              : "rgba(11, 95, 255, 0.10)",
            color: p.primary,
          },
          colorError: {
            backgroundColor: isDark
              ? "rgba(251, 113, 133, 0.18)"
              : "rgba(225, 29, 72, 0.10)",
            color: p.error,
          },
          outlined: {
            borderColor: p.border,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            transition: "background-color 0.15s ease",
            "&:hover": {backgroundColor: p.surfaceMuted},
          },
        },
      },
      MuiTextField: {
        defaultProps: {variant: "outlined"},
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: radius.lg,
              backgroundColor: p.surface,
              boxShadow: softShadows.sm,
              "& fieldset": {borderColor: p.border},
              "&:hover fieldset": {borderColor: p.primary},
              "&.Mui-focused fieldset": {
                borderColor: p.primary,
                borderWidth: 1.5,
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${p.border}`,
            boxShadow: softShadows.md,
            backgroundImage: "none",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: radius.pill,
            height: 6,
            backgroundColor: p.surfaceMuted,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {borderColor: p.border},
        },
      },
    },
  };

  return createTheme(options);
};
