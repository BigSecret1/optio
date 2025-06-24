import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
  Box,
} from "@mui/material";

import { ROLES as roles } from "../../constants";
import { User } from "../../user/index";

function CreateUser() {
  const userAction = new User();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        name === "confirmPassword"
          ? value === userData.password
          : userData.confirmPassword === value
      );
    }
  };

  async function handleSubmit(e) {
    if (!passwordMatch) return;
    e.preventDefault();
    const data = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      role: userData.role,
    };
    await userAction.createUser(data);
    navigate("/users/list");
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New User
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            margin="normal"
            value={userData.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            margin="normal"
            value={userData.lastName}
            onChange={handleChange}
          />
          <TextField
            label="Username"
            name="email"
            fullWidth
            margin="normal"
            value={userData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            value={userData.password}
            onChange={handleChange}
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            fullWidth
            margin="normal"
            value={userData.confirmPassword}
            onChange={handleChange}
            error={!passwordMatch && userData.confirmPassword.length > 0}
            helperText={
              !passwordMatch && userData.confirmPassword.length > 0
                ? "Passwords do not match"
                : ""
            }
          />
          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            margin="normal"
            value={userData.role}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!passwordMatch}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateUser;
