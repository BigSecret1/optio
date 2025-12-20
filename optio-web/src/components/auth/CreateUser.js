import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Paper, Box, Grid, FormHelperText } from "@mui/material";
import { User } from "../../user/index";

import HeaderCard from "./ManageUser/HeaderCard";
import TextInput from "./ManageUser/TextInput";
import PasswordField from "./ManageUser/PasswordField";
import RoleSelect from "./ManageUser/RoleSelect";
import SubmitButton from "./ManageUser/SubmitButton";

import TOKENS from "./ManageUser/utils";
import { emailValid } from "./ManageUser/utils";

export const textFieldSx = {
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
};

export default function CreateUser() {
  const userAction = new User();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDisabled =
    submitting ||
    !userData.firstName ||
    !userData.email ||
    !userData.password ||
    !userData.confirmPassword ||
    !userData.role ||
    !passwordMatch ||
    !emailValid(userData.email);

  useEffect(() => {
    if (userData.confirmPassword) {
      setPasswordMatch(userData.password === userData.confirmPassword);
    }
  }, [userData.password, userData.confirmPassword]);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await userAction.createUser(userData);
      navigate("/users/list");
    } catch (err) {
      console.error("create user failed", err);
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(48,73,113,0.06), rgba(48,73,113,0.02))",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            background: TOKENS.projectSecondary,
            color: TOKENS.textColor,
            boxShadow:
              "0 18px 40px rgba(9,30,45,0.35), inset 0 1px 0 rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        >
          <HeaderCard />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextInput
                  label="First name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextInput
                  label="Last name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  label="Email (username)"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  error={
                    userData.email.length > 0 && !emailValid(userData.email)
                  }
                  helperText={
                    userData.email.length > 0 && !emailValid(userData.email)
                      ? "Enter a valid email"
                      : ""
                  }
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PasswordField
                  label="Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  show={showPassword}
                  setShow={setShowPassword}
                  helper={"Use at least 8 characters"}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  show={showConfirm}
                  setShow={setShowConfirm}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <RoleSelect
                  value={userData.role}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <SubmitButton
                  disabled={isDisabled}
                  submitting={submitting}
                  processText="Creating User..."
                  actionText="Create User"
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
