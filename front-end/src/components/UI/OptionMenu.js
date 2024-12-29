import React from "react";
import { useState, useContext } from 'react';

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import "../../styles/OptionMenu.css";
import { TaskContext } from '../../contexts/TaskContext';



/** 
    * This component renders 2 components, when optionMenu component has a rendering call
    * it first render the ThreeDotComponent(shows 3 dots) and if those dots are clikec it 
    * popus a menu to select option.
    * Based on selected option the child component is being rendered because each selected
    * option changes a state.
    * for e.g. 
    * click on 3 dots in task header section >> choose edit task title option >> the edit task title dialogue will pop up
 */
export default function OptionMenu({ options = [], children }) {
    const {
        optionToState
    } = useContext(TaskContext);

    const [anchorEl, setAnchorEl] = useState(null);

    // Closes option menu upon click on option icon or out of option menu 
    function handleClose() {
        setAnchorEl(null);
    };

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    };

    /**
        * This function change the state of selected option. 
        * Each option has respective mapping with the state it is mapped with in 
        * optionToState map.
     */
    function handleMenuItemSelection(option) {
        const stateSetter = optionToState.get(option);
        if (stateSetter) {
            stateSetter((prev) => !prev);
        }
        else {
            console.warn(`No state found for the option: "${option}"`);
        }
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

