// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   Container,
//   TextField,
//   Typography,
//   MenuItem,
//   Button,
//   Paper,
//   Box,
//   Grid,
//   Avatar,
//   InputAdornment,
//   IconButton,
//   FormHelperText,
//   useTheme,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

// import { ROLES as roles } from "../../constants";
// import { User } from "../../user/index";

// export default function CreateUser() {
//   const userAction = new User();
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const [userData, setUserData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//   });
//   const [passwordMatch, setPasswordMatch] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const emailValid = (email) =>
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i.test(
//       email
//     );

//   function handleChange(e) {
//     const { name, value } = e.target;

//     setUserData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (name === "confirmPassword" || name === "password") {
//       const newPassword = name === "password" ? value : userData.password;
//       const newConfirm =
//         name === "confirmPassword" ? value : userData.confirmPassword;
//       setPasswordMatch(newPassword === newConfirm);
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!passwordMatch) return;
//     if (!emailValid(userData.email)) return;

//     setSubmitting(true);

//     const data = {
//       email: userData.email,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       password: userData.password,
//       role: userData.role,
//     };

//     try {
//       await userAction.createUser(data);
//       navigate("/users/list");
//     } catch (err) {
//       console.error("create user failed", err);
//       setSubmitting(false);
//     }
//   }

//   // Project color tokens
//   const projectSecondary = "#304971"; // user-provided secondary color (card bg)
//   const inputSurface = "rgba(255,255,255,0.05)"; // subtle contrast for inputs
//   const inputHover = "rgba(255,255,255,0.07)";
//   const labelColor = "rgba(255,255,255,0.85)";
//   const helperColor = "rgba(255,255,255,0.62)";
//   const textColor = "#ffffff";
//   const accent = "#60A5FA"; // light blue accent that pairs with #304971
//   const disabledBtnBg = "rgba(96,165,250,0.18)";

//   const textFieldSx = {
//     "& .MuiFilledInput-root": {
//       backgroundColor: inputSurface,
//       color: textColor,
//       borderRadius: 1,
//       "&:hover": {
//         backgroundColor: inputHover,
//       },
//       "&.Mui-focused": {
//         backgroundColor: inputSurface,
//       },
//       "& input": {
//         color: textColor,
//       },
//     },
//     "& label": {
//       color: labelColor,
//       fontWeight: 500,
//     },
//     "& .MuiFormHelperText-root": {
//       color: helperColor,
//     },
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "85vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background:
//           "linear-gradient(180deg, rgba(48,73,113,0.06), rgba(48,73,113,0.02))",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={10}
//           sx={{
//             p: { xs: 3, md: 5 },
//             borderRadius: 3,
//             background: projectSecondary,
//             color: textColor,
//             boxShadow:
//               "0 18px 40px rgba(9,30,45,0.35), inset 0 1px 0 rgba(255,255,255,0.02)",
//             border: "1px solid rgba(255,255,255,0.03)",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               mb: 2,
//             }}
//           >
//             <Avatar sx={{ bgcolor: accent, width: 48, height: 48 }}>
//               <LockOutlinedIcon sx={{ color: "#002027" }} />
//             </Avatar>

//             <Box>
//               <Typography
//                 variant="h5"
//                 sx={{ fontWeight: 700, color: textColor }}
//               >
//                 Create New User
//               </Typography>
//               <Typography variant="body2" sx={{ color: helperColor, mt: 0.3 }}>
//                 Add a user and assign a role
//               </Typography>
//             </Box>
//           </Box>

//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="First name"
//                   name="firstName"
//                   value={userData.firstName}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="filled"
//                   sx={textFieldSx}
//                   InputProps={{ disableUnderline: true }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Last name"
//                   name="lastName"
//                   value={userData.lastName}
//                   onChange={handleChange}
//                   fullWidth
//                   variant="filled"
//                   sx={textFieldSx}
//                   InputProps={{ disableUnderline: true }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Email (username)"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="filled"
//                   sx={textFieldSx}
//                   InputProps={{ disableUnderline: true }}
//                   error={
//                     userData.email.length > 0 && !emailValid(userData.email)
//                   }
//                   helperText={
//                     userData.email.length > 0 && !emailValid(userData.email)
//                       ? "Enter a valid email"
//                       : ""
//                   }
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Password"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="filled"
//                   sx={textFieldSx}
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword((s) => !s)}
//                           edge="end"
//                           aria-label="toggle password visibility"
//                           sx={{ color: labelColor }}
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 <FormHelperText sx={{ color: helperColor, mt: 0.6 }}>
//                   Use at least 8 characters
//                 </FormHelperText>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Confirm password"
//                   type={showConfirm ? "text" : "password"}
//                   name="confirmPassword"
//                   value={userData.confirmPassword}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="filled"
//                   sx={textFieldSx}
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowConfirm((s) => !s)}
//                           edge="end"
//                           aria-label="toggle confirm password"
//                           sx={{ color: labelColor }}
//                         >
//                           {showConfirm ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 {!passwordMatch && userData.confirmPassword.length > 0 && (
//                   <FormHelperText error sx={{ mt: 0.6 }}>
//                     Passwords do not match
//                   </FormHelperText>
//                 )}
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   select
//                   label="Role"
//                   name="role"
//                   value={userData.role}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="filled"
//                   sx={textFieldSx}
//                   InputProps={{ disableUnderline: true }}
//                 >
//                   {roles.map((role) => (
//                     <MenuItem key={role} value={role}>
//                       {role}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   fullWidth
//                   disabled={
//                     submitting ||
//                     !userData.firstName ||
//                     !userData.email ||
//                     !userData.password ||
//                     !userData.role ||
//                     !passwordMatch ||
//                     !emailValid(userData.email)
//                   }
//                   sx={{
//                     py: 1.25,
//                     mt: 1,
//                     fontWeight: 700,
//                     textTransform: "none",
//                     bgcolor: accent,
//                     color: "#002027",
//                     "&:hover": { bgcolor: "#3fb0ff" },
//                     "&.Mui-disabled": {
//                       bgcolor: disabledBtnBg,
//                       color: "rgba(0,20,30,0.5)",
//                     },
//                   }}
//                 >
//                   {submitting ? "Creating..." : "Create user"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }

import React, { useState } from "react";
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

  function handleChange(e) {
    const { name, value } = e.target;
    console.log("Value is input box is ", value);
    setUserData((prev) => ({ ...prev, [name]: value }));
    console.log("user data during password typing is ", userData);

    if (name === "confirmPassword" || name === "password") {
      const newPassword = name === "password" ? value : userData.password;
      const newConfirm =
        name === "confirmPassword" ? value : userData.confirmPassword;
      setPasswordMatch(newPassword === newConfirm);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!passwordMatch) return;
    if (!emailValid(userData.email)) return;

    setSubmitting(true);

    const data = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      role: userData.role,
    };

    try {
      await userAction.createUser(data);
      navigate("/users/list");
    } catch (err) {
      console.error("create user failed", err);
      setSubmitting(false);
    }
  }

  const isDisabled =
    submitting ||
    !userData.firstName ||
    !userData.email ||
    !userData.password ||
    !userData.role ||
    !passwordMatch ||
    !emailValid(userData.email);

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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextInput
                  label="Last name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
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
                  errorText={
                    !passwordMatch && userData.confirmPassword.length > 0
                      ? "Passwords do not match"
                      : null
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <RoleSelect value={userData.role} onChange={handleChange} />
              </Grid>

              <Grid item xs={12}>
                <SubmitButton disabled={isDisabled} submitting={submitting} />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
