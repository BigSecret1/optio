import React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';

import { StateContext } from '../../TaskStateProvider';

// For Dialogue box which comes after menu option selection
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';



/*
    # A Dialogue box which popsup when edit task option is choosen from task option menu.
*/
export default function UpdateTaskTitle({ taskId }) {
    const {
        task,
        setEditTaskTitle,
        taskService,
        getUpdatedTask,
        open, setOpen,
    } = useContext(StateContext);

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

    const [taskTitle, setTaskTitle] = useState(task.title);

    const change = "Task title";
    const changeInfo = "Feel free to update your task title."

    function handleEditTitle(event) {
        setTaskTitle(event.target.value);
    }

    function handleClose() {
        setOpen(false);
        setEditTaskTitle(false);
    };

    function handleSave() {
        console.log("Saving task with new title", taskTitle);
        taskService.updateTask({ id: taskId, title: taskTitle });
        getUpdatedTask(taskId);
        setOpen(false);
        setEditTaskTitle(false);
    }

    return (
        <>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
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
                            <input name="taskTitle" onChange={handleEditTitle} value={taskTitle} />
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

