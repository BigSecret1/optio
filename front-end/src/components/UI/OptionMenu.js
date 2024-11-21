import React from "react";
import { useEffect, useState, createContext, useContext } from 'react';
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";

import "./OptionMenu.css";
import { StateContext } from '../TaskStateProvider';



export default function OptionMenu({ options = [], children }) {
    const {
        task, setTask,
        loading, setLoading,
        editTaskTitle, setEditTaskTitle,
        taskService,
        getUpdatedTask,
        open, setOpen,
        openChangeStatus, setOpenChangeStatus

    } = useContext(StateContext);

    const [anchorEl, setAnchorEl] = useState(null);

    // Closes option menu upon click on option icon or out of option menu 
    function handleClose() {
        setAnchorEl(null);
    };

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    };

    function handleMenuItemSelection(option) {
        console.log("You selected ", option);
        if (option === "Change status") {
            setOpenChangeStatus(true);
        }
        else {
            setEditTaskTitle(true);
            setOpen(true);
        }
    }

    return (
        <div className="menu-container">
            <div
                onClick={handleClick}
                aria-controls="simple-menu"
                aria-haspopup="true"
                role="button" // Adds a button-like role for accessibility
                tabIndex={0} // Makes the div focusable
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
                {
                    options.map((option, index) => {
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
                        )
                    })
                }

            </Menu>
        </div>
    );
};

