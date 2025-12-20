import React from "react";

import { TextField } from "@mui/material";

import { textFieldSx } from "./utils";

export default function TextInput({
  label,
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  disabled = false,
  ...rest
}) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      required={required}
      variant="filled"
      sx={textFieldSx}
      InputProps={{
        disableUnderline: true,
        readOnly: readOnly,
      }}
      {...rest}
    />
  );
}
