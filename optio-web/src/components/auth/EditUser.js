// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Switch,
//   FormControlLabel,
//   Button,
//   Paper,
//   MenuItem,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";

// import { ROLES } from "../../constants";
// import "./styles/edit-user.css";
// import { User } from "../../user/index";

// const roles = ROLES;

// function EditUser() {
//   const userAction = new User();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     async function fetchUser() {
//       const userDetail = await userAction.listUsers(id);
//       setUser(userDetail);
//     }

//     fetchUser();
//   }, []);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   async function handleSave() {
//     try {
//       const groups = [user.groups];
//       await userAction.updateUser(
//         user.id,
//         user.firstName,
//         user.lastName,
//         groups
//       );
//       navigate("/users/list");
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   }

//   if (!user) return <Typography>Loading...</Typography>;

//   return (
//     <Container maxWidth="sm">
//       <Paper className="edit-user-paper" sx={{ p: 4, mt: 4 }}>
//         <Typography variant="h5" gutterBottom>
//           Edit User
//         </Typography>

//         <TextField
//           className="edit-user-input"
//           label="First Name"
//           fullWidth
//           margin="normal"
//           name="firstName"
//           value={user.firstName}
//           onChange={handleChange}
//         />
//         <TextField
//           className="edit-user-input"
//           label="Last Name"
//           fullWidth
//           margin="normal"
//           name="lastName"
//           value={user.lastName}
//           onChange={handleChange}
//         />
//         <TextField
//           className="edit-user-input"
//           label="Username"
//           fullWidth
//           margin="normal"
//           name="email"
//           value={user.email}
//           onChange={handleChange}
//         />
//         <TextField
//           className="edit-user-input"
//           select
//           label="Role"
//           fullWidth
//           margin="normal"
//           name="groups"
//           value={user.groups}
//           onChange={handleChange}
//         >
//           {roles.map((role) => (
//             <MenuItem key={role} value={role}>
//               {role}
//             </MenuItem>
//           ))}
//         </TextField>

//         <Button
//           variant="contained"
//           sx={{ mt: 2, backgroundColor: "#3F5880" }}
//           onClick={handleSave}
//         >
//           Save
//         </Button>
//       </Paper>
//     </Container>
//   );
// }

// export default EditUser;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

export default function EditUser() {
  const { id } = useParams();
  const userAction = new User();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDisabled = false;
  // submitting ||
  // !userData.firstName ||
  // !userData.email ||
  // !userData.password ||
  // !userData.confirmPassword ||
  // !userData.role ||
  // !passwordMatch ||
  // !emailValid(userData.email);

  useEffect(() => {
    async function fetchUser() {
      const userDetail = await userAction.listUsers(id);
      console.log("User details is ", userDetail);
      setUserData(userDetail);
    }

    fetchUser();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
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
                  readOnly={true}
                  disabled={true}
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

              <Grid item xs={12}>
                <RoleSelect
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
