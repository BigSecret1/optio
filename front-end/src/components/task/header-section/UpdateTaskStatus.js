import React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { StateContext } from '../../TaskStateProvider';
import { ALL_STATUS } from '../../task-service';

// For Dialogue box which comes after menu option selection
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// matrical UI
import Box from '@mui/material/Box';



/*
    * Component is to render when in option menu Change status option is selected
    in header section.
*/
export default function UpdateTaskStatus({ taskId }) {
    const {
        task, setTask,
        openChangeStatus, setOpenChangeStatus,
    } = useContext(StateContext);

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

    const change = "Task Staus";
    const changeInfo = "Feel free to update your task status."
    let allStatus = ALL_STATUS;
    const currentTaskStatus = task.task_status;
    allStatus = PlaceCurrentTaskStatusAtFirst(allStatus, currentTaskStatus)

    function PlaceCurrentTaskStatusAtFirst(allStatus, currentStatus) {
        for (let i = 0; i < allStatus.length; ++i) {
            console.log(allStatus[i], " ", currentStatus);
            if (allStatus[i].toLowerCase() === currentStatus.toLowerCase()) {
                [allStatus[i], allStatus[0]] = [allStatus[0], allStatus[i]];
                break;
            }
        }
        return allStatus;
    }

    function handleSave() {

    }

    function handleClose() {
        setOpenChangeStatus(false);
    };

    function handleTaskStatusChange(event) {
        console.log("You are changing task status to ", event.target.value);
    }

    return (
        <>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={openChangeStatus}
                onClose={handleClose}
            >
                <DialogTitle>{change}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {changeInfo}
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <InputLabel htmlFor="max-width">Status</InputLabel>
                            <Select
                                autoFocus
                                value={currentTaskStatus}
                                onChange={handleTaskStatusChange}
                                label="maxWidth"
                                inputProps={{
                                    name: 'max-width',
                                    id: 'max-width',
                                }}
                            >
                                {
                                    allStatus.map(status => {
                                        return (
                                            <MenuItem key={status} value={status}>{status}</MenuItem>);
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
