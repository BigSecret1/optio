import React, { useState, useRef, useEffect, useContext } from "react";
import { Box, Menu, MenuItem } from "@mui/material";

import "./styles/create.css";
import { NewContext } from "../../contexts/NewContext";
import NewTask from "../task/NewTask";

export default function Create() {
  const { setOpenCreateProject } = useContext(NewContext);
  const [isOpen, setIsOpen] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {}, []);

  function createTask(taskDetails) {
    console.log("Creating task with data:", taskDetails);
  }

  function handleOpenCreateMenu(e) {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
      setAnchorEl(null);
    } else {
      setIsOpen(true);
      setAnchorEl(e.currentTarget);
    }
  }

  return (
    <div className="create-container">
      {/* Dropdown trigger */}
      <div className="create-dropdown-button" onClick={handleOpenCreateMenu}>
        <span className="plus-icon">+</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => {
          // required: close handler
          setIsOpen(false);
          setAnchorEl(null);
        }}
        MenuListProps={{
          onClick: (e) => e.stopPropagation(), // keep clicks inside
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenCreateProject(true);
            setIsOpen(false);
            setAnchorEl(null);
          }}
        >
          Project
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenCreateTask(true);
            setIsOpen(false);
            setAnchorEl(null);
          }}
        >
          Task
        </MenuItem>
      </Menu>

      {/* Dialog kept OUTSIDE the dropdown so it doesn't unmount */}
      <NewTask
        open={openCreateTask}
        onClose={() => setOpenCreateTask(false)}
        onSubmit={(data) => {
          createTask(data);
          setOpenCreateTask(false);
        }}
      />
    </div>
  );
}
