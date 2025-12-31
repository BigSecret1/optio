import React from "react";
import { useState, useContext } from "react";

import { Box, Grid } from "@mui/material";
import { TextField } from "@mui/material";

import { TaskContext } from "../../../contexts/TaskContext";
import SubmitButton from "../../common/SubmitButton";
import CancelButton from "../../common/CancelButton";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

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
      sx={{ "& .MuiTextField-root": { m: 1 } }}
      onSubmit={handleSave}
      noValidate
      autoComplete="off"
    >
      <TextField      
        value={description}
        onChange={handleEditing}
        fullWidth
        multiline
        minRows={5}
        sx={fieldSx}
        InputLabelProps={{ shrink: false }}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <SubmitButton actionText="Save" />
        <CancelButton onClose={handleClose} />
      </Box>
    </Box>
  );
}
