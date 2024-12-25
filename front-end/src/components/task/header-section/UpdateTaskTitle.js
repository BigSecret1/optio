import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

import { TaskContext } from "../../../contexts/TaskContext";

// For Dialogue box which comes after menu option selection
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";

/**
 * A Dialogue box which pops up when edit task option is choosen from
 * task header option menu
 */
export default function UpdateTaskTitle({ taskId }) {
  const { task, setIsEditingTaskTitle, taskService, getUpdatedTask } =
    useContext(TaskContext);

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");

  const [taskTitle, setTaskTitle] = useState(task.title);

  const change = "Task title";
  const changeInfo = "Feel free to update your task title.";

  function hadleEditing(event) {
    setTaskTitle(event.target.value);
  }

  function handleSave() {
    taskService.updateTask({ id: taskId, title: taskTitle });
    getUpdatedTask(taskId);
    setIsEditingTaskTitle(false);
  }

  function handleClose() {
    setIsEditingTaskTitle(false);
  }

  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={true}
        onClose={handleClose}
      >
        <DialogTitle>{change}</DialogTitle>
        <DialogContent>
          <DialogContentText>{changeInfo}</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <input
                name="taskTitle"
                onChange={hadleEditing}
                value={taskTitle}
              />
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
