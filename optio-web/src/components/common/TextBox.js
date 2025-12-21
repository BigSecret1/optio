import React from "react";
import { TextField } from "@mui/material";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

export default function TextBox({ value, handleChange }) {
  return (
    <TextField
      value={value}
      onChange={handleChange}
      fullWidth
      multiline
      minRows={5}
      sx={fieldSx}
      InputLabelProps={{ shrink: false }}
    />
  );
}
