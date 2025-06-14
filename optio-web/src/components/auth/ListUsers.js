import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import "./styles/list-users.css";
import { User } from "../../user/index";

const userAction = new User();

function ListUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  function handleEdit(id) {
    navigate(`/user/edit/${id}`);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id) {
    try {
      await userAction.deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error("Deletion failed", error);
    }
  }

  async function fetchUsers() {
    console.log("Calling list users method ");
    const usersList = await userAction.listUsers();
    setUsers(usersList);
  }

  return (
    <>
      <Button sx={{ backgroundColor: "#304971", color: "white" }}>
        ADD USER
      </Button>
      <TableContainer
        component={Paper}
        sx={{ mt: 4, backgroundColor: "#304971", color: "white" }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          List Users
        </Typography>
        <Table className="user-table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="icon-cell">
                  <IconButton
                    className="icon-button"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(user.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="fa-icon" />
                  </IconButton>
                  <IconButton
                    className="icon-button"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(user.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="fa-icon" />
                  </IconButton>
                </TableCell>

                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{user.groups}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListUsers;
