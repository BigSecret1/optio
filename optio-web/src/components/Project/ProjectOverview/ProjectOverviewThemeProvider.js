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
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
          paddingBlock: 10,
          textTransform: "none", // so both buttons skip uppercase
        },
      },
      variants: [
        {
          // Cancel button
          props: { variant: "cancel" },
          style: {
            color: "#c5d1e0",
            "&:hover": { color: "#ffffff" },
          },
        },
        {
          // Save button
          props: { variant: "save" },
          style: {
            backgroundColor: "#304971",
            "&:hover": { backgroundColor: "#1e40af" },
            fontWeight: 700,
            fontSize: "1rem",
            borderRadius: 8, // = theme.spacing(1) * 2, same as `borderRadius: 2` sx
            paddingInline: 24, // px: 3
            color: "#ffffff",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
          },
        },
      ],
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
