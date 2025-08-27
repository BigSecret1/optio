import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { alpha, darken, lighten } from "@mui/material/styles";

import { BRAND_PRIMARY, BRAND_SECONDARY } from "../../../constants";

const scopedTheme = createTheme({
  palette: {
    primary: {
      main: BRAND_PRIMARY,
      light: lighten(BRAND_PRIMARY, 0.15),
      dark: darken(BRAND_PRIMARY, 0.2),
      contrastText: "#fff",
    },
    secondary: {
      main: BRAND_SECONDARY,
      light: lighten(BRAND_SECONDARY, 0.12),
      dark: darken(BRAND_SECONDARY, 0.2),
      contrastText: "#fff",
    },
    background: {
      default: BRAND_SECONDARY,
      paper: BRAND_PRIMARY,
    },
    text: {
      primary: "#fff",
      secondary: alpha("#fff", 0.85),
    },
    divider: alpha("#fff", 0.2),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,.18)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 16, paddingBlock: 10 },
        outlinedInherit: {
          borderColor: alpha("#fff", 0.28),
          color: "#fff",
          "&:hover": {
            borderColor: alpha("#fff", 0.48),
            background: alpha("#fff", 0.06),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px dashed ${alpha("#fff", 0.2)}` },
        head: { fontWeight: 700, color: "#fff" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { color: "#fff", borderColor: alpha("#fff", 0.35) },
        outlined: { borderColor: alpha("#fff", 0.35) },
      },
    },
  },
});

export default function ProjectOverviewThemeProvider({ children }) {
  return <ThemeProvider theme={scopedTheme}>{children}</ThemeProvider>;
}
