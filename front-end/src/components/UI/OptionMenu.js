import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import "./OptionMenu.css"; // Import the CSS file

export default function OptionMenu({ children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const options = ['Upload tasks', 'Change status', 'Edit title']

    // Closes option menu upon click on option icon or out of option menu 
    function handleClose() {
        setAnchorEl(null);
    };

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    };

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
                    className: "menu-paper", // Apply CSS class for Paper styling
                }}
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}
            >
                {
                    options.map((option) => {
                        return (
                            <MenuItem onClick={handleClose} className="menu-item">
                                {option}
                            </MenuItem>
                        )
                    })
                }

            </Menu>
        </div>
    );
};

