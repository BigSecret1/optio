import React, { useState, useContext } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, Select, MenuItem } from "@mui/material";

import "./styles/new-task.css";
import { NewContext } from "../../contexts/NewContext";
import { TASK_STATUS } from "../../constants";
import Task from "../../services/task/task-service";

export default function NewTask() {
  const taskAction = new Task();
  const { openCreateTask, setOpenCreateTask } = useContext(NewContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(TASK_STATUS[0]);

  function handleSubmit() {
    const data = {
      title: title,
      description: description,
      status: status,
      project: 2, // this is dummy value, need to improve this part
    };
    taskAction.create(data);

    setOpenCreateTask(false);
  }

  function handleClose() {
    setOpenCreateTask(false);
  }

  return (
    <div>
      <Dialog
        open={openCreateTask}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
          sx: {
            width: "1000px",
            maxWidth: "90vw",
            backgroundColor: "#3F5880",
          },
        }}
      >
        <DialogTitle className="new-task-dialog-title">Task</DialogTitle>
        <DialogContent className="new-task-dialog-content">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            {TASK_STATUS.map((statusOption) => {
              return (
                <MenuItem key={statusOption} value={statusOption}>
                  {statusOption}
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>

        <DialogActions className="new-task-dialog-actions">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
