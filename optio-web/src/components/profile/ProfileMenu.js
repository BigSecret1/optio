import React, { useMemo, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deepOrange } from "@mui/material/colors";

import "./styles/profile-menu.css";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/user";

const MenuOption = Object.freeze({
  YOUR_PROFILE: "Your profile",
  CHANGE_PASSWORD: "Change password",
  LIST_USERS: "List users",
  LOG_OUT: "Log out",
});

const BASE_OPTIONS = [MenuOption.YOUR_PROFILE, MenuOption.CHANGE_PASSWORD];
const ADMIN_OPTIONS = [MenuOption.LIST_USERS];

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const role = getUserRole(user);

  const menuOptions = useMemo(() => {
    const options = [...BASE_OPTIONS];
    if (role === "admin") {
      options.push(...ADMIN_OPTIONS);
    }
    options.push(MenuOption.LOG_OUT);
    return options;
  }, [role]);

  function handleOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleMenuSelect(option) {
    handleClose();

    switch (option) {
      case MenuOption.LOG_OUT:
        await logout();
        navigate("/login");
        break;
      case MenuOption.LIST_USERS:
        navigate("/users/list");
        break;
      case MenuOption.YOUR_PROFILE:
        navigate("/profile");
        break;
      default:
        break;
    }
  }

  return (
    <div className="profile-menu-container">
      <Avatar
        onClick={handleOpen}
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
        {menuOptions.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
