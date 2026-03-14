import React, { useState, useContext } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

import { NewContext } from "../../contexts/NewContext";
import { CancelButton, SubmitButton, FormTextField } from "../common";
import ApiManager from "../../api-client/api-manager";

export default function NewProject() {
  const { openCreateProject, setOpenCreateProject } = useContext(NewContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreateProject(e) {
    e.preventDefault();
    await ApiManager.createProject({
      name: name,
      description: description,
    });
    setOpenCreateProject(false);
  }

  function handleCancel() {
    setOpenCreateProject(false);
  }

  return (
    <div>
      <Dialog
        open={openCreateProject}
        onClose={handleCancel}
        PaperProps={{
          component: "form",
          onSubmit: handleCreateProject,
          sx: {
            width: "1000px",
            maxWidth: "90vw",
            backgroundColor: "#3F5880",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: { xs: 22, sm: 26 },
            color: "#ffffff",
            pb: 1,
          }}
        >
          Create Project
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            <FormTextField
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormTextField
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={5}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <CancelButton onClose={handleCancel} />
          <SubmitButton actionText="Create" processText="Create" />
        </DialogActions>
      </Dialog>
    </div>
  );
}
