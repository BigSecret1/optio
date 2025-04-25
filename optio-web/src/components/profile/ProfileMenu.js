import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deepOrange } from "@mui/material/colors";

import "./styles/profile-menu.css";
import { signOut } from "../../user/actions/signOut";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../utils/user";

function ProfileMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  function handleAvatarClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function routeToLoginPage() {
    navigate("/login");
  }

  function handleClose(option) {
    const optionActions = {
      "Sign out": () => signOut(),
    };
    const action = optionActions[option];
    if (action) {
      action();
    }
    if (option === "Sign out") {
      routeToLoginPage();
    }
    setAnchorEl(null);
  }

  const profileMenuOptions = [
    "Your profile",
    "Your projects",
    "Your tasks",
    "Change password",
  ];
  let currentUser = localStorage.getItem("user");
  const userIsAdmin = isAdmin(JSON.parse(currentUser).groups);
  if (userIsAdmin) {
    const optionsForAdmin = ["List users"];
    profileMenuOptions.push(...optionsForAdmin);
  }
  profileMenuOptions.push("Sign Out");

  return (
    <div className="profile-menu-container">
      <Avatar
        onClick={handleAvatarClick}
        sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
        alt="Dinesh Balotiya"
      >
        D
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          className: "profile-menu",
        }}
      >
        {profileMenuOptions.map((option) => (
          <MenuItem key={option} onClick={() => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default ProfileMenu;
