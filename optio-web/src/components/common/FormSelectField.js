import React from "react";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";

export default function FormSelectField({
  label,
  labelId,
  value,
  onChange,
  options = [],
  fullWidth = true,
  selectSx = {},
  labelSx = {},
  displayEmpty = false,
  inputId,
}) {
  return (
    <FormControl fullWidth={fullWidth}>
      {label && (
        <FormLabel id={labelId} sx={labelSx}>
          {label}
        </FormLabel>
      )}

      <Select
        aria-labelledby={labelId}
        value={value}
        onChange={onChange}
        sx={selectSx}
        displayEmpty={displayEmpty}
        inputProps={{ id: inputId }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
