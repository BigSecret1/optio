import React from "react";

import { TextField, MenuItem } from "@mui/material";

import { textFieldSx } from "./utils";
import { ROLES as roles } from "../../../constants";

export default function RoleSelect({ value, onChange }) {
  return (
    <TextField
      select
      label="Role"
      name="role"
      value={value}
      onChange={onChange}
      fullWidth
      required
      variant="filled"
      sx={textFieldSx}
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
