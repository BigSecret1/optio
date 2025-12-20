import React from "react";

import { TextField, MenuItem } from "@mui/material";

import { ROLES as roles } from "../../../constants";

export default function RoleSelect({ value, name = "role", onChange, sx }) {
  return (
    <TextField
      select
      label="Role"
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      required
      variant="filled"
      sx={sx}
      InputProps={{ disableUnderline: true }}
    >
      {roles.map((role) => (
        <MenuItem key={role} value={role}>
          {role}
        </MenuItem>
      ))}
    </TextField>
  );
}
