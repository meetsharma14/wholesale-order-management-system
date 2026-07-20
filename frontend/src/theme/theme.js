import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f4f46",
      dark: "#153c35",
      light: "#e6f2ee",
    },
    secondary: {
      main: "#d97a2b",
      dark: "#a65015",
      light: "#fff1e4",
    },
    success: {
      main: "#2f855a",
    },
    warning: {
      main: "#d97706",
    },
    error: {
      main: "#c2410c",
    },
    text: {
      primary: "#17211d",
      secondary: "#65726d",
    },
    background: {
      default: "#f6f7f4",
      paper: "#ffffff",
    },
    divider: "#e2e7e2",
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(23, 33, 29, 0.06)",
    "0 8px 24px rgba(23, 33, 29, 0.08)",
    "0 12px 32px rgba(23, 33, 29, 0.1)",
    ...Array(21).fill("0 12px 32px rgba(23, 33, 29, 0.12)"),
  ],

  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 750,
      fontSize: "1.75rem",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 750,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at top left, rgba(31, 79, 70, 0.08), transparent 34rem)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid #e2e7e2",
          boxShadow: "0 1px 2px rgba(23, 33, 29, 0.04)",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid #e2e7e2",
          boxShadow: "0 1px 2px rgba(23, 33, 29, 0.04)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 700,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: "#65726d",
          fontSize: "0.76rem",
          fontWeight: 800,
          textTransform: "uppercase",
        },
      },
    },
  },
});

export default theme;
