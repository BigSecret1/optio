import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deepOrange } from "@mui/material/colors";

import "./styles/profile-menu.css";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../utils/user";

const LOG_OUT = "Log out";

function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  function handleAvatarClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function routeToLoginPage() {
    navigate("/login");
  }

  function routeToListUsesrsPage() {
    navigate("/users/list");
  }

  async function handleClose(option) {
    if (option === LOG_OUT) {
      await logout();
      routeToLoginPage();
    }
    if (option === "List users") {
      routeToListUsesrsPage();
    }
    setAnchorEl(null);
  }

  const profileMenuOptions = ["Your profile", "Change password"];
  const groups = user?.groups ?? [];
  const userIsAdmin = isAdmin(groups);
  if (userIsAdmin) {
    const optionsForAdmin = ["List users"];
    profileMenuOptions.push(...optionsForAdmin);
  }
  profileMenuOptions.push("Log out");

  return (
    <div className="profile-menu-container">
      <Avatar
        onClick={handleAvatarClick}
        sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
        alt={
          user
            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
              user.email
            : ""
        }
      >
        {user?.firstName?.[0] ?? user?.email?.[0] ?? "?"}
      </Avatar>

      <Menu 
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
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
