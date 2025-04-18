import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deepOrange } from "@mui/material/colors";

import "./styles/profile-menu.css";

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  function handleAvatarClick(event){
    setAnchorEl(event.currentTarget); 
  };

  function handleClose(){
    setAnchorEl(null);
  };

  const profileMenuOptions = [
    "Your account",
    "Your projects",
    "Your tasks",
    "Sign out",
    "Your account",
    "Your projects",
    "Your tasks",
    "Sign out",
  ];

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
            className: 'profile-menu',
          }}
      >
        {profileMenuOptions.map((option) => (
          <MenuItem key={option} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default ProfileMenu;
