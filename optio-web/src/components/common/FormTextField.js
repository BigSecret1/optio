import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

const labelSx = {
  color: "white",
  mb: 0.75,
  "&.Mui-focused": { color: "#2196f3" },
};

export default function FormTextField({
  id,
  label,
  value,
  onChange,
  required = false,
  multiline = false,
  minRows,
  autoFocus = false,
  // labelSx = {},
  textFieldProps = {}
}) {
  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel htmlFor={id} sx={labelSx}>
          {label}
          {required && " *"}
        </FormLabel>
      )}

      <TextField
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        fullWidth
        multiline={multiline}
        minRows={minRows}
        autoFocus={autoFocus}
        InputLabelProps={{ shrink: false }}
        sx={textFieldSx}
        {...textFieldProps}
      />
    </FormControl>
  );
}
