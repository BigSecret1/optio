import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Container, Paper, Box, Grid, FormHelperText } from "@mui/material";
import { User } from "../../user/index";

import HeaderCard from "./ManageUser/HeaderCard";
import TextInput from "./ManageUser/TextInput";
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

export default function EditUser() {
  const { id } = useParams();
  const userAction = new User();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isDisabled =
    userData == null ? false : !userData.firstName || !userData.groups;

  useEffect(() => {
    async function fetchUser() {
      const userDetail = await userAction.listUsers(id);
      setUserData(userDetail);
    }
    fetchUser();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      const groups = [userData.groups];
      await userAction.updateUser(
        userData.id,
        userData.firstName,
        userData.lastName,
        groups
      );
      navigate("/users/list");
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  if (!userData) return <p>Loading...</p>;

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
          <HeaderCard title={"Edit User"} />

          <Box component="form" onSubmit={handleSave} noValidate>
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
                  readOnly={true}
                  disabled={true}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <RoleSelect
                  name="groups"
                  value={userData.groups}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <SubmitButton
                  disabled={isDisabled}
                  submitting={submitting}
                  processText="Editing User..."
                  actionText="Edit User"
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
