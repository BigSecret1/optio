import React, { useState, useContext } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import "./styles/new-project.css";
import { NewContext } from "../../contexts/NewContext";

export default function NewProject() {
  const { openCreateProject, setOpenCreateProject } = useContext(NewContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    setOpenCreateProject(false);
  }

  function handleClose() {
    setOpenCreateProject(false);
  }

  return (
    <div>
      <Dialog
        open={openCreateProject}
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
        <DialogTitle className="new-project-dialog-title">Project</DialogTitle>
        <DialogContent className="new-project-dialog-content">
          <label htmlFor="name">Name</label>
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
        </DialogContent>

        <DialogActions className="new-project-dialog-actions">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
