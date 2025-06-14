import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { ROLES } from "../../constants";
import "./styles/edit-user.css";
import { User } from "../../user/index";

const userAction = new User();

const roles = ROLES;

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const userDetail = await userAction.listUsers(id);
      setUser(userDetail);
    }

    fetchUser();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    try {
      const groups = [user.groups];
      await userAction.updateUser(
        user.id,
        user.firstName,
        user.lastName,
        groups
      );
      navigate("/users/list");
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Paper className="edit-user-paper" sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit User
        </Typography>

        <TextField
          className="edit-user-input"
          label="First Name"
          fullWidth
          margin="normal"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
        />
        <TextField
          className="edit-user-input"
          label="Last Name"
          fullWidth
          margin="normal"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
        />
        <TextField
          className="edit-user-input"
          label="Username"
          fullWidth
          margin="normal"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <TextField
          className="edit-user-input"
          select
          label="Role"
          fullWidth
          margin="normal"
          name="groups"
          value={user.groups}
          onChange={handleChange}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#3F5880" }}
          onClick={handleSave}
        >
          Save
        </Button>
      </Paper>
    </Container>
  );
}

export default EditUser;
