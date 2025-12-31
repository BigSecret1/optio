import React, { useState } from "react";

import { Avatar, Button, TextField, Grid, Paper, Box } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

import "./styles/profile.css";

function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  function handleChange(e) {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  }

  function handleSave() {
    console.log("Profile data saved:", profileData);
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="profile-container"
    >
      <Paper elevation={3} className="profile-card">
        <Avatar className="profile-avatar" sx={{ bgcolor: deepOrange[500] }}>
          {profileData.firstName?.[0]?.toUpperCase() || "D"}
          {profileData.lastName?.[0]?.toUpperCase() || ""}
        </Avatar>

        <Box className="profile-inputs">
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={profileData.username}
            onChange={handleChange}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          className="profile-button"
          onClick={handleSave}
        >
          Save
        </Button>
      </Paper>
    </Grid>
  );
}

export default Profile;
