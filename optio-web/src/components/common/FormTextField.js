import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";

export default function FormTextField({
  id,
  label,
  value,
  onChange,
  required = false,
  multiline = false,
  minRows,
  autoFocus = false,
  textFieldSx = {},
  labelSx = {},
  textFieldProps = {},   // 👈 escape hatch
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
