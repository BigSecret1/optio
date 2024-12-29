import * as React from "react";
import { useState, useContext } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { TaskContext } from "../../../contexts/TaskContext";

export default function EditTaskDescription({ taskId }) {
  const { task, getUpdatedTask, taskService, setIsEditingTaskDescription } =
    useContext(TaskContext);

  const [description, setDescription] = useState(task.description);

  function handleEditing(event) {
    setDescription(event.target.value);
  }

  function handleSave() {
    taskService.updateTask({ id: taskId, description: description });
    getUpdatedTask(taskId);
    setIsEditingTaskDescription(false);
  }

  function handleClose() {
    setIsEditingTaskDescription(false);
  }

  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={5}
          defaultValue={description}
          style={{ width: "100%" }}
          onChange={handleEditing}
        />
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Box>
  );
}
