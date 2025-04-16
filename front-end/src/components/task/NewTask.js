import React, { useState, useContext } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import "./styles/new-task.css";
import { NewContext } from "../../contexts/NewContext";

export default function NewTask() {
  const { openCreateTask, setOpenCreateTask } = useContext(NewContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit() {
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
          <label htmlFor="name">Title</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label for="dropdown">Status</label>
          <select id="dropdown" name="options">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </DialogContent>

        <DialogActions className="new-task-dialog-actions">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
