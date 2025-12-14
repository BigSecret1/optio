const TOKENS = {
  projectSecondary: "#304971",
  inputSurface: "rgba(255,255,255,0.05)",
  inputHover: "rgba(255,255,255,0.07)",
  labelColor: "rgba(255,255,255,0.85)",
  helperColor: "rgba(255,255,255,0.62)",
  textColor: "#ffffff",
  accent: "#60A5FA",
  disabledBtnBg: "rgba(96,165,250,0.18)",
};

export const textFieldSx = {
  "& .MuiFilledInput-root": {
    backgroundColor: TOKENS.inputSurface,
    color: TOKENS.textColor,
    borderRadius: 1,
    "&:hover": {
      backgroundColor: TOKENS.inputHover,
    },
    "&.Mui-focused": {
      backgroundColor: TOKENS.inputSurface,
    },
    "& input": {
      color: TOKENS.textColor,
    },
  },
  "& label": {
    color: TOKENS.labelColor,
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    color: TOKENS.helperColor,
  },
};

// simpler and reliable email validator for most use-cases
export const emailValid = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

export default TOKENS;
