import React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = ({ label, name, value, onChange, sx }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      margin="normal"
      type={showPassword ? "text" : "password"}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={sx}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              aria-label="toggle password visibility"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
