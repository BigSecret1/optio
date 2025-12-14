import React from "react";
import { TextField } from "@mui/material";

const PasswordField = ({ label, value, onChange }) => (
  <TextField
    fullWidth
    type="password"
    margin="normal"
    label={label}
    value={value}
    onChange={onChange}
  />
);

export default PasswordField;
