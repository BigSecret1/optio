import React from "react";
import { useState, useContext } from "react";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import "./styles/options.css";

export default function Options({ options = [], children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuItemSelection(option) {
    console.log("Choosen option is ", option);
  }

  return (
    <div className="menu-container">
      <div
        onClick={handleClick}
        aria-controls="simple-menu"
        aria-haspopup="true"
        role="button"
        tabIndex={0}
        className="childContainer"
      >
        {children}
      </div>
      <Menu
        PaperProps={{
          className: "menu-paper",
        }}
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        {options.map((option, index) => {
          return (
            <MenuItem
              onClick={() => {
                handleMenuItemSelection(option);
                handleClose();
              }}
              className="menu-item"
              key={index}
            >
              {option}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
